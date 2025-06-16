import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/ui/navigation-menu";
import { Button } from "@repo/ui/button";
import { Link } from "@tanstack/react-router";

export function Header({ isAuthenticated }: { isAuthenticated: any }) {
  return (
    <div
      className={
        "height-[104px] mt-8 mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-200 py-3 bg-white shadow-md rounded-[1rem] max-w-[900px]"
      }
    >
      <div className="mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <span className="text-xl font-bold">YapYup</span>
        </div>

        {/* Navigation - Center aligned as in screenshot */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-8">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/docs"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/pricing"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blog"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/*<NavigationMenuItem>*/}
            {/*  <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium bg-transparent px-0 py-0">*/}
            {/*    Extract*/}
            {/*  </NavigationMenuTrigger>*/}
            {/*  <NavigationMenuContent>*/}
            {/*    <div className="grid gap-3 p-4 w-[200px]">*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/extract/option1"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Option 1*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/extract/option2"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Option 2*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/extract/option3"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Option 3*/}
            {/*      </NavigationMenuLink>*/}
            {/*    </div>*/}
            {/*  </NavigationMenuContent>*/}
            {/*</NavigationMenuItem>*/}

            {/*<NavigationMenuItem>*/}
            {/*  <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium bg-transparent px-0 py-0">*/}
            {/*    Resources*/}
            {/*  </NavigationMenuTrigger>*/}
            {/*  <NavigationMenuContent>*/}
            {/*    <div className="grid gap-3 p-4 w-[200px]">*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/resources/resource1"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Resource 1*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/resources/resource2"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Resource 2*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/resources/resource3"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Resource 3*/}
            {/*      </NavigationMenuLink>*/}
            {/*    </div>*/}
            {/*  </NavigationMenuContent>*/}
            {/*</NavigationMenuItem>*/}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sign Up Button */}
        {isAuthenticated ? (
          <Link to={"/dashboard"}>
            <Button className="cursor-pointer rounded-lg bg-purple-200 text-black hover:text-black hover:bg-purple-100">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to={"/sign-in"}>
            <Button className="cursor-pointer rounded-lg bg-white text-black hover:text-black hover:bg-gray-100 border border-gray-200 shadow-sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
