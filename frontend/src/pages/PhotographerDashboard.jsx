import React from 'react';
import PhotographerSidebar from '../components/PhotographerSidebar';

const PhotographerDashboard = () => (
  <div className="flex min-h-screen bg-gray-100">
    <PhotographerSidebar />
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-6 text-yellow-600">Photographer Dashboard</h2>
      <p className="text-lg text-gray-700 mb-4">Welcome! Use the sidebar to manage your bookings, portfolio, and availability.</p>
    </div>
  </div>
);

export default PhotographerDashboard;
