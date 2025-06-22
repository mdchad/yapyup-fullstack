import {
  useRouteContext,
  Outlet,
  redirect,
  createLazyFileRoute,
} from "@tanstack/react-router";
import { SidebarProvider } from "@repo/ui/sidebar";
import { AppSidebar } from "@repo/ui/app-sidebar";
import DashboardHeader from "@repo/ui/dashboard-header";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createLazyFileRoute("/_protected/chat")({
  component: Dashboard,
});

function Dashboard() {
  return <div className="bg-lilac-200">Chat</div>;
}
