import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import * as schema from "../db/schema/auth";

import { db } from "@/db";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  simple: publicProcedure.query(async () => {
    const lastSession = await db
      .select({ activeOrganizationId: schema.session.activeOrganizationId })
      .from(schema.session);
    console.log(lastSession);
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});
export type AppRouter = typeof appRouter;
