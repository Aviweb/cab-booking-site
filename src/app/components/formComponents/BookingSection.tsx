"use client";
import { useState } from "react";
import LocationApp from "@/app/components/LocationApp";
import BookingForm from "./BookingForm";
import BookingSuccessModal from "../BookingSuccessModal";
import { MapPin, Clock } from "lucide-react";

export default function BookingSection() {
  const [showModal, setShowModal] = useState(false);

  const handleBookingSuccess = () => {
    setShowModal(true);
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full blur-3xl opacity-20 -translate-y-48 -translate-x-48" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-accent-100 to-warning-100 rounded-full blur-3xl opacity-20 translate-y-48 translate-x-48" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-24 2xl:px-32">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold text-sm">Quick Booking</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Book Your{" "}
            <span className="gradient-text">Perfect Ride</span>
          </h2>
          
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
            Get instant fare estimates and book your cab in just a few clicks. 
            Professional drivers, premium vehicles, unbeatable prices.
          </p>
        </div>

        {/* Booking Interface */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Booking Form */}
          <div className="order-2 lg:order-1">
            <div className="card-modern p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">Quick Booking</h3>
                  <p className="text-secondary-600">Fill details and get instant quote</p>
                </div>
              </div>
              
              <BookingForm onBookingSuccess={handleBookingSuccess} />
            </div>
          </div>

          {/* Right Side - Location/Map */}
          <div className="order-1 lg:order-2">
            <div className="card-modern overflow-hidden">
              <LocationApp mode="homescreen" />
            </div>
          </div>
        </div>

        {/* Features Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚗", title: "Instant Booking", desc: "Book in 30 seconds" },
            { icon: "📱", title: "Live Tracking", desc: "Track your ride" },
            { icon: "💳", title: "Cashless Payment", desc: "Multiple options" },
            { icon: "🛡️", title: "Safe & Secure", desc: "Verified drivers" },
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h4 className="font-semibold text-secondary-900 text-sm">{feature.title}</h4>
              <p className="text-xs text-secondary-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <BookingSuccessModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
}
