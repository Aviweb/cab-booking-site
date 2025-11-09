"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import CustomDropDown from "./CustomDropDown";
import Cookies from "universal-cookie";

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  [key: string]: unknown;
}

interface Car {
  id: number;
  name: string;
  [key: string]: unknown;
}

const locations: Location[] = [
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

const cars: Car[] = [
  { id: 1, name: "Swift" },
  { id: 2, name: "Etios" },
  { id: 3, name: "Ertiga" },
  { id: 4, name: "Innova" },
  { id: 5, name: "Traveller" },
];

interface FormInputs {
  name: string;
  mobile: string;
}

interface BookingFormProps {
  onBookingSuccess?: () => void;
}

const BookingForm = ({ onBookingSuccess }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    new Date()
  );
  const [startLoc, setStartLoc] = useState<Location | null>(null);
  const [endLoc, setEndLoc] = useState<Location | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const cookies = new Cookies();
    const uuid = cookies.get("uuid");
    setUserId(uuid);
  }, []);

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  };

  const onSubmit: SubmitHandler<FormInputs> = async (userData) => {
    setError(null);

    if (!startLoc) {
      setError("Please select a start location");
      return;
    }

    if (!endLoc) {
      setError("Please select an end location");
      return;
    }

    if (startLoc.name === endLoc.name) {
      setError("Start and end locations must be different");
      return;
    }

    if (!selectedDateTime) {
      setError("Please select a date and time");
      return;
    }

    if (selectedDateTime < new Date()) {
      setError("Date and time cannot be in the past");
      return;
    }

    if (!validateMobile(userData.mobile)) {
      setError("Please enter a valid Indian mobile number");
      return;
    }

    if (!userId) {
      setError("You must be logged in to book a ride");
      return;
    }

    setLoading(true);

    const payload = {
      name: userData.name,
      mobile: userData.mobile,
      car: selectedCar.name,
      startLoc: startLoc.name,
      endLoc: endLoc.name,
      dateTime: selectedDateTime.toISOString(),
      userId: userId,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book ride");
      }

      reset();
      setStartLoc(null);
      setEndLoc(null);
      setSelectedCar(cars[0]);
      setSelectedDateTime(new Date());
      setError(null);

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to book ride");
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
        <div className="p-6 border rounded-lg bg-white">
          <h2 className="text-2xl text-center font-semibold leading-none tracking-tight mb-4">
            Book Your Ride
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Passenger Name *
              </Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="Enter your name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">
                Start Location *
              </Label>
              <CustomDropDown
                dropDownOptions={locations}
                selected={startLoc}
                setSelected={setStartLoc}
              />
              {!startLoc && (
                <p className="mt-1 text-sm text-red-600">
                  Please select a start location
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">
                End Location *
              </Label>
              <CustomDropDown
                dropDownOptions={locations}
                selected={endLoc}
                setSelected={setEndLoc}
              />
              {!endLoc && (
                <p className="mt-1 text-sm text-red-600">
                  Please select an end location
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">
                Date & Time *
              </Label>
              <DatePicker
                selected={selectedDateTime}
                onChange={(date: Date | null) => setSelectedDateTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholderText="Select date and time"
              />
              {!selectedDateTime && (
                <p className="mt-1 text-sm text-red-600">
                  Please select a date and time
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">
                Car Selection *
              </Label>
              <CustomDropDown
                dropDownOptions={cars}
                selected={selectedCar}
                setSelected={setSelectedCar}
              />
            </div>

            <div>
              <Label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                    message: "Please enter a valid Indian mobile number",
                  },
                })}
                placeholder="Enter 10-digit mobile number"
                className={errors.mobile ? "border-red-500" : ""}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-x-4">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Ride"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setStartLoc(null);
                setEndLoc(null);
                setSelectedCar(cars[0]);
                setSelectedDateTime(new Date());
                setError(null);
              }}
              className="rounded-md px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default BookingForm;
