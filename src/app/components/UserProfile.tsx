"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/shadcn/ui/navigation-menu";
import { User } from "lucide-react";
import Link from "next/link";

export function UserProfile() {
  return (
    <NavigationMenu className="translate-x-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">
            <div className="flex space-x-2 items-center">
              <User className="w-8 h-8 border-2 rounded-full p-1 border-black text-black" />
              <p className="text-charade-500 font-semibold">Login</p>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex p-4 lg:w-[300px] space-x-3  lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 rounded-lg w-[180px] bg-[#FCD172] ">
                <Link
                  className="flex h-full w-full select-none flex-col items-center justify-between rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <User className="h-6 w-6" />
                  <p className="mb-2 mt-4 text-lg font-medium">Passenger</p>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Login as a passenger to view your bookings status
                  </p>
                </Link>
              </li>
              <li className="row-span-3 rounded-lg w-[180px] bg-mustard-500">
                <a
                  className="flex h-full w-full select-none flex-col  rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/dlogin"
                >
                  <User className="h-6 w-6 ml-6" />
                  <p className="mb-2 mt-4 text-lg font-medium ">Driver</p>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Login as a driver to view booking requests
                  </p>
                </a>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default UserProfile;
