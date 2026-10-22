import { and, eq, inArray } from "drizzle-orm";
import { productCatalog } from "../drizzle/schema";
import { products as localProducts, type Product } from "../lib/nutriscan-data";
import { getDb } from "./db";

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
  if (!db) return localProducts;
  const rows = await db.select().from(productCatalog).where(inArray(productCatalog.status, ["published"]));
  const records = rows.map((row) => parseRecord(row.recordJson)).filter((record): record is Product => Boolean(record));
  return records.length ? records : localProducts;
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
  return localProducts.find((product) => product.id === id) ?? null;
}

export async function getCatalogProductByBarcode(barcode: string) {
  const normalized = barcode.trim();
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(productCatalog).where(and(eq(productCatalog.barcode, normalized), eq(productCatalog.status, "published"))).limit(1);
    const record = rows[0] ? parseRecord(rows[0].recordJson) : null;
    if (record) return record;
  }
  return localProducts.find((product) => product.barcode === normalized) ?? null;
}
