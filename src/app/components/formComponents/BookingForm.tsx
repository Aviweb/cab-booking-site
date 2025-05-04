"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/shadcn/ui/input";
import BookingSuccessModal from "../BookingSuccessModal";
import CustomDropDown from "./CustomDropDown";
import Cookies from "universal-cookie";
import { useEffect } from "react";
// import { newDate } from "react-datepicker/dist/date_utils";

const locations = [
  { id: 1, name: "Mumbai", latitude: 19.07609, longitude: 72.877426 },
  { id: 2, name: "Delhi", latitude: 28.70406, longitude: 77.102493 },
  { id: 3, name: "Bengaluru", latitude: 12.971599, longitude: 77.594566 },
  { id: 4, name: "Hyderabad", latitude: 17.385044, longitude: 78.486671 },
  { id: 5, name: "Chennai", latitude: 13.08268, longitude: 80.270721 },
  { id: 6, name: "Kolkata", latitude: 22.572645, longitude: 88.363892 },
  { id: 7, name: "Ahmedabad", latitude: 23.022505, longitude: 72.571365 },
  { id: 8, name: "Pune", latitude: 18.52043, longitude: 73.856743 },
  { id: 9, name: "Jaipur", latitude: 26.912434, longitude: 75.787271 },
  { id: 10, name: "Lucknow", latitude: 26.846695, longitude: 80.946167 },
];

const cars = [
  { id: 1, name: "Swift" },
  { id: 2, name: "Etios" },
  { id: 3, name: "Ertiga" },
  { id: 4, name: "Innova" },
  { id: 5, name: "Traveller" },
];

interface FormInputs {
  name: string;
  mapLink: string;
  about: string;
  startLoc: string;
  endLoc: string;
  dateTime?: string;
  car: string;
  mobile: string;
}

const BookingForm = () => {
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [startDate, setStartDate] = useState<Date>(new Date());
  const startDate = new Date();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [startLoc, setStartLoc] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [endLoc, setEndLoc] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [car, setCar] = useState<any>(cars[0]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const cookies = new Cookies();
    const uuid = cookies.get("uuid");
    console.log("Token:", uuid);
    setUserId(uuid);

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
  }, []);

  const onSubmit: SubmitHandler<FormInputs> = async (userData) => {
    userData.dateTime = startDate.toDateString();
    userData.startLoc = startLoc.name;
    userData.endLoc = endLoc.name;
    userData.car = car.name;
    setLoading(true);

    const payload = {
      ...userData,
      userId: userId,
    };

    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to book ride");

      setShowModal(true);
      reset();
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-screen max-w-2xl mx-auto lg:mt-4"
      >
        <div className="p-6 border">
          <h2 className="text-2xl text-center font-semibold leading-none tracking-tight mb-4">
            Book Your Ride
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <Input
                {...register("name", { required: true })}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Start Location
              </label>
              <CustomDropDown
                dropDownOptions={locations}
                selected={startLoc}
                setSelected={setStartLoc}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                End Location
              </label>
              <CustomDropDown
                dropDownOptions={locations}
                selected={endLoc}
                setSelected={setEndLoc}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Car Selection
              </label>
              <CustomDropDown
                dropDownOptions={cars}
                selected={car}
                setSelected={setCar}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Mobile Number
              </label>
              <Input {...register("mobile", { required: true })} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-x-4">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              disabled={loading}
            >
              {loading ? "Booking..." : "Save"}
            </button>
            <button
              type="button"
              className="text-sm font-semibold text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <BookingSuccessModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default BookingForm;
