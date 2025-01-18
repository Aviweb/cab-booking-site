"use client";
import React, { useState } from "react";
import MenuButton from "./MenuButton";

interface NavbarDataProps {
  title: string;
  section: string;
}

const Navbar = () => {
  const [isOpen, SetIsOpen] = useState(true);
  const NavbarButtons: NavbarDataProps[] = [
    { title: "Home", section: "home" },
    { title: "Book Cab", section: "booking" },
    { title: "Routes", section: "routes" },
    { title: "Contact Us", section: "contact" },
  ];
  const toggleMenuHandler = () => {
    // SetIsOpen(!isOpen);
  };

  const scrollTo = (section: any) => {
    document.querySelector(`#${section}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <div className="w-full p-6 flex justify-between items-center fixed bg-white z-50">
      <div className="w-56 mr-5">
        <picture>
          <source srcSet="/img/logo.webp" type="image/webp" />
          <source srcSet="/img/logo.png" type="image/png" />
          <img src="/img/logo.png" className="object-contain" />
        </picture>
      </div>
      <MenuButton isOpen={isOpen} toggleMenu={toggleMenuHandler} />
      <div
        className={`transition-all origin-top transform absolute ${
          isOpen
            ? `scale-y-100 flex flex-col bg-charade-400 text-white rounded-2xl p-4 top-20`
            : `scale-y-0 top-20 md:top-0`
        } md:scale-100 md:block md:relative md:top-0 md:bg-white md:text-charade-500`}
        style={{ width: `${isOpen ? `calc(100% - 48px)` : `auto`}` }}
      >
        {NavbarButtons.map((navItem: NavbarDataProps, index) => (
          <button
            key={index}
            className="py-3  inline-block px-6 font-bold hover:bg-gray-100  text-[#262626] "
            onClick={() => {
              scrollTo(navItem?.section);
              toggleMenuHandler();
            }}
          >
            {navItem?.title}
          </button>
        ))}

        {/* <button
          className="py-3  inline-block px-6 font-bold hover:bg-gray-100  hover:text-charade-500"
          onClick={() => {
            scrollTo("home");
            toggleMenuHandler();
          }}
        >
          Home
        </button>
        <button
          className="py-3  inline-block px-6 font-bold hover:bg-gray-100  hover:text-charade-500"
          onClick={() => {
            scrollTo("booking");
            toggleMenuHandler();
          }}
        >
          Book Cab
        </button>
        <button
          className="py-3  inline-block px-6 font-bold hover:bg-gray-100  hover:text-charade-500"
          onClick={() => {
            scrollTo("routes");
            toggleMenuHandler();
          }}
        >
          Routes
        </button>
        <button
          className="py-3 inline-block px-6 font-bold hover:bg-gray-100  hover:text-charade-500 outline-none focus:outline-none"
          onClick={() => {
            scrollTo("contact");
            toggleMenuHandler();
          }}
        >
          Contact Us
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;
