"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Navbar from "./Navbar";
import Cookies from "universal-cookie";
import { useEffect } from "react";

const HomeScreen = () => {
  const [userRole, setUserRole] = useState<"passenger" | "driver" | undefined>(
    "passenger"
  );
  useEffect(() => {
    const cookies = new Cookies();
    const role = cookies.get("role");
    console.log("Role from cookie:", role);
    setUserRole(role);
  }, []);
  const scrollTo = (section: string) => {
    document.querySelector(`#${section}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <div className="bg-cover bg-center  bg-[url('/lg2.png')] lg:bg-[url('/hero6.png')] ">
      <Navbar role={userRole} />
      <section
        id="home"
        className="flex flex-col-reverse lg:flex-row justify-center w-full lg:pl-[100px] h-full lg:mt-36 px-4"
      >
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start h-full pt-10 lg:pt-0 pb-14">
          <div className="w-full text-center lg:text-left">
            <span className="font-extrabold text-charade-500 block my-2 text-3xl lg:text-5xl">
              Easy and fast way to book a ride
            </span>
            {/* Image in the middle on small screens */}
            <div className=" lg:hidden my-6 flex justify-center">
              <Image
                src="/camaro4.png"
                alt="Camaro"
                width={300}
                height={300}
                className="w-10/12 max-w-xs h-auto"
              />
            </div>
            <button className="bg-yellow-400 p-2 rounded-lg my-2 inline-block text-charade-500">
              <FaPhoneAlt className="inline -my-1 text-xl" />{" "}
              <span className="font-bold">Call Us</span>
            </button>
            <div className="flex justify-center lg:justify-start items-center my-2">
              <span className="text-red-400 text-xl font-bold">+91</span>
              <a
                href="tel:+919465313982"
                className="text-red-500 text-4xl font-extrabold pl-2"
              >
                75000 75000
              </a>
            </div>
            <div className="flex flex-col md:flex-row gap-3 justify-center lg:justify-start my-5 mx-16 lg:mx-0 md:my-7">
              <button
                onClick={() => {
                  scrollTo("booking");
                }}
                className="w-full md:w-auto py-2  lg:py-3 px-6 font-bold text-lg border-2 border-charade-500 rounded-xl bg-charade-500 text-white hover:bg-charade-300 focus:outline-none"
              >
                Book Cab
              </button>
              <a
                href="https://wa.me/+917906217117?text=Hello%20there!"
                target="_blank"
                className="w-full bg-white md:w-auto py-3 px-6 font-bold text-lg border lg:border-2 border-charade-500 rounded-xl text-charade-500 hover:bg-charade-500 hover:text-white flex items-center justify-center"
              >
                <FaWhatsapp className="mr-2 text-2xl" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
        {/* Image for large screens only */}
        <div className="hidden lg:flex w-full justify-center items-center pt-5 mt-5 lg:pt-0 md:h-full">
          <Image
            src="/camaro.png"
            alt="Camaro"
            width={500}
            height={500}
            className="h-full w-full mt-36"
          />
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
