import {
  createFileRoute,
  useRouteContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { SidebarProvider } from "@repo/ui/sidebar";
import { AppSidebar } from "@repo/ui/app-sidebar";
import DashboardHeader from "@repo/ui/dashboard-header";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected")({
  component: PathlessLayoutComponent,
  beforeLoad: async ({ context }) => {
    const isAuthenticated = !!context.auth?.data?.session?.id;
    const isPending = context.auth?.isPending;

    if (
      !isPending &&
      isAuthenticated &&
      !context.organization?.isPending &&
      !context?.organization?.data
    ) {
      throw redirect({
        to: "/auth/signinhandler",
      });
    }
  },
});

function PathlessLayoutComponent() {
  const { auth, organization } = useRouteContext({
    from: "/_protected",
    select: (context) => ({
      auth: context.auth,
      organization: context.organization,
    }),
  });

  const { data: organizations } = authClient.useListOrganizations();

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } catch (error) {
      console.log("err", error);
      toast.error("Error logging out. Please try again", {});
    }
  }

  if (auth?.isPending) {
    return;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={auth?.data?.user}
        organization={organization?.data}
        organizations={organizations}
        handleSignOut={handleSignOut}
      />
      <div className="w-full">
        <DashboardHeader />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
