import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhotographerSidebar from '../components/PhotographerSidebar';
import API_BASE_URL from '../config/api';

const PhotographerAvailability = () => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUnavailableDates();
  }, []);

  const fetchUnavailableDates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/photographer/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnavailableDates(res.data.photographer.unavailableDates ? res.data.photographer.unavailableDates.map(d => new Date(d)) : []);
    } catch (err) {
      setUnavailableDates([]);
    }
  };

  const handleUnavailableDatesSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/photographer/unavailable-dates`, {
        dates: selectedDates.map(d => d.toISOString())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Unavailable dates updated');
      setSelectedDates([]);
      fetchUnavailableDates();
    } catch (err) {
      setError('Failed to update unavailable dates');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PhotographerSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">Manage Availability</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <div className="bg-white rounded-xl shadow p-6">
          <label className="block mb-2 font-semibold">Select unavailable dates:</label>
          <DatePicker
            selected={null}
            onChange={date => {
              if (date && !selectedDates.some(d => d.getTime() === date.getTime()) && !unavailableDates.some(d => d.getTime() === date.getTime())) {
                setSelectedDates([...selectedDates, date]);
              }
            }}
            inline
            highlightDates={[...selectedDates, ...unavailableDates]}
            minDate={new Date()}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedDates.map((date, idx) => (
              <span key={idx} className="bg-red-200 px-3 py-1 rounded-full text-sm">
                {date.toLocaleDateString()}
                <button className="ml-2 text-red-600" onClick={() => setSelectedDates(selectedDates.filter((d, i) => i !== idx))}>×</button>
              </span>
            ))}
          </div>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleUnavailableDatesSave}>Save Unavailable Dates</button>
          <div className="mt-4">
            <h4 className="font-semibold">Currently unavailable dates:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {unavailableDates.map((date, idx) => (
                <span key={idx} className="bg-gray-300 px-3 py-1 rounded-full text-sm">{date.toLocaleDateString()}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerAvailability;
