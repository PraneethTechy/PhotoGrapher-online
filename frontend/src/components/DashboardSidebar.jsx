// components/DashboardSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-5">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link
          to="/dashboard/bookings"
          className="hover:bg-gray-700 px-4 py-2 rounded"
        >
          Bookings
        </Link>
        <Link
          to="/dashboard/notifications"
          className="hover:bg-gray-700 px-4 py-2 rounded"
        >
          Notifications
        </Link>
        <Link
          to="/dashboard/studio-details"
          className="hover:bg-gray-700 px-4 py-2 rounded"
        >
          Studio Details
        </Link>
        <Link
          to="/dashboard/earnings"
          className="hover:bg-gray-700 px-4 py-2 rounded" 
          >
          Earnings
          </Link>
        <Link
          to="/dashboard/manage-albums">
          Manage Albums
          </Link>
          
      </nav>
    </div>
  );
};

export default DashboardSidebar;
