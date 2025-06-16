import {
  createFileRoute,
  Outlet,
  useRouteContext,
} from "@tanstack/react-router";
import { SidebarProvider } from "@repo/ui/sidebar";
import { AppSidebar } from "@repo/ui/app-sidebar";
import DashboardHeader from "@repo/ui/dashboard-header";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { auth, organization } = useRouteContext({
    from: "/_protected/dashboard",
    select: (context) => ({
      auth: context.auth as ReturnType<typeof authClient.useSession>,
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

  if (auth.isPending) {
    return;
  }

  return (
    <SidebarProvider>
      {/*<div className="min-h-screen bg-gray-50 p-6">*/}
      <AppSidebar
        user={auth?.data?.user}
        organization={organization?.data}
        organizations={organizations}
        handleSignOut={handleSignOut}
      />
      <div className="w-full">
        <DashboardHeader />
        {/*  <div className="flex justify-between items-center mb-8">*/}
        {/*    <h1 className="text-3xl font-bold">Dashboard</h1>*/}
        <Outlet />
        {/*</div>*/}
        {/*</div>*/}
      </div>
    </SidebarProvider>
  );
}
