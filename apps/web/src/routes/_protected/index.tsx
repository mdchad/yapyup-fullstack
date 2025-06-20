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

export const Route = createFileRoute("/_protected/")({
  component: Dashboard,
});

function Dashboard() {
  return <div>Dashboard!!</div>;
}
