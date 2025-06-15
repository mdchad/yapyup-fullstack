import {
  createFileRoute,
  Outlet,
  useRouteContext,
} from "@tanstack/react-router";
// import DashboardHeader from "@/components/ui/dashboard-header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import DashboardHeader from "@/components/ui/dashboard-header";

export const Route = createFileRoute("/_protected/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { auth, organization } = useRouteContext({
    from: "/_protected/dashboard",
    select: (context) => context,
  });

  return (
    <SidebarProvider>
      {/*<div className="min-h-screen bg-gray-50 p-6">*/}
      <AppSidebar user={auth?.data?.user} organization={organization?.data} />
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
