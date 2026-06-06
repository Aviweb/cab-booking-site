"use client";
import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaWhatsapp, FaStar } from "react-icons/fa";
import { MapPin, Clock, Shield, Users } from "lucide-react";
import Navbar from "./Navbar";

const HomeScreen = () => {
  const scrollTo = (section: string) => {
    document.querySelector(`#${section}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const stats = [
    { icon: Users, value: "50k+", label: "Happy Customers" },
    { icon: MapPin, value: "100+", label: "Cities Covered" },
    { icon: Clock, value: "24/7", label: "Service Available" },
    { icon: Shield, value: "100%", label: "Safe & Secure" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute top-40 -left-20 w-60 h-60 bg-gradient-to-br from-green-200 to-green-300 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full blur-2xl opacity-20" />
      </div>

      <Navbar />
      
      <section id="home" className="relative z-10 px-4 lg:px-16 xl:px-24 2xl:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh] pt-20 lg:pt-32 pb-16">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 animate-slide-up">
              
              {/* Badge */}
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full w-fit">
                <FaStar className="text-amber-500" />
                <span className="font-semibold text-sm">Rated #1 Cab Service</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                  Your{" "}
                  <span className="gradient-text">
                    Premium Ride
                  </span>{" "}
                  is Just a Tap Away
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-xl">
                  Experience seamless, safe, and reliable transportation with our 
                  professional drivers and modern fleet.
                </p>
              </div>

              {/* Contact Info */}
              <div className="glass-effect rounded-2xl p-6 w-fit">
                <div className="flex items-center gap-3 mb-2">
                  <FaPhoneAlt className="text-blue-500 text-lg" />
                  <span className="font-semibold text-slate-800">Call Now</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-600 font-medium">+91</span>
                  <a
                    href="tel:+917500075000"
                    className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    75000 75000
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollTo("booking")}
                  className="btn-primary text-lg px-8 py-4 rounded-2xl group"
                >
                  <span>Book Your Ride</span>
                  <MapPin className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <a
                  href="https://wa.me/+917906217117?text=Hello%20there!"
                  target="_blank"
                  className="btn-outline text-lg px-8 py-4 rounded-2xl group flex items-center justify-center"
                >
                  <FaWhatsapp className="mr-3 text-xl group-hover:scale-110 transition-transform text-green-500" />
                  WhatsApp Us
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                        <IconComponent className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="font-bold text-lg text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center mt-16 lg:mt-0">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 gradient-primary rounded-full blur-3xl opacity-10 scale-110 animate-pulse-slow" />
                
                {/* Main image */}
                <div className="relative animate-float">
                  <Image
                    src="/camaro.png"
                    alt="Premium Cab Service"
                    width={600}
                    height={400}
                    className="w-full h-auto max-w-lg xl:max-w-xl"
                    priority
                  />
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">Live Tracking</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
