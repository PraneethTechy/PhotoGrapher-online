import React from 'react'
import './index.css'
import Navbar from './components/Navbar'
import DashboardNavbar from './components/DashboardNavbar'
import UserNavbar from './components/UserNavbar'
import ProfileDropdown from './components/ProfileDropdown'
import { Routes, Route, useLocation } from 'react-router-dom'
import Signin from './pages/Signin'
import RegisterStudio from './pages/RegisterStudio'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Footer from './components/Footer'
import Register from './pages/Register'
import StudioSetup from './pages/StudioSetup'
import Dashboard from './components/Dashboard'
import Aboutus from './pages/Aboutus'
import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import AdminDashboard from './pages/AdminDashboard'
import PhotographerDashboard from './pages/PhotographerDashboard'
import PhotographerProfile from './pages/PhotographerProfile'
import PhotographerBookings from './pages/PhotographerBookings'
import PhotographerPortfolio from './pages/PhotographerPortfolio'
import PhotographerAvailability from './pages/PhotographerAvailability'


const App = () => {
  const location = useLocation();

  // Decide which navbar to show
  let NavbarToShow;
  if (location.pathname.startsWith('/dashboard')) {
    NavbarToShow = <DashboardNavbar />;
  } else {
    NavbarToShow = <Navbar />;
  }

  return (
    <>
      <div className="relative">
        {NavbarToShow}
        <div style={{ position: 'absolute', top: 0, right: 0, margin: '1rem' }}>
          <ProfileDropdown />
        </div>
      </div>

      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/studiosetup" element={<StudioSetup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/registerstudio" element={<RegisterStudio />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/photographerdashboard" element={<PhotographerDashboard />} />
        <Route path="/photographer/bookings" element={<PhotographerBookings />} />
        <Route path="/photographer/portfolio" element={<PhotographerPortfolio />} />
        <Route path="/photographer/availability" element={<PhotographerAvailability />} />
        <Route path="/profile/:id" element={<PhotographerProfile />} />
      </Routes>
    </>
  )
}

export default App
