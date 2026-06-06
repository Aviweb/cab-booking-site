"use client";
import React, { SetStateAction } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface props {
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
}

export const BookingSuccessModal = ({ setShowModal, showModal }: props) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setShowModal(false)}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 text-center">
        <div className="mb-4 flex items-center justify-center">
          <FaCheckCircle className="text-5xl text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-gray-600 mb-4">We got your booking</p>
        <p className="text-gray-500 mb-6">We will call you soon</p>

        <button
          onClick={() => setShowModal(false)}
          className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
