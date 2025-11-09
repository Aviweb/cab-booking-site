"use client";
import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavbarDataProps {
  title: string;
  section: string;
  href: string;
}

interface NavbarProps {
  bgColor?: string;
}

const Navbar = ({ bgColor }: NavbarProps) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<"driver" | "passenger" | null>(null);

  useEffect(() => {
    const cookies = new Cookies();
    const userRole = cookies.get("role") as "driver" | "passenger" | undefined;
    setRole(userRole || null);
  }, []);

  const NavbarData: NavbarDataProps[] =
    role === "driver"
      ? [
          { title: "Home", section: "home", href: "/" },
          {
            title: "Booking Requests",
            section: "booking",
            href: "/booking_requests",
          },
          { title: "My Bookings", section: "routes", href: "/my_bookings" },
        ]
      : [
          { title: "Home", section: "home", href: "/" },
          { title: "Book Cab", section: "booking", href: "/booking_form" },
          { title: "My Bookings", section: "routes", href: "/my_bookings" },
        ];

  return (
    <div
      className={`px-4 lg:px-[100px] w-full flex justify-between items-center ${
        bgColor ? bgColor : "bg-transparent"
      } z-50`}
    >
      <div className="flex justify-between">
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {NavbarData.map((item) => (
                    <a
                      key={item.section}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <Image
          src="/img/logo.png"
          className="w-[160px] h-[100px] hidden lg:flex"
          alt="image"
          width={160}
          height={100}
        />
        <div className="hidden lg:flex">
          {NavbarData.map((navItem, index) => (
            <button
              key={index}
              className="py-3 inline-block px-6 font-bold hover:bg-gray-100 text-[#262626]"
              onClick={() => router.push(navItem.href)}
            >
              {navItem.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
