import {
  getSessionCookieName,
  getSessionCookieOptions,
} from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContribution, getLeaderboard, listContributions, listPendingContributions, reviewContribution } from "./contributions";
import { getCatalogProduct, getCatalogProductByBarcode, listCatalog, listDraftCatalog, publishCatalogProduct } from "./catalog";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(getSessionCookieName(ctx.req), {
        ...cookieOptions,
        maxAge: -1,
      });
      return {
        success: true,
      } as const;
    }),
  }),

  catalog: router({
    list: publicProcedure.query(() => listCatalog()),
    byId: publicProcedure.input(z.object({ id: z.string().min(1).max(64) })).query(({ input }) => getCatalogProduct(input.id)),
    byBarcode: publicProcedure.input(z.object({ barcode: z.string().min(1).max(32) })).query(({ input }) => getCatalogProductByBarcode(input.barcode)),
    drafts: adminProcedure.query(() => listDraftCatalog()),
    publish: adminProcedure.input(z.object({
      id: z.string().min(1).max(64),
      nameEn: z.string().min(1).max(180),
      nameBn: z.string().min(1).max(180),
      brandEn: z.string().min(1).max(180),
      brandBn: z.string().min(1).max(180),
      sizeEn: z.string().min(1).max(120),
      sizeBn: z.string().min(1).max(120),
      descriptionEn: z.string().min(1).max(500),
      descriptionBn: z.string().min(1).max(500),
      ingredients: z.array(z.object({ en: z.string().min(1).max(180), bn: z.string().min(1).max(180) })).max(40),
    })).mutation(({ input }) => publishCatalogProduct(input.id, input)),
  }),

  contributions: router({
    submit: publicProcedure
      .input(z.object({
        contributorKey: z.string().min(16).max(80),
        displayName: z.string().max(80).optional(),
        publicLeaderboard: z.boolean().default(false),
        productName: z.string().min(1).max(180),
        brand: z.string().max(180).optional(),
        barcode: z.string().max(32).optional(),
        category: z.enum(["food", "personalCare", "household"]),
        frontImage: z.object({ base64: z.string().min(1).max(8_000_000), mimeType: z.string().min(1).max(80) }),
        backImage: z.object({ base64: z.string().min(1).max(8_000_000), mimeType: z.string().min(1).max(80) }),
      }))
      .mutation(({ input }) => createContribution(input)),
    mine: publicProcedure
      .input(z.object({ contributorKey: z.string().min(16).max(80) }))
      .query(({ input }) => listContributions(input.contributorKey)),
    leaderboard: publicProcedure.query(() => getLeaderboard()),
    pending: adminProcedure.query(() => listPendingContributions()),
    review: adminProcedure
      .input(z.object({
        id: z.number().int().positive(),
        status: z.enum(["accepted", "rejected", "needs-clearer-photo"]),
        reviewNote: z.string().max(500).optional(),
      }))
      .mutation(({ input }) => reviewContribution(input.id, input.status, input.reviewNote)),
  }),
});

export type AppRouter = typeof appRouter;
