import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import defaultProfile from '../assets/defaultProfile.png';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        setError('Failed to load profile');
      });
    // Fetch bookings for user
    axios.get(`${API_BASE_URL}/booking/mybookings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setBookings(res.data.bookings || []);
      })
      .catch(() => { });
  }, []);

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
      // Replace with your actual endpoint for uploading profile picture
      const res = await axios.post(`${API_BASE_URL}/user/uploadProfilePicture/${user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setUser(prev => ({ ...prev, profilePicture: res.data.url }));
      setProfilePicFile(null);
    } catch (err) {
      alert('Failed to upload profile picture');
    }
    setUploadingPic(false);
  };

  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!user) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 mt-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">User Profile</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img src={user.profilePicture || defaultProfile} alt="Profile" className="w-40 h-40 object-cover rounded-full border-4 border-yellow-400 mb-4 shadow-lg" />
          <input type="file" accept="image/*" onChange={handleProfilePicChange} className="mb-2" />
          <button
            className="bg-yellow-500 text-white px-4 py-1 rounded font-semibold disabled:opacity-50 w-full"
            onClick={handleProfilePicUpload}
            disabled={!profilePicFile || uploadingPic}
          >
            {uploadingPic ? 'Uploading...' : 'Upload Profile Picture'}
          </button>
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{user.name}</h3>
          <p className="text-gray-600 mb-2">{user.email}</p>
          <div className="space-y-1 mb-4">
            <div><span className="font-medium">Phone:</span> {user.phone || '-'}</div>
            <div><span className="font-medium">Address:</span> {user.address || '-'}</div>
          </div>
          <button
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition w-full"
            onClick={() => window.location.href = '/editprofile'}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <div className="mt-10 w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h3>
        <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center">No booking details to show yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="py-2 px-2 text-left">Date</th>
                  <th className="py-2 px-2 text-left">Photographer</th>
                  <th className="py-2 px-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-2">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="py-2 px-2">{b.photographerName || b.photographer?.name || '-'}</td>
                    <td className="py-2 px-2">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
