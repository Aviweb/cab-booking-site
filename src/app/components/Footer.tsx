"use client";
import React from "react";
import { Car, Phone, Mail, MapPin, Clock, Shield } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";

interface props {
  className?: string;
}

export default function Footer({ className }: props) {
  const currentYear = new Date().getFullYear();

  const services = [
    "Airport Transfers",
    "City Tours", 
    "Intercity Travel",
    "Corporate Bookings",
    "Wedding Services",
    "Emergency Rides"
  ];

  const quickLinks = [
    { title: "Book Now", href: "#booking" },
    { title: "Our Services", href: "#services" },
    { title: "About Us", href: "#about" },
    { title: "Contact", href: "#contact" },
    { title: "Support", href: "/support" },
    { title: "Privacy Policy", href: "/privacy" }
  ];

  return (
    <footer className={`bg-secondary-900 text-white relative overflow-hidden ${className}`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl -translate-y-48 -translate-x-48" />
      
      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-24 2xl:px-32">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help or Ready to Book?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Get a cab instantly with just a tap! Our fast and reliable service ensures 
              you reach your destination comfortably and on time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open("tel:+917906217117", "_self")}
                className="btn-secondary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-100"
              >
                <Phone className="inline mr-2 w-5 h-5" />
                Call Expert
              </button>
              <button
                onClick={() => window.open("https://wa.me/+917906217117?text=Hello%20there!", "_blank")}
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
              >
                <FaWhatsapp className="inline mr-2 text-xl" />
                WhatsApp Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-24 2xl:px-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 gradient-primary rounded-xl">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold gradient-text">CabInsta</span>
                  <p className="text-secondary-400 text-sm">Premium Cab Services</p>
                </div>
              </div>
              
              <p className="text-secondary-300 mb-6 max-w-md leading-relaxed">
                India's most trusted cab service provider since 2022. We offer safe, 
                reliable, and comfortable transportation with professional drivers and 
                modern vehicles.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <a href="tel:+917906217117" className="text-secondary-300 hover:text-white transition-colors">
                    +91 79062 17117
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <a href="mailto:info@cabinsta.com" className="text-secondary-300 hover:text-white transition-colors">
                    info@cabinsta.com
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                  <span className="text-secondary-300">
                    Chandigarh, Punjab, India
                  </span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a href="#" className="text-secondary-300 hover:text-white transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 group-hover:bg-accent-400 transition-colors" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-secondary-300 hover:text-white transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 group-hover:bg-accent-400 transition-colors" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Features */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Why Choose Us?</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-secondary-300">
                    <Clock className="w-4 h-4 text-accent-400" />
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-300">
                    <Shield className="w-4 h-4 text-accent-400" />
                    <span>100% Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-24 2xl:px-32 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright */}
            <div className="text-secondary-400 text-sm mb-4 md:mb-0">
              © {currentYear} CabInsta Pvt. Ltd. All rights reserved. | Cab Booking Service Since 2022
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-secondary-400 text-sm mr-2">Follow us:</span>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}