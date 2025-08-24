import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signin = () => {
  const [role, setRole] = useState('user'); // default selected

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mb-6">
          {['user', 'photographer'].map((r) => (
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
              {r === 'user' ? 'As a User' : 'As a Photographer'}
            </label>
          ))}
        </div>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Button */}
          <Link to='/user' >
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-red-500 transition-colors duration-200"
          >
            Log In
          </button>
          </Link>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Don’t have an account?{' '}
          <Link
            className="text-gray-800 font-medium hover:underline"
            to={role === 'user' ? '/register' : '/registerstudio'}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
