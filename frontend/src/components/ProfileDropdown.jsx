import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const picture = localStorage.getItem('profilePicture');
    if (name) setUserName(name);
    if (picture) setProfilePicture(picture);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!userName) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-full font-semibold text-white hover:bg-red-500 transition focus:outline-none"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        <img
          src={profilePicture || '/default-profile.png'}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
          style={{ background: '#eee' }}
        />
        <span>{userName}</span>
        <span className="material-icons">arrow_drop_down</span>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 top-12 bg-white text-gray-900 rounded-lg shadow-lg py-2 w-48 z-50">
          <Link to="/userprofile" className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
          <Link to="/editprofile" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userName');
              localStorage.removeItem('profilePicture');
              setUserName('');
              setProfilePicture('');
              setDropdownOpen(false);
              navigate('/signin', { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
