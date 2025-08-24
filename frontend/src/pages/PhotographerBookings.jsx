import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhotographerSidebar from '../components/PhotographerSidebar';

const PhotographerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/photographer/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PhotographerSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">Bookings</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="bg-white rounded-xl shadow p-6">
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            bookings.map(b => (
              <div key={b._id} className="border-b py-4 flex flex-col gap-2">
                <div className="font-semibold">{b.user?.name}</div>
                <div className="text-sm text-gray-600">{b.user?.email}</div>
                <div className="text-sm text-gray-600">Status: {b.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotographerBookings;
