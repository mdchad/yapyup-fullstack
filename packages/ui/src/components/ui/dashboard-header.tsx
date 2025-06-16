import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOutIcon, Menu, Search, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { SidebarTrigger } from "./sidebar";
import { LogoutIcon } from "./logout";

type Organisation = {
  organisation_id: string;
  organisations: { name: string };
};

const mainLink = [
  {
    name: "Audio",
    href: "/dashboard/audio",
  },
  {
    name: "Chat",
    href: "/dashboard/chat",
  },
  {
    name: "Transcribe",
    href: "/dashboard/transcribe",
  },
  {
    name: "Canvas",
    href: "/dashboard/canvas",
  },
  {
    name: "Notes",
    href: "/dashboard/notes",
  },
  {
    name: "Capture",
    href: "/dashboard/capture",
  },
];

const DashboardHeader = () => {
  // const { user } = useAuthContext()
  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const iconRef = useRef(null);

  // useEffect(() => {
  //   const fetchOrganisation = async () => {
  //     if (!user || !user.email) return
  //     // Fetch the user's organisation name with a join
  //     const { data, error } = await supabase
  //       .from('users')
  //       .select('organisation_id, organisations(name)')
  //       .eq('email', user.email)
  //       .single()
  //
  //     setOrg(data)
  //     setLoading(false)
  //   }
  //   fetchOrganisation()
  // }, [user])

  // async function handleSignOut() {
  //   await supabase.auth.signOut();
  // }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-between">
        {/* Left side: Organization and Project */}
        <div className="flex items-center space-x-2">
          {/* Organization logo and dropdown */}
          <div className="flex items-center">
            <SidebarTrigger />
            {/*<Avatar className="h-8 w-8 mr-2 bg-gray-800 text-white">*/}
            {/*  <AvatarFallback>P</AvatarFallback>*/}
            {/*</Avatar>*/}
            <div className="text-gray-300">/</div>

            {/*<DropdownMenu>*/}
            {/*  <DropdownMenuTrigger asChild>*/}
            {/*    <Button*/}
            {/*      variant="ghost"*/}
            {/*      className="px-2 font-medium flex items-center gap-1"*/}
            {/*    >*/}
            {/*      {loading ? "Loading..." : org?.organisations.name}*/}
            {/*      <ChevronDown className="h-4 w-4" />*/}
            {/*    </Button>*/}
            {/*  </DropdownMenuTrigger>*/}
            {/*  <DropdownMenuContent>*/}
            {/*    <Link href={`/dashboard/org/${org?.organisation_id}`}>*/}
            {/*      <DropdownMenuItem>Settings</DropdownMenuItem>*/}
            {/*    </Link>*/}
            {/*    <DropdownMenuItem>Personal</DropdownMenuItem>*/}
            {/*    /!*<DropdownMenuItem>Team Space</DropdownMenuItem>*!/*/}
            {/*    /!*<DropdownMenuItem>Enterprise</DropdownMenuItem>*!/*/}
            {/*    <DropdownMenuSeparator />*/}
            {/*    <DropdownMenuItem>Create Organization</DropdownMenuItem>*/}
            {/*  </DropdownMenuContent>*/}
            {/*</DropdownMenu>*/}
          </div>

          {/*<div className="text-gray-300">/</div>*/}

          {/* Project dropdown */}
          {/*<DropdownMenu>*/}
          {/*  <DropdownMenuTrigger asChild>*/}
          {/*    <Button variant="ghost" className="px-2 font-medium flex items-center gap-1">*/}
          {/*      Default project*/}
          {/*      <ChevronDown className="h-4 w-4" />*/}
          {/*    </Button>*/}
          {/*  </DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent>*/}
          {/*    <DropdownMenuItem>Project 1</DropdownMenuItem>*/}
          {/*    <DropdownMenuItem>Project 2</DropdownMenuItem>*/}
          {/*    <DropdownMenuItem>Project 3</DropdownMenuItem>*/}
          {/*    <DropdownMenuSeparator />*/}
          {/*    <DropdownMenuItem>Create New Project</DropdownMenuItem>*/}
          {/*  </DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}
        </div>

        {/* Right side: Main Navigation */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            {mainLink.map((link) => {
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-gray-500 hover:text-gray-900"
                  activeProps={{ className: "font-bold text-gray-700" }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/*<Avatar className="h-8 w-8 bg-indigo-600 text-white">*/}
          {/*  <AvatarFallback>M</AvatarFallback>*/}
          {/*</Avatar>*/}
        </div>
      </div>

      {/* Search bar - Separate row */}
      <div className="relative max-w-xs mt-2 md:hidden">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-8 h-9 text-sm w-full bg-gray-50"
        />
        <span className="absolute right-2 top-2 text-xs text-gray-400 bg-gray-100 px-1 rounded">
          ⌘ K
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
