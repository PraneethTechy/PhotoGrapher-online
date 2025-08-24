import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

// Pages imports
import StudioDetails from '../pages/StudioDetails';
import Reviews from '../pages/Reviews';
import ManageAlbums from '../pages/ManageAlbums';
import Bookings from '../pages/Bookings';
import Notifications from '../pages/Notifications';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar (always visible) */}
      <DashboardSidebar />

      {/* Main content (changes per route) */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="bookings" element={<Bookings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="studio-details" element={<StudioDetails />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="manage-albums" element={<ManageAlbums />} />
          <Route
            index
            element={
              <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
