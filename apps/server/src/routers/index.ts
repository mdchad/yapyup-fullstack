import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import * as schema from "../db/schema/auth";
import { z } from "zod";
import { db } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import * as resourceSchema from "@/db/schema/resource";
import { createId } from "@paralleldrive/cuid2";

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
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    const notes = await db
      .select()
      .from(resourceSchema.note)
      .where(
        and(
          eq(
            resourceSchema.note.organizationId,
            ctx.session.session.activeOrganizationId,
          ), // Tenant check
          eq(resourceSchema.note.userId, ctx.session.session.userId), // User check
        ),
      )
      .orderBy(desc(resourceSchema.note.updatedAt));

    return notes;
  }),
  createNote: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().optional(),
        organizationId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newNote = await db
        .insert(resourceSchema.note)
        .values({
          id: createId(),
          title: input.title,
          content: input.content || "",
          userId: ctx.session.session.userId,
          organizationId: ctx.session.session.activeOrganizationId,
        })
        .returning();

      return newNote[0];
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
