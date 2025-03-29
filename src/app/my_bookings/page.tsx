"use client";
import React from "react";
import DriverBookings from "../components/DriverBookings";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const cookies = new Cookies();
    const uuid = cookies.get("uuid");
    console.log("Token:", uuid);
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/mail`);
        const responseData = await response.json();
        if (response) {
          console.log("re", responseData?.data);
          // setstudentData(responseData?.data);
        }
      } catch (err) {
        console.log("error ", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-cover bg-center  bg-[url('/lg2.png')] lg:bg-[url('/hero6.png')] h-screen">
      <Navbar />
      <DriverBookings />
    </div>
  );
};

export default Page;
