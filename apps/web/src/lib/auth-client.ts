import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import {
  ac,
  adminRole,
  member,
  owner,
} from "../../../server/src/lib/permissions";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        adminRole,
        member,
      },
    }),
    adminClient(),
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
  ],
});
