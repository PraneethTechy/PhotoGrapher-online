import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Signin = () => {
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let url;
      if (role === 'user') url = 'https://photographer-online-backend.onrender.com/user/login';
      else if (role === 'photographer') url = 'https://photographer-online-backend.onrender.com/photographer/login';
      else if (role === 'admin') url = 'https://photographer-online-backend.onrender.com/admin/login';
      const res = await axios.post(url, form);
      if (res.data && res.data.token) {
        setSuccess('Login successful!');
        localStorage.setItem('token', res.data.token);
        if (res.data.user && res.data.user.name) {
          localStorage.setItem('userName', res.data.user.name);
        }
        localStorage.setItem('userRole', role);
        window.dispatchEvent(new Event('userChanged'));
        if (role === 'user') {
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
        } else if (role === 'admin') {
          setTimeout(() => {
            navigate('/admindashboard', { replace: true });
          }, 1000);
        } else {
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
        }
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mb-6">
          {['user', 'photographer', 'admin'].map((r) => (
            <label
              key={r}
              className={`cursor-pointer w-45 text-center border-2 rounded-lg p-4 font-medium transition
                ${role === r ? 'bg-red-500 border-red-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-800 hover:bg-red-400 hover:border-red-500 hover:text-white'}`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                className="hidden"
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r === 'user' ? 'As a User' : r === 'photographer' ? 'As a Photographer' : 'As Admin'}
            </label>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-red-500 transition-colors duration-200"
          >
            Log In
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success && <p className="text-green-500 text-center mt-2">{success}</p>}

        {role !== 'admin' && (
          <p className="text-center text-gray-600 mt-4 text-sm">
            Don’t have an account?{' '}
            <Link
              className="text-gray-800 font-medium hover:underline"
              to={role === 'user' ? '/register' : '/registerstudio'}
            >
              Register
            </Link>
          </p>
        )}
      </div>

    </div>
  );
};

export default Signin;
