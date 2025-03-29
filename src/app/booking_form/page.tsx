"use client";
import React, { useState } from "react";
import BookingSection from "../components/formComponents/BookingSection";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import { useEffect } from "react";

const Page = () => {
  const [userId, setUserId] = useState();
  useEffect(() => {
    const cookies = new Cookies();
    const uuid = cookies.get("uuid");
    setUserId(uuid);
    console.log("Token:", userId);

    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/mail`);
    //     const responseData = await response.json();
    //     if (response) {
    //       console.log("re", responseData?.data);
    //       // setstudentData(responseData?.data);
    //     }
    //   } catch (err) {
    //     console.log("error ", err);
    //   }
    // };
    // fetchData();
  }, [userId]);
  return (
    <div className="bg-cover bg-center  bg-[url('/lg2.png')] lg:bg-[url('/hero6.png')] h-screen">
      <Navbar bgColor="bg-white" />
      <BookingSection />
    </div>
  );
};

export default Page;
