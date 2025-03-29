"use client";
import React, { SetStateAction } from "react";
import { FaCheckCircle } from "react-icons/fa";
interface props {
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
}
export const BookingSuccessModal = ({ setShowModal, showModal }: props) => {
  return (
    <>
      {showModal && (
        <div className="absolute -space-y-3 inset-0 top-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white flex flex-col items-center p-6 rounded-lg shadow-lg text-center w-96">
            <div className="mt-5 mb-3 flex items-center justify-center space-x-3">
              <FaCheckCircle className="text-5xl text-green-600" />
              <p className="text-gray-500 text-lg font-semibold">Thanks</p>
            </div>

            <p className="text-2xl font-extrabold text-gray-700">
              We got your booking
            </p>
            <p className="font-bold text-gray-700 mt-2">
              We will call you soon
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSuccessModal;
