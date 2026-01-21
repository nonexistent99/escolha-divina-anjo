import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createPixPayment, checkPaymentStatus } from "./lxpay.js";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  payment: router({
    createPix: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        document: z.string().min(11).max(14),
      }))
      .mutation(async ({ input }) => {
        const result = await createPixPayment({
          amount: 29.90,
          client: {
            name: input.name,
            email: input.email,
            phone: input.phone || "",
            document: input.document,
          },
          product: {
            id: "uncao-sagrada",
            name: "Unção Sagrada - Manuscrito do Arcanjo Miguel",
            quantity: 1,
            price: 29.90,
          },
        });
        
        return result;
      }),

    checkStatus: publicProcedure
      .input(z.object({
        transactionId: z.string(),
      }))
      .query(async ({ input }) => {
        const result = await checkPaymentStatus(input.transactionId);
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
