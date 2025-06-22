import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [
    organizationClient(),
    adminClient(),
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
  ],
});
