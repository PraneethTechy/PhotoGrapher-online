import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import API_BASE_URL from '../config/api';
import defaultProfile from '../assets/defaultProfile.png';

const Navbar = () => {
  const [photographerProfileId, setPhotographerProfileId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Listen for login/logout changes
  useEffect(() => {
    const updateUser = () => {
      const name = localStorage.getItem('userName');
      const role = localStorage.getItem('userRole');
      const picture = localStorage.getItem('profilePicture');
      setUserName(name || '');
      setUserRole(role || '');
      setProfilePicture(picture || '');
      // If photographer, fetch profile _id
      if (role === 'photographer') {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          fetch(`${API_BASE_URL}/photographer/profile-by-user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              if (data.photographer && data.photographer._id) {
                setPhotographerProfileId(data.photographer._id);
              }
            })
            .catch(() => setPhotographerProfileId(''));
        }
      } else {
        setPhotographerProfileId('');
      }
    };
    updateUser();
    window.addEventListener('storage', updateUser);
    window.addEventListener('userChanged', updateUser);
    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('userChanged', updateUser);
    };
  }, []);

  // Close dropdown when clicking outside
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

  // Show profile picture in Navbar when logged in
  function renderProfilePicture() {
    if (!userName) return null;
    return (
      <img
        src={profilePicture || defaultProfile}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover border-2 border-white mr-2"
        style={{ background: '#eee' }}
      />
    );
  }

  return (
    <div className="w-full h-16 bg-gray-900 text-white flex items-center px-6 shadow-md sticky top-3 z-50 my-3 rounded-lg">
      {/* Left: Project Title */}
      <h1 className="text-2xl font-extrabold tracking-wide">
        BookPhoto<span className="text-red-500">Grapher</span>
      </h1>

      {/* Right: Nav Items or User Profile */}
      <div className="ml-auto flex items-center gap-6 text-lg font-medium relative">
        <Link to="/" className="hover:text-orange-400 transition duration-300">Home</Link>
        <Link to="/aboutus" className="hover:text-orange-400 transition duration-300">About Us</Link>
        {userRole === 'photographer' && (
          <Link to="/photographerdashboard" className="hover:text-orange-400 transition duration-300">Dashboard</Link>
        )}
        {userName && renderProfilePicture()}
        {userName ? (
          <>

            <div className="flex items-center gap-2" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-full font-semibold text-white hover:bg-red-500 transition focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <span>{userName}</span>
                <span className="material-icons">      <ChevronDown className="w-7 h-7" />
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-14 bg-white text-gray-900 rounded-lg shadow-lg py-2 w-48 z-50">
                  {userRole === 'photographer' ? (
                    <Link to={photographerProfileId ? `/profile/${photographerProfileId}` : '#'} className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                  ) : (
                    <Link to="/userprofile" className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                  )}
                  <Link to="/editprofile" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
                  {userRole === 'photographer' && (
                    <Link to="/editstudioprofile" className="block px-4 py-2 hover:bg-gray-100">Edit Studio Profile</Link>
                  )}
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('userName');
                      localStorage.removeItem('userRole');
                      localStorage.removeItem('profilePicture');
                      setUserName('');
                      setUserRole('');
                      setProfilePicture('');
                      setDropdownOpen(false);
                      window.dispatchEvent(new Event('userChanged'));
                      navigate('/signin', { replace: true });
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="hover:text-orange-400 transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/registerstudio"
              className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md"
            >
              Register as a Studio
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;