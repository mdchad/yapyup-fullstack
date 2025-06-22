import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { Button } from "./button";

export function Header({
  isAuthenticated,
  logo,
}: {
  isAuthenticated?: any;
  logo?: any;
}) {
  return (
    <div
      className={
        "border-2 border-gray-100 outline-gray-200 outline -outline-offset-4 mt-8 mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white rounded-[1rem] max-w-[300px] lg:max-w-[900px]"
      }
    >
      <div className="mx-auto px-6 flex items-center justify-between">
        <a href="/">
          <div className="flex items-center">
            <img src={logo} alt="logo" className="w-6 lg:w-7" />
            <span className="text-xs lg:text-lg font-bold text-purple-500">
              Yap
            </span>
            <span className="text-xs lg:text-lg font-bold text-black">yup</span>
            {/*<span className="text-2xl">🔥</span>*/}
          </div>
        </a>

        {/* Navigation - Center aligned as in screenshot */}
        <div className="py-3">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-8">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/about"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/features"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Features
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
        </div>

        {/* Sign Up Button */}
        <div className="py-3">
          {isAuthenticated ? (
            <a href={`${import.meta.env.DASHBOARD_CLIENT_URL}/`}>
              <Button className="cursor-pointer rounded-md bg-purple-200 text-gray-700 hover:text-black hover:bg-purple-100">
                Dashboard
              </Button>
            </a>
          ) : (
            <a
              href={`${import.meta.env.DASHBOARD_CLIENT_URL}/auth/sign-in`}
              target="_blank"
            >
              <Button className="text-xs lg:text-md cursor-pointer rounded-md bg-white text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200 shadow-sm">
                Sign In
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
