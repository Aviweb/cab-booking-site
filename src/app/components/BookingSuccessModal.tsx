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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white flex flex-col items-center p-6 rounded-lg shadow-lg text-center w-96">
            <div className="font-extrabold text-2xl text-charade-500">
              <div className="mt-5 mb-3 flex items-center justify-center space-x-3">
                <FaCheckCircle className="text-5xl text-green-600" />
                <p className="text-charade-400">Thanks</p>
              </div>
              <p>We got your Booking</p>
            </div>

            <p className="font-bold text-charade-500">We will call you soon</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 bg-charade-500 text-white px-4 py-2 rounded-lg"
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
