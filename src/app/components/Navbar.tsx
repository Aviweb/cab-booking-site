"use client";
import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Car } from "lucide-react";

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const userRole = cookies.get("role") as "driver" | "passenger" | undefined;
    setRole(userRole || null);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || bgColor
          ? "glass-effect shadow-lg"
          : "bg-transparent"
      } px-4 lg:px-16 xl:px-24 2xl:px-32`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text">CabInsta</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {NavbarData.map((navItem, index) => (
              <button
                key={index}
                className="px-6 py-2 font-medium text-secondary-700 hover:text-primary-600 hover:bg-white/50 rounded-xl transition-all duration-200"
                onClick={() => router.push(navItem.href)}
              >
                {navItem.title}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserProfile />
            
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/50 dark:hover:bg-secondary-800/50 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="w-6 h-6 text-secondary-700 dark:text-secondary-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white/95 backdrop-blur-lg px-6 py-6 sm:max-w-sm border-l border-gray-200">
          
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">CabInsta</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="w-6 h-6 text-secondary-700" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="space-y-4">
            {NavbarData.map((item, index) => (
              <button
                key={item.section}
                onClick={() => {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-lg font-medium text-secondary-900 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-secondary-600 text-center">
              © 2024 CabInsta. All rights reserved.
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </nav>
  );
};

export default Navbar;
