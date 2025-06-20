import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import * as schema from "../db/schema/auth";
import { z } from "zod";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  simple: publicProcedure.query(async () => {
    const lastSession = await db
      .select({ activeOrganizationId: schema.session.activeOrganizationId })
      .from(schema.session);
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  getUserInvitations: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const invitations = await db
        .select({
          id: schema.invitation.id,
          email: schema.invitation.email,
          role: schema.invitation.role,
          status: schema.invitation.status,
          expiresAt: schema.invitation.expiresAt,
          organizationId: schema.invitation.organizationId,
          organizationName: schema.organization.name,
          inviterName: schema.user.name,
        })
        .from(schema.invitation)
        .innerJoin(
          schema.organization,
          eq(schema.invitation.organizationId, schema.organization.id),
        )
        .innerJoin(schema.user, eq(schema.invitation.inviterId, schema.user.id))
        .where(
          and(
            eq(schema.invitation.email, input.email),
            eq(schema.invitation.status, "pending"),
          ),
        );

      return invitations;
    }),
});
export type AppRouter = typeof appRouter;
