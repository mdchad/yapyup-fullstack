import {
  createFileRoute,
  useRouteContext,
  Outlet,
} from "@tanstack/react-router";
import { SidebarProvider } from "@repo/ui/sidebar";
import { AppSidebar } from "@repo/ui/app-sidebar";
import DashboardHeader from "@repo/ui/dashboard-header";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { auth, organization } = useRouteContext({
    from: "/",
    select: (context) => ({
      auth: context.auth,
      organization: context.organization,
    }),
  });

  const { data: organizations } = authClient.useListOrganizations();

  console.log("organizations", organizations);

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
