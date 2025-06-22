import { RouterProvider, createRouter, Link } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpc } from "./utils/trpc";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { OrgProvider, useOrg } from "@/providers/org-provider";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    trpc,
    queryClient,
    auth: undefined,
    organization: undefined,
  },
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    );
  },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const auth = useAuth();
  const organization = useOrg();

  useEffect(() => {
    if (!organization.isPending && !auth.isPending) {
      router.invalidate();
    }
  }, [
    organization.isPending,
    auth.isPending,
    organization.data,
    auth?.data?.session?.id,
  ]);

  return <RouterProvider router={router} context={{ auth, organization }} />;
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AuthProvider>
      <OrgProvider>
        <App />
      </OrgProvider>
    </AuthProvider>,
  );
}
