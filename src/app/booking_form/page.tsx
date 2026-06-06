"use client";
import React from "react";
import BookingSection from "../components/formComponents/BookingSection";
import Navbar from "../components/Navbar";

const Page = () => {
  return (
    <div className="bg-cover bg-center  bg-[url('/lg2.png')] lg:bg-[url('/hero6.png')] h-screen">
      <Navbar bgColor="bg-white" />
      <BookingSection />
    </div>
  );
};

export default Page;
