"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, SubmitHandler } from "react-hook-form";
import BookingSuccessModal from "./BookingSuccessModal";

interface FormInputs {
  name: string;
  startLoc: string;
  endLoc: string;
  car: string;
  mobile: string;
  dateTime?: string;
}

const BookingScreen = () => {
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [startDate, setStartDate] = useState<Date>(new Date());

  const onSubmit: SubmitHandler<FormInputs> = async (userData) => {
    userData.dateTime = startDate.toDateString();
    setLoading(true);

    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to book ride");

      const result = await response.json();
      console.log("Booking Success:", result);
      setShowModal(true);
      reset();
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex-col bg-mustard-500 py-10 flex justify-center items-center pl-4 pr-4">
      <span className="font-bold text-3xl pb-10">Book Your Ride</span>
      <div className="w-full max-w-md bg-mustard-400 rounded-2xl p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 text-gray-700">
            <div>
              <label className="block mb-1">Your Name</label>
              <input
                className="w-full h-10 px-3 border rounded-lg"
                type="text"
                {...register("name", { required: true })}
              />
            </div>

            <div>
              <label className="block mb-1">Start Location</label>
              <input
                className="w-full h-10 px-3 border rounded-lg"
                type="text"
                {...register("startLoc", { required: true })}
              />
            </div>

            <div>
              <label className="block mb-1">End Location</label>
              <input
                className="w-full h-10 px-3 border rounded-lg"
                type="text"
                {...register("endLoc", { required: true })}
              />
            </div>

            <div>
              <label className="block mb-1">Date</label>
              <DatePicker
                className="w-full h-10 px-3 border rounded-lg"
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
              />
            </div>

            <div>
              <label className="block mb-1">Car Selection</label>
              <select
                className="w-full h-10 px-3 border rounded-lg"
                {...register("car", { required: true })}
              >
                <option value="Swift">Swift</option>
                <option value="Etios">Etios</option>
                <option value="Ertiga">Ertiga</option>
                <option value="Innova">Innova</option>
                <option value="Traveller">Traveller</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Mobile Number</label>
              <input
                className="w-full h-10 px-3 border rounded-lg"
                type="text"
                {...register("mobile", { required: true })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-charade-500 text-white text-xl py-4 px-10 mt-5 rounded-full font-bold disabled:opacity-50 hover:scale-105 transition"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>

      <BookingSuccessModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
};

export default BookingScreen;
