import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { admin, organization } from "better-auth/plugins";
import resend from "./resend";
import { desc, eq } from "drizzle-orm";
import resendInvitation from "@/utils/resend-invitation";

export const auth: any = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await resend.emails.send({
        from: "Yapyup <onboarding@notifications.yapyup.com>", // You could add your custom domain
        to: "delivered@resend.dev", // email of the user to want to end
        subject: "Reset your password", // Main subject of the email
        html: `<a href=${url}>Click here to reset your password</a>`, // Content of the email
        // you could also use "React:" option for sending the email template and there content to user
      });
    },
  },
  databaseHooks: {
    session: {
      create: {
        async before(session) {
          const lastSession = await db
            .select({
              activeOrganizationId: schema.session.activeOrganizationId,
            })
            .from(schema.session)
            .where(eq(schema.session.userId, session.userId))
            .orderBy(desc(schema.session.createdAt))
            .limit(1);

          let activeOrganizationId =
            lastSession[0]?.activeOrganizationId || null;

          if (!activeOrganizationId) {
            const organizationId = await db
              .select({ organizationId: schema.member.organizationId })
              .from(schema.member)
              .where(eq(schema.member.userId, session.userId))
              .orderBy(desc(schema.member.createdAt))
              .limit(1);

            activeOrganizationId = organizationId[0]?.organizationId || null;
          }

          return {
            data: {
              ...session,
              activeOrganizationId,
            },
          };
        },
      },
      // update: {
      //   async after(session) {
      //     await usersRepo.setUserDefaultOrganization(
      //       session.userId,
      //       (session as any).activeOrganizationId,
      //     )
      //   },
      // },
    },
  },
  plugins: [
    organization({
      // Optional: Configure organization plugin options here
      creatorRole: "owner",
      async sendInvitationEmail(data) {
        const userExist = await db
          .select({ id: schema.user.id })
          .from(schema.user)
          .where(eq(schema.user.email, data?.email))
          .limit(1);

        console.log(userExist);
        console.log(data.email);

        const step = userExist.length ? "login" : "signup";
        const inviteLink = `${process.env.CORS_ORIGIN!}/accept-invitation/${data.id}?step=${step}&email=${data.email}`;

        await resend.emails.send(resendInvitation(data, inviteLink));
      },
    }),
    admin(),
  ],
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
});
