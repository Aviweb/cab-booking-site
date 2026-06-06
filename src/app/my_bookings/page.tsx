"use client";
import React from "react";
import DriverBookings from "../components/DriverBookings";
import Navbar from "../components/Navbar";

const Page = () => {
  return (
    <div className="bg-cover bg-center  bg-[url('/lg2.png')] lg:bg-[url('/hero6.png')] h-screen">
      <Navbar />
      <DriverBookings />
    </div>
  );
};

export default Page;
