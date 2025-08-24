import React from "react";
import { Link } from "react-router-dom";

const StudioSetup = () => {
  const categories = ["Birthday", "Marriage", "Events", "Fashion", "Travel"];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-gray-50 shadow-xl rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Setup Your Studio
        </h2>

        <form className="space-y-6">
          {/* Studio Name */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Studio Name</label>
            <input
              type="text"
              placeholder="Enter your studio name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Languages Spoken</label>
            <input
              type="text"
              placeholder="English, Spanish, French..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {categories.map((cat) => (
  <div key={cat} className="relative">
    <input
      type="checkbox"
      id={cat}
      className="hidden peer"
    />
    <label
      htmlFor={cat}
      className="flex items-center justify-center
                 px-4 py-2 rounded-full font-medium
                 bg-gray-200 text-gray-800
                 hover:bg-red-500 hover:text-white
                 transition duration-100
                 peer-checked:bg-red-500 peer-checked:text-white"
    >
      {cat}
    </label>
  </div>
))}


            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* State & Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">State</label>
              <input
                type="text"
                placeholder="Enter your state"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2">Zip Code</label>
              <input
                type="text"
                placeholder="Enter your zip code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition" to="/dashboard">
              Save Studio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudioSetup;
