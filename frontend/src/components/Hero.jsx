import React from "react";
import camera from "../assets/camera.png.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-[80vh] flex items-center px-8 mt-3 rounded-2xl shadow-lg overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10">
        
        {/* Left side */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Book <span className="text-red-500">Photographer</span> <br /> Remotely
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto md:mx-0">
            Find and book professional photographers anytime, anywhere – 
            <span className="text-red-400 font-semibold"> hassle free</span>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signin">
  <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-orange-600 shadow-md transition transform hover:scale-105">
    Get Started
  </button>
</Link>
<Link to="/aboutus">
            <button className="px-6 py-3 bg-white text-gray-800 rounded-xl hover:bg-gray-200 shadow-md transition transform hover:scale-105">
              Learn More
            </button>
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 mt-8 md:mt-0 md:ml-12 flex justify-center">
          <img
            src={camera}
            alt="Photographer"
            className="w-[350px] md:w-[480px] object-contain drop-shadow-2xl animate-bounce-slow"
          />
        </div>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-red-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-gray-700 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
