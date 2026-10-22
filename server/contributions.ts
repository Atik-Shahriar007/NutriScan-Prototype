import { and, desc, eq, sql } from "drizzle-orm";
import { contributions, type InsertContribution } from "../drizzle/schema";
import { getDb } from "./db";
import { storagePut } from "./storage";
import { createDraftCatalogRecord } from "./catalog";

type Category = "food" | "personalCare" | "household";
type ContributionStatus = "pending" | "accepted" | "rejected" | "needs-clearer-photo";

type NewContribution = {
  contributorKey: string;
  displayName?: string;
  publicLeaderboard: boolean;
  productName: string;
  brand?: string;
  barcode?: string;
  category: Category;
  frontImage: { base64: string; mimeType: string };
  backImage: { base64: string; mimeType: string };
};

type MemoryContribution = Omit<InsertContribution, "id"> & { id: number };
const memoryContributions: MemoryContribution[] = [];
let nextMemoryId = 1;

function dataUrl(base64: string, mimeType: string) {
  return `data:${mimeType};base64,${base64}`;
}

async function uploadImage(contributorKey: string, side: "front" | "back", image: { base64: string; mimeType: string }) {
  try {
    const result = await storagePut(
      `nutriscan/contributions/${contributorKey}/${side}.jpg`,
      Buffer.from(image.base64, "base64"),
      image.mimeType || "image/jpeg",
    );
    return result.url;
  } catch {
    // Local preview and development can run without Forge storage credentials.
    // Keep the image usable in the in-memory fallback instead of dropping it.
    return dataUrl(image.base64, image.mimeType || "image/jpeg");
  }
}

function publicContribution(row: MemoryContribution | Record<string, any>) {
  return {
    id: String(row.id),
    contributorKey: row.contributorKey,
    displayName: row.displayName ?? null,
    publicLeaderboard: Boolean(row.publicLeaderboard),
    productName: row.productName,
    brand: row.brand ?? "",
    barcode: row.barcode ?? "",
    category: row.category as Category,
    frontImageUrl: row.frontImageUrl,
    backImageUrl: row.backImageUrl,
    catalogProductId: row.catalogProductId ?? null,
    status: row.status as ContributionStatus,
    reviewNote: row.reviewNote ?? null,
    pointsAwarded: Number(row.pointsAwarded ?? 0),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

export async function createContribution(input: NewContribution) {
  const [frontImageUrl, backImageUrl] = await Promise.all([
    uploadImage(input.contributorKey, "front", input.frontImage),
    uploadImage(input.contributorKey, "back", input.backImage),
  ]);
  const values: InsertContribution = {
    contributorKey: input.contributorKey,
    displayName: input.displayName?.trim() || null,
    publicLeaderboard: input.publicLeaderboard ? 1 : 0,
    productName: input.productName.trim(),
    brand: input.brand?.trim() || null,
    barcode: input.barcode?.trim() || null,
    category: input.category,
    frontImageUrl,
    backImageUrl,
    status: "pending",
    pointsAwarded: 0,
  };
  const db = await getDb();
  if (db) {
    const result = await db.insert(contributions).values(values);
    const id = Number(result[0].insertId);
    const rows = await db.select().from(contributions).where(eq(contributions.id, id)).limit(1);
    return rows[0] ? publicContribution(rows[0]) : { ...publicContribution({ ...values, id }), id: String(id) };
  }
  const row = { ...values, id: nextMemoryId++, createdAt: new Date(), updatedAt: new Date(), reviewedAt: null } as MemoryContribution;
  memoryContributions.unshift(row);
  return publicContribution(row);
}

export async function listContributions(contributorKey: string) {
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(contributions).where(eq(contributions.contributorKey, contributorKey)).orderBy(desc(contributions.createdAt));
    return rows.map(publicContribution);
  }
  return memoryContributions.filter((row) => row.contributorKey === contributorKey).map(publicContribution);
}

export async function listPendingContributions() {
  const db = await getDb();
  if (db) {
    const rows = await db.select().from(contributions).where(eq(contributions.status, "pending")).orderBy(desc(contributions.createdAt));
    return rows.map(publicContribution);
  }
  return memoryContributions.filter((row) => row.status === "pending").map(publicContribution);
}

export async function getLeaderboard() {
  const db = await getDb();
  if (db) {
    const points = sql<number>`coalesce(sum(${contributions.pointsAwarded}), 0)`;
    const rows = await db
      .select({ contributorKey: contributions.contributorKey, displayName: contributions.displayName, points })
      .from(contributions)
      .where(and(eq(contributions.status, "accepted"), eq(contributions.publicLeaderboard, 1)))
      .groupBy(contributions.contributorKey, contributions.displayName)
      .orderBy(desc(points))
      .limit(20);
    return rows.map((row) => ({ contributorKey: row.contributorKey, displayName: row.displayName || "NutriScan contributor", points: Number(row.points ?? 0) }));
  }
  const grouped = new Map<string, { contributorKey: string; displayName: string; points: number }>();
  for (const row of memoryContributions) {
    if (row.status !== "accepted" || !row.publicLeaderboard) continue;
    const current = grouped.get(row.contributorKey) ?? { contributorKey: row.contributorKey, displayName: row.displayName || "NutriScan contributor", points: 0 };
    current.points += Number(row.pointsAwarded ?? 0);
    grouped.set(row.contributorKey, current);
  }
  return [...grouped.values()].sort((a, b) => b.points - a.points).slice(0, 20);
}

export async function reviewContribution(id: number, status: Exclude<ContributionStatus, "pending">, reviewNote?: string) {
  const pointsAwarded = status === "accepted" ? 25 : 0;
  const db = await getDb();
  if (db) {
    const existingRows = await db.select().from(contributions).where(eq(contributions.id, id)).limit(1);
    const existing = existingRows[0];
    if (!existing) return null;
    let catalogProductId = existing.catalogProductId;
    if (status === "accepted" && !catalogProductId) {
      const draft = await createDraftCatalogRecord({ contributionId: id, productName: existing.productName, brand: existing.brand ?? undefined, barcode: existing.barcode ?? undefined, category: existing.category });
      catalogProductId = draft.id;
    }
    await db.update(contributions).set({ status, reviewNote: reviewNote?.trim() || null, pointsAwarded, catalogProductId, reviewedAt: new Date() }).where(eq(contributions.id, id));
    const rows = await db.select().from(contributions).where(eq(contributions.id, id)).limit(1);
    return rows[0] ? publicContribution(rows[0]) : null;
  }
  const row = memoryContributions.find((item) => item.id === id);
  if (!row) return null;
  if (status === "accepted" && !row.catalogProductId) {
    const draft = await createDraftCatalogRecord({ contributionId: id, productName: row.productName, brand: row.brand ?? undefined, barcode: row.barcode ?? undefined, category: row.category });
    row.catalogProductId = draft.id;
  }
  row.status = status;
  row.reviewNote = reviewNote?.trim() || null;
  row.pointsAwarded = pointsAwarded;
  row.reviewedAt = new Date();
  row.updatedAt = new Date();
  return publicContribution(row);
}
