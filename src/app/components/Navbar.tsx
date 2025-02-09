"use client";
import React from "react";
import UserProfile from "./UserProfile";

interface NavbarDataProps {
  title: string;
  section: string;
}

const Navbar = () => {
  const isOpen = true;
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
    <div className="px-[100px] w-full flex justify-between items-start  bg-transparent z-50">
      <div className="w-56 mr-5">
        <img src="/img/logo.png" className="w-[160px] h-[100px]" alt="image" />
      </div>
      <div
        className={`transition-all origin-top transform  absolute ${
          isOpen
            ? `scale-y-100 flex flex-col bg-charade-400 text-white rounded-2xl py-4 pr-4  top-20`
            : `scale-y-0 top-20 md:top-0`
        } md:scale-100 md:block md:relative md:top-0 md:bg-transparent md:text-charade-500`}
        style={{ width: `${isOpen ? `calc(100% - 48px)` : `auto`}` }}
      >
        <div className="flex justify-between items-center">
          <div>
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
      </div>
    </div>
  );
};

export default Navbar;
