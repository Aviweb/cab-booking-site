"use client";
import React from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Navbar from "./Navbar";

const HomeScreen = () => {
  const scrollTo = (section: string) => {
    document.querySelector(`#${section}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <div className="bg-cover bg-center bg-[url('/hero6.png')]">
      <Navbar />
      <section
        id="home"
        className="flex  justify-center w-full pl-[100px]   h-full mt-36   flex-col-reverse lg:flex-row"
      >
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start h-full  pt-10 lg:pt-0 pb-14">
          <div className="w-full text-center lg:text-left">
            <span className="font-extrabold text-charade-500 block my-2 text-5xl">
              Easy and fast way to book a ride
            </span>
            <button
              onClick={() => {
                document.location.href = "tel:+919465313982";
              }}
              className="bg-yellow-400 p-2 rounded-lg my-2 inline-block text-charade-500"
            >
              <FaPhoneAlt className="inline -my-1 text-xl" />{" "}
              <span className="font-bold">Call Us</span>
            </button>
            <div className="flex justify-center lg:justify-start items-center my-2">
              <span className="text-red-400 text-xl font-bold">+91</span>
              <a
                href="tel:+919465313982"
                className="text-red-500 text-4xl font-extrabold pl-2"
              >
                9465313982
              </a>
            </div>
            <div className="flex my-5 md:my-7 flex-col md:flex-row justify-center lg:justify-start">
              <button
                onClick={() => {
                  scrollTo("booking");
                }}
                className="md:mr-3 py-3 px-9 font-bold text-xl border-2 border-charade-500 rounded-xl my-2 lg:my-0 hover:bg-charade-300 bg-charade-500 text-white focus:outline-none"
              >
                Book Cab
              </button>
              <a
                href="https://wa.me/+919465313982"
                target="_blank"
                className="p-3 text-charade-500 font-bold text-xl border-2 border-charade-500 rounded-xl my-2 lg:my-0 hover:bg-charade-500 hover:text-white"
              >
                <FaWhatsapp className="inline-block -my-2 mr-1 text-2xl" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
        <div className="w-8/12 lg:w-full  justify-center items-center pt-5 lg:pt-0 md:h-full">
          {/* <picture>
            <source srcSet="/img/home.webp" type="image/webp" />
            <source srcSet="/img/home.png" type="image/png" />
            <img alt="image" src="/img/home.png" className="w-72 lg:w-5/6" />
          </picture> */}
          <img src="/camaro.png" className="h-full w-full mt-36" alt="" />
          {/* <div className="bg-gray-400 w-10 ml-20 h-20">hello</div> */}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
