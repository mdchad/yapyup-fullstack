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
  type ParsedLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@repo/ui/globals.css";
import { authClient } from "@/lib/auth-client";
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

type RedirectSearch = z.infer<typeof redirectSearchSchema>;

export const Route = createRootRouteWithContext<RouterAppContext>()({
  validateSearch: redirectSearchSchema,
  beforeLoad: async ({
    context,
    location,
  }: {
    context: RouterAppContext;
    location: ParsedLocation<RedirectSearch>;
  }) => {
    const isAuthenticated = !!context.auth?.data?.session?.id;
    const isPending = context.auth?.isPending;

    const isAuthRoute = location.pathname.startsWith("/auth");

    const isDashboardRedirectRoute =
      location &&
      location.search &&
      location.search.app_redirect &&
      !location.search.app_redirect.startsWith("/auth");

    if (!isAuthenticated && !isPending && !isAuthRoute) {
      console.log("redirecting to sign in");
      throw redirect({
        to: "/auth/sign-in",
        search: {
          ...(location.href !== "/" && { app_redirect: location.href }),
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
    return <div>Route Error: {error.message}</div>;
  },
});

function RootComponent() {
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
