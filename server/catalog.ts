import { and, eq, inArray, sql } from "drizzle-orm";
import { productCatalog, type InsertProductCatalogRecord } from "../drizzle/schema";
import { products as localProducts, type Product } from "../lib/nutriscan-data";
import { getDb } from "./db";

const memoryDrafts: Product[] = [];
const memoryPublished: Product[] = [];

function parseRecord(recordJson: string): Product | null {
  try {
    const record = JSON.parse(recordJson) as Product;
    return record && typeof record.id === "string" && typeof record.barcode === "string" ? record : null;
  } catch {
    return null;
  }
}

async function publishedRecords() {
  const db = await getDb();
  if (!db) return [...memoryPublished, ...localProducts];
  const rows = await db.select().from(productCatalog).where(inArray(productCatalog.status, ["published"]));
  const records = rows.map((row) => parseRecord(row.recordJson)).filter((record): record is Product => Boolean(record));
  return records.length ? records : [...memoryPublished, ...localProducts];
}

export async function listCatalog() {
  return publishedRecords();
}

export async function getCatalogProduct(id: string) {
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(productCatalog).where(and(eq(productCatalog.id, id), eq(productCatalog.status, "published"))).limit(1);
    const record = rows[0] ? parseRecord(rows[0].recordJson) : null;
    if (record) return record;
  }
  return memoryPublished.find((product) => product.id === id) ?? localProducts.find((product) => product.id === id) ?? null;
}

export async function getCatalogProductByBarcode(barcode: string) {
  const normalized = barcode.trim();
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(productCatalog).where(and(eq(productCatalog.barcode, normalized), eq(productCatalog.status, "published"))).limit(1);
    const record = rows[0] ? parseRecord(rows[0].recordJson) : null;
    if (record) return record;
  }
  return memoryPublished.find((product) => product.barcode === normalized) ?? localProducts.find((product) => product.barcode === normalized) ?? null;
}

export async function createDraftCatalogRecord(input: {
  contributionId: number;
  productName: string;
  brand?: string;
  barcode?: string;
  category: "food" | "personalCare" | "household";
}) {
  const id = `contribution-${input.contributionId}`;
  const record: Product = {
    id,
    barcode: input.barcode || `pending-${input.contributionId}`,
    category: input.category,
    name: { en: input.productName, bn: input.productName },
    brand: { en: input.brand || "Pending review", bn: input.brand || "পর্যালোচনাধীন" },
    size: { en: "Variant to be confirmed", bn: "ভ্যারিয়েন্ট নিশ্চিত করা হবে" },
    description: { en: "Draft catalog record created from a reviewed community contribution; details require moderator verification.", bn: "কমিউনিটি অবদান থেকে তৈরি খসড়া ক্যাটালগ রেকর্ড; বিস্তারিত মডারেটরকে যাচাই করতে হবে।" },
    ingredients: [],
    demo: false,
    gradeLabel: { en: "Draft — not published", bn: "খসড়া — প্রকাশিত নয়" },
    factors: [],
    evidence: [{ label: { en: "Community contribution", bn: "কমিউনিটি অবদান" }, value: { en: "Pending moderator enrichment and verification", bn: "মডারেটরের বিস্তারিত যোগ ও যাচাই বাকি" }, status: "unknown" }],
  };
  const values: InsertProductCatalogRecord = {
    id,
    barcode: input.barcode ? `${input.barcode}-draft-${input.contributionId}` : record.barcode,
    category: record.category,
    nameEn: record.name.en,
    nameBn: record.name.bn,
    brandEn: record.brand.en,
    brandBn: record.brand.bn,
    recordJson: JSON.stringify(record),
    status: "draft",
    version: 1,
  };
  const db = await getDb();
  if (db) {
    await db.insert(productCatalog).values(values).onDuplicateKeyUpdate({ set: { recordJson: values.recordJson, updatedAt: new Date() } });
  } else if (!memoryDrafts.some((draft) => draft.id === id)) {
    memoryDrafts.push(record);
  }
  return { id, record };
}

export async function listDraftCatalog() {
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(productCatalog).where(eq(productCatalog.status, "draft"));
    return rows.map((row) => parseRecord(row.recordJson)).filter((record): record is Product => Boolean(record));
  }
  return memoryDrafts;
}

export type CatalogEnrichment = {
  nameEn: string;
  nameBn: string;
  brandEn: string;
  brandBn: string;
  sizeEn: string;
  sizeBn: string;
  descriptionEn: string;
  descriptionBn: string;
  ingredients: { en: string; bn: string }[];
};

export async function getDraftCatalog(id: string) {
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(productCatalog).where(and(eq(productCatalog.id, id), eq(productCatalog.status, "draft"))).limit(1);
    return rows[0] ? parseRecord(rows[0].recordJson) : null;
  }
  return memoryDrafts.find((draft) => draft.id === id) ?? null;
}

export async function publishCatalogProduct(id: string, enrichment: CatalogEnrichment) {
  const current = await getDraftCatalog(id);
  if (!current) return null;
  const record: Product = {
    ...current,
    name: { en: enrichment.nameEn.trim(), bn: enrichment.nameBn.trim() },
    brand: { en: enrichment.brandEn.trim(), bn: enrichment.brandBn.trim() },
    size: { en: enrichment.sizeEn.trim(), bn: enrichment.sizeBn.trim() },
    description: { en: enrichment.descriptionEn.trim(), bn: enrichment.descriptionBn.trim() },
    ingredients: enrichment.ingredients.map((ingredient) => ({ en: ingredient.en.trim(), bn: ingredient.bn.trim() })).filter((ingredient) => ingredient.en && ingredient.bn),
    demo: false,
    gradeLabel: current.category === "food" ? { en: "Evidence review required", bn: "তথ্য যাচাই প্রয়োজন" } : { en: "Evidence summary", bn: "তথ্যের সারাংশ" },
  };
  const db = await getDb();
  if (db) {
    await db.update(productCatalog).set({ nameEn: record.name.en, nameBn: record.name.bn, brandEn: record.brand.en, brandBn: record.brand.bn, recordJson: JSON.stringify(record), status: "published", version: sql`${productCatalog.version} + 1` }).where(eq(productCatalog.id, id));
  } else {
    const index = memoryDrafts.findIndex((draft) => draft.id === id);
    if (index >= 0) memoryDrafts.splice(index, 1);
    memoryPublished.unshift(record);
  }
  return record;
}
