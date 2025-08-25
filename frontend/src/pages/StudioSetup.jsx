import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config/api';

const StudioSetup = () => {
  const categoriesList = ["Birthday", "Marriage", "Events", "Fashion", "Travel"];
  const [form, setForm] = useState({ studioName: '', languages: '', categories: [], phone: '', city: '', address: '', state: '', zip: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (cat) => {
    setForm((prev) => {
      const categories = prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Get RegisterStudio data from localStorage
    const studioRegisterData = JSON.parse(localStorage.getItem('studioRegisterData') || '{}');
    // Combine both forms
    const payload = {
      ...studioRegisterData,
      studioName: form.studioName,
      languages: form.languages,
      categories: form.categories.join(','),
      phone: form.phone,
      city: form.city,
      address: form.address,
      state: form.state,
      zip: form.zip
    };
    try {
      const res = await axios.post('http://localhost:5000/photographer/register', payload);
      if (res.data && res.data.user) {
        setSuccess('Registration successful!');
        setDialogOpen(true);
        localStorage.removeItem('studioRegisterData');
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-gray-50 shadow-xl rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Setup Your Studio
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Studio Name */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Studio Name</label>
            <input
              type="text"
              name="studioName"
              value={form.studioName}
              onChange={handleChange}
              placeholder="Enter your studio name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Languages Spoken</label>
            <input
              type="text"
              name="languages"
              value={form.languages}
              onChange={handleChange}
              placeholder="English, Spanish, French..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {categoriesList.map((cat) => (
                <div key={cat} className="relative">
                  <input
                    type="checkbox"
                    id={cat}
                    checked={form.categories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={cat}
                    className="flex items-center justify-center px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white transition duration-100 peer-checked:bg-red-500 peer-checked:text-white"
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
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
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
              name="address"
              value={form.address}
              onChange={handleChange}
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
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter your state"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2">Zip Code</label>
              <input
                type="text"
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="Enter your zip code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition">
              Save Studio
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success && <p className="text-green-500 text-center mt-2">{success}</p>}
        {dialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Application Under Process</h3>
              <p className="mb-6 text-gray-700">Your application as a photographer is under process. Admin will review and approve your account soon.</p>
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => { setDialogOpen(false); navigate('/'); }}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioSetup;
