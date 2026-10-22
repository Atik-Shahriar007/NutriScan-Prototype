import {
  getSessionCookieName,
  getSessionCookieOptions,
} from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContribution, getLeaderboard, listContributions, reviewContribution } from "./contributions";
import { getCatalogProduct, getCatalogProductByBarcode, listCatalog } from "./catalog";

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
