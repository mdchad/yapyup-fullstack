import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@repo/ui/sonner";
import { queryClient, type trpc } from "@/utils/trpc";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@repo/ui/globals.css";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { router } from "@/main";
import { z } from "zod";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
  auth: ReturnType<typeof authClient.useSession> | undefined;
  organization: ReturnType<typeof authClient.useActiveOrganization> | undefined;
}

const redirectSearchSchema = z.object({
  app_redirect: z.string().optional(),
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
  validateSearch: redirectSearchSchema,
  beforeLoad: async ({ context, location }) => {
    const isAuthenticated = !!context.auth?.data?.session?.id;
    const isPending = context.auth?.isPending;

    // const isAuthenticated = !!session?.user
    const isDashboardRoute = location.pathname.startsWith("/dashboard");
    const isDashboardRedirectRoute =
      location &&
      location.search &&
      location.search.app_redirect &&
      location.search.app_redirect.startsWith("/dashboard");
    if (!isAuthenticated && !isPending && isDashboardRoute) {
      throw redirect({
        to: "/sign-in",
        search: {
          app_redirect: location.href,
        },
      });
    }

    if (
      isAuthenticated &&
      isDashboardRedirectRoute &&
      location.searchStr !== ""
    ) {
      throw redirect({
        to: location.search.app_redirect,
      });
    }
  },
  component: RootComponent,
  errorComponent: ({ error }) => {
    console.error("route error:", error);
    console.error("HOIII");
    return <div>Route Error: {error.message}</div>;
  },
});

function RootComponent() {
  const session = authClient.useSession();

  useEffect(() => {
    router.invalidate();
  }, [session?.data?.session?.id]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
