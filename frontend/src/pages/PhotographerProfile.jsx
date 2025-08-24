import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PhotographerProfile = () => {
  const { id } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  // Booking UI state (move to top)
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/photographer/profile/${id}`);
        setPhotographer(res.data.photographer);
      } catch (err) {
        setError('Failed to load photographer profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleProfilePicUpload = async () => {
    if (!profilePicFile) return;
    setUploadingPic(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', profilePicFile);
    try {
      const res = await axios.post('http://localhost:5000/photographer/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setPhotographer(prev => ({ ...prev, user: { ...prev.user, profilePicture: res.data.profilePicture } }));
      // If current user is the photographer, update localStorage
      const currentUserId = localStorage.getItem('userId');
      if (currentUserId && photographer.user?._id === currentUserId) {
        localStorage.setItem('profilePicture', res.data.profilePicture);
        window.dispatchEvent(new Event('userChanged'));
      }
      setProfilePicFile(null);
    } catch (err) {
      alert('Failed to upload profile picture');
    }
    setUploadingPic(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!photographer) return <div className="p-8 text-center">Profile not found.</div>;

  // Only show booking UI if logged in user is not the photographer
  const currentUserId = localStorage.getItem('userId');
  const isOwnProfile = currentUserId && photographer.user?._id === currentUserId;

  const handleBooking = async () => {
    if (!bookingDate) {
      setBookingMsg('Please select a date.');
      return;
    }
    setBookingLoading(true);
    setBookingMsg('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/booking', {
        photographerId: photographer._id,
        date: bookingDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingMsg('Booking request sent successfully!');
      setBookingDate('');
    } catch (err) {
      setBookingMsg(err?.response?.data?.message || 'Failed to send booking request.');
    }
    setBookingLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 mt-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img src={photographer.user?.profilePicture || '/default-profile.png'} alt={photographer.user?.name} className="w-44 h-44 object-cover rounded-full border-4 border-yellow-400 mb-4 shadow-lg" />
          {isOwnProfile && (
            <div className="mt-2 w-full flex flex-col items-center">
              <input type="file" accept="image/*" onChange={handleProfilePicChange} className="mb-2 w-full" />
              <button
                className="bg-yellow-500 text-white px-4 py-1 rounded font-semibold disabled:opacity-50 w-full"
                onClick={handleProfilePicUpload}
                disabled={!profilePicFile || uploadingPic}
              >
                {uploadingPic ? 'Uploading...' : 'Upload Profile Picture'}
              </button>
            </div>
          )}
          {/* Booking UI for users */}
          {!isOwnProfile && (
            <div className="mt-6 w-full flex flex-col items-center">
              <label className="font-semibold mb-2">Book this photographer:</label>
              <input
                type="date"
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setBookingDate(e.target.value)}
                className="border rounded px-3 py-2 mb-2 w-full"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full disabled:opacity-50"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
              {bookingMsg && <p className="mt-2 text-center text-sm text-red-500">{bookingMsg}</p>}
            </div>
          )}
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800 text-center md:text-left">{photographer.user?.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-semibold">City:</span> {photographer.city || 'N/A'}</p>
              <p className="text-gray-600"><span className="font-semibold">State:</span> {photographer.state || 'N/A'}</p>
              <p className="text-gray-600"><span className="font-semibold">Email:</span> {photographer.user?.email}</p>
              <p className="text-gray-600"><span className="font-semibold">Phone:</span> {photographer.user?.phone}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-semibold">Categories:</span> {Array.isArray(photographer.categories) ? photographer.categories.join(', ') : photographer.categories}</p>
              <p className="text-yellow-600 font-bold"><span className="font-semibold">Rating:</span> {photographer.averageRating ? photographer.averageRating.toFixed(2) : 'N/A'}</p>
              <p className="text-gray-600"><span className="font-semibold">Unavailable Dates:</span> {photographer.unavailableDates && photographer.unavailableDates.length > 0 ? (
                <span className="inline-block">
                  {photographer.unavailableDates.map((d, idx) => {
                    const dateObj = new Date(d);
                    return <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded mr-1 mb-1 inline-block text-xs">{dateObj.toLocaleDateString()}</span>;
                  })}
                </span>
              ) : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">Portfolio Gallery</h3>
        {photographer.portfolio && photographer.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {photographer.portfolio.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-64 object-cover rounded-2xl shadow-lg transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute inset-0 pointer-events-none rounded-2xl transition duration-200 flex items-center justify-center  group-hover:bg-opacity-20">
                  <span className="text-white text-lg opacity-0 group-hover:opacity-100"></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No portfolio items uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default PhotographerProfile;
