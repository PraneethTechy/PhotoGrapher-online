import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 mt-20">
      {/* Decorative Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            BookPhoto<span className="text-red-500">Grapher</span>
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-6">
            Find and book the best photographers & videographers for your
            special moments. Capture memories that last forever.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 inline-block pb-1">
            Quick Links
          </h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-pink-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Categories</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 inline-block pb-1">
            Follow Us
          </h3>
          <div className="flex space-x-5 mt-3">
            <a
              href="#"
              className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 transition transform hover:scale-110"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 transition transform hover:scale-110"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 transition transform hover:scale-110"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">BookPhotoGrapher</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
