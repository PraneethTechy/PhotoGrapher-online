import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', profilePicture: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const user = res.data.user;
        setForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          profilePicture: user.profilePicture || ''
        });
      })
      .catch(err => {
        setError('Failed to load profile');
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile picture file selection
  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
    if (e.target.files[0]) {
      setForm({ ...form, profilePicture: URL.createObjectURL(e.target.files[0]) });
    }
  };

  // Upload profile picture to backend
  const handleProfilePicUpload = async () => {
    if (!profilePicFile) return;
    setUploadingPic(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', profilePicFile);
    try {
      const res = await axios.post('https://photographer-online-backend.onrender.com/user/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setForm(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      localStorage.setItem('profilePicture', res.data.profilePicture);
      window.dispatchEvent(new Event('userChanged'));
      setProfilePicFile(null);
      setSuccess('Profile picture updated!');
    } catch (err) {
      setError('Failed to upload profile picture');
    }
    setUploadingPic(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put('http://localhost:5000/user/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
      // Optionally update localStorage
      localStorage.setItem('userName', form.name);
      localStorage.setItem('profilePicture', form.profilePicture);
      setTimeout(() => navigate('/userprofile', { replace: true }), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 mt-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Profile</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img src={form.profilePicture || '/default-profile.png'} alt={form.name} className="w-40 h-40 object-cover rounded-full border-4 border-yellow-400 mb-4 shadow-lg" />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleProfilePicChange} className="w-full mb-2" />
            <button
              type="button"
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition mb-2 disabled:opacity-50"
              onClick={handleProfilePicUpload}
              disabled={!profilePicFile || uploadingPic}
            >
              {uploadingPic ? 'Uploading...' : 'Upload Profile Picture'}
            </button>
          </div>
        </div>
        <form className="flex-1 space-y-5 w-full" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="mt-1 w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="mt-1 w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition">Save Changes</button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {success && <p className="text-green-500 text-center mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
