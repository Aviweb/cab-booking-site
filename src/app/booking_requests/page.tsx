"use client";
import React from "react";
import BookingRequests from "../components/BookingRequests";
import Navbar from "../components/Navbar";

const Page = () => {
  return (
    <div className="bg-cover bg-center bg-[url('/lg2.png')] lg:bg-[url('/hero6.png')] min-h-screen">
      <Navbar bgColor="bg-white" />
      <BookingRequests />
    </div>
  );
};

export default Page;
