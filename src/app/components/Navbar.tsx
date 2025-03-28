"use client";
import React, { useState } from "react";
import UserProfile from "./UserProfile";
import Image from "next/image";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavbarDataProps {
  title: string;
  section: string;
}
// interface NavbarItem {
//   section: string;
//   href: string;
//   name: string;
// }

const Navbar = () => {
  // const isOpen = false;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const NavbarButtons: NavbarDataProps[] = [
    { title: "Home", section: "home" },
    { title: "Book Cab", section: "booking" },
    { title: "Routes", section: "routes" },
    { title: "Contact Us", section: "contact" },
  ];

  // const NavbarButtonsDriver: NavbarDataProps[] = [
  //   { title: "Home", section: "home" },
  //   { title: "Booking Requests", section: "booking" },
  //   { title: "Routes", section: "routes" },
  //   { title: "Contact Us", section: "contact" },
  // ];

  const scrollTo = (section: string) => {
    document.querySelector(`#${section}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <div className="px-4 lg:px-[100px] w-full flex justify-between  items-center   bg-transparent z-50">
      <div className="flex justify-between">
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                  width={32}
                  height={32}
                />
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
                  {NavbarButtons.map((item: NavbarDataProps) => (
                    <a
                      key={item?.section}
                      href={"/"}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item?.title}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
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
          {NavbarButtons.map((navItem: NavbarDataProps, index) => (
            <button
              key={index}
              className="py-3 inline-block px-6 font-bold hover:bg-gray-100 text-[#262626]"
              onClick={() => {
                scrollTo(navItem?.section);
              }}
            >
              {navItem?.title}
            </button>
          ))}
        </div>
      </div>
      {/* <div
        className={`transition-all origin-top transform   ${`scale-y-0 top-20 md:top-0`}  md:scale-100 block relative md:top-0 bg-transparent text-charade-500`}
        style={{ width: "auto" }}
      >
        <div className="flex justify-end lg:justify-between items-center">
          <div className="hidden lg:flex">
            {NavbarButtons.map((navItem: NavbarDataProps, index) => (
              <button
                key={index}
                className="py-3  inline-block px-6 font-bold hover:bg-gray-100  text-[#262626] "
                onClick={() => {
                  scrollTo(navItem?.section);
                }}
              >
                {navItem?.title}
              </button>
            ))}
          </div>

          <UserProfile />
        </div>
      </div> */}
      {/* <div
        className={` bg-transparent text-charade-500 flex items-center`}
        style={{ width: "auto" }}
      > */}
      {/* <div className="flex justify-end lg:justify-between items-center"> */}
      {/* <div className="hidden lg:flex">
            {NavbarButtons.map((navItem: NavbarDataProps, index) => (
              <button
                key={index}
                className="py-3 inline-block px-6 font-bold hover:bg-gray-100 text-[#262626]"
                onClick={() => {
                  scrollTo(navItem?.section);
                }}
              >
                {navItem?.title}
              </button>
            ))}
          </div> */}

      <div className="flex items-center">
        <UserProfile />
      </div>
      {/* </div> */}
    </div>
    // </div>
  );
};

export default Navbar;
