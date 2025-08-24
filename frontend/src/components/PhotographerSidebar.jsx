import React from 'react';
import { NavLink } from 'react-router-dom';

const PhotographerSidebar = () => (
  <div className="bg-white shadow-lg h-full min-h-screen w-64 flex flex-col py-8 px-4">
    <h2 className="text-2xl font-bold mb-8 text-yellow-600 text-center">Photographer</h2>
    <nav className="flex flex-col gap-4">
      <NavLink to="/photographer/bookings" className={({isActive}) => isActive ? 'font-semibold text-yellow-600' : 'text-gray-700'}>Bookings</NavLink>
      <NavLink to="/photographer/portfolio" className={({isActive}) => isActive ? 'font-semibold text-yellow-600' : 'text-gray-700'}>Portfolio</NavLink>
      <NavLink to="/photographer/availability" className={({isActive}) => isActive ? 'font-semibold text-yellow-600' : 'text-gray-700'}>Manage Availability</NavLink>
    </nav>
  </div>
);

export default PhotographerSidebar;
