import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const contributions = mysqlTable(
  "contributions",
  {
    id: int("id").autoincrement().primaryKey(),
    contributorKey: varchar("contributorKey", { length: 80 }).notNull(),
    displayName: varchar("displayName", { length: 80 }),
    publicLeaderboard: int("publicLeaderboard").default(0).notNull(),
    productName: varchar("productName", { length: 180 }).notNull(),
    brand: varchar("brand", { length: 180 }),
    barcode: varchar("barcode", { length: 32 }),
    category: mysqlEnum("category", ["food", "personalCare", "household"]).notNull(),
    frontImageUrl: text("frontImageUrl").notNull(),
    backImageUrl: text("backImageUrl").notNull(),
    status: mysqlEnum("status", ["pending", "accepted", "rejected", "needs-clearer-photo"]).default("pending").notNull(),
    reviewNote: text("reviewNote"),
    pointsAwarded: int("pointsAwarded").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    reviewedAt: timestamp("reviewedAt"),
  },
  (table) => ({
    contributorIdx: index("contributions_contributor_idx").on(table.contributorKey),
    leaderboardIdx: index("contributions_leaderboard_idx").on(table.status, table.publicLeaderboard),
  }),
);

export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = typeof contributions.$inferInsert;
