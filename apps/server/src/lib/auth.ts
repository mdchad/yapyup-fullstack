import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { admin, organization } from "better-auth/plugins";
import resend from "./resend";
import { desc, eq } from "drizzle-orm";
import resendInvitation from "@/utils/resend-invitation";
import { ac, owner, adminRole, member } from "@/lib/permissions";

import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      ac,
      roles: {
        owner,
        adminRole,
        member,
      },
      // Optional: Configure organization plugin options here
      creatorRole: "owner",
      async sendInvitationEmail(data) {
        const userExist = await db
          .select({ id: schema.user.id })
          .from(schema.user)
          .where(eq(schema.user.email, data?.email))
          .limit(1);

        const step = userExist.length ? "login" : "signup";
        const inviteLink = `${process.env.CORS_ORIGIN!}/auth/accept-invitation/${data.id}?step=${step}&email=${data.email}`;

        await resend.emails.send(resendInvitation(data, inviteLink));
      },
    }),
    admin(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      // createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "basic - monthly",
            priceId: "price_1Rbz7fK8PmgjafN9T2X6eDqH",
            annualDiscountPriceId: "price_1RcamcK8PmgjafN9TwojpvKR",
            limits: {
              projects: 5,
              storage: 10,
            },
          },
          {
            name: "pro",
            priceId: "price_1RcanjK8PmgjafN9R2inWYqj",
            annualDiscountPriceId: "price_1RcaoMK8PmgjafN9OyBq33CQ",
          },
        ],
      },
    }),
  ],
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
});
