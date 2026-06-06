"use client";
import React from "react";
import { MapPin, Plane, Globe, Clock, Shield, Star, Users, Award } from "lucide-react";

const FeatureScreen = () => {
  const features = [
    {
      icon: MapPin,
      title: "Doorstep Pickup",
      description: "We pick you up from your exact location with precise GPS tracking and real-time updates.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Plane,
      title: "Airport Transfers",
      description: "Reliable airport pickups and drops with flight tracking and meet & greet service.",
      color: "from-green-500 to-green-600", 
      bgColor: "bg-green-50",
    },
    {
      icon: Globe,
      title: "Intercity Travel",
      description: "Comfortable long-distance travel across India with professional drivers and premium vehicles.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const stats = [
    { icon: Clock, value: "24/7", label: "Available" },
    { icon: Shield, value: "100%", label: "Secure" },
    { icon: Star, value: "4.9", label: "Rating" },
    { icon: Users, value: "50k+", label: "Customers" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-full blur-3xl opacity-30 -translate-y-48 translate-x-48" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-24 2xl:px-32">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium Services</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose{" "}
            <span className="gradient-text">CabInsta</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of comfort, reliability, and affordability 
            with our premium cab services.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group card-modern p-8 hover:-translate-y-2 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="w-0 group-hover:w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-6 transition-all duration-300" />
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="card-modern p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Thousands
            </h3>
            <p className="text-lg text-slate-600">
              Our numbers speak for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureScreen;