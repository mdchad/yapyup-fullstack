import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  Plus,
  ChevronsUpDown,
  Ellipsis,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRef } from "react";
import { LayersIcon, type LayersIconHandle } from "@/components/ui/layers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, type CheckIconHandle } from "@/components/ui/check";
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/lib/queries/auth";
import { toast } from "sonner";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar({ user }: { user: any }) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  const { data, isLoading } = useQuery(authQueries.activeMember());

  const iconRef = useRef(null);
  const layersIconRef = useRef<LayersIconHandle | null>(null);
  const checkIconRef = useRef<CheckIconHandle | null>(null);

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } catch (error) {
      console.log("err", error);
      toast.error("Error logging out. Please try again", {});
    }
  }

  return (
    <Sidebar collapsible="icon" className="bg-slate-50/60">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="cursor-pointer px-2 py-5 font-medium text-gray-600 capitalize hover:bg-slate-200"
                  onMouseEnter={() => layersIconRef.current?.startAnimation()}
                  onMouseLeave={() => layersIconRef.current?.stopAnimation()}
                >
                  <LayersIcon size={16} ref={layersIconRef} />
                  {activeOrganization?.name}
                  <ChevronsUpDown
                    className="ml-auto"
                    width="14"
                    height="14"
                    color="gray"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
                {organizations &&
                  organizations.map((org) => {
                    const isActive = org.id === activeOrganization?.id;
                    return (
                      <DropdownMenuItem
                        key={org.id}
                        className="cursor-pointer"
                        onMouseEnter={() =>
                          checkIconRef.current?.startAnimation()
                        }
                        onMouseLeave={() =>
                          checkIconRef.current?.stopAnimation()
                        }
                      >
                        <div className="flex w-full items-center justify-between">
                          <p className="capitalize">{org.name}</p>
                          {isActive && <CheckIcon ref={checkIconRef} />}
                          {/*{isActive && (*/}
                          {/*  <div className="w-2 h-2 rounded-full bg-green-500" />*/}
                          {/*)}*/}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                <Separator className="my-2" />
                <Link
                  to="/dashboard/org/$orgId"
                  params={{ orgId: activeOrganization?.id || "" }}
                >
                  <DropdownMenuItem className="cursor-pointer p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Settings size={16} />
                      <span>Settings</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Plus size={16} />
                    <span>Create Organization</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Recent
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer py-6 hover:bg-neutral-200 flex items-center justify-between">
                  {/*<User2 />*/}
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">I</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs">
                    {data?.data?.user.email}
                  </span>
                  <Ellipsis
                    size={18}
                    ref={iconRef}
                    color="gray"
                    className="text-gray-500"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
