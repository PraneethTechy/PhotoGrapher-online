import React from 'react'
import './index.css'
import Navbar from './components/Navbar'
import DashboardNavbar from './components/DashboardNavbar'
import UserNavbar from './components/UserNavbar' // import your UserNavbar
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
import UserProfile from './components/UserProfile'

const App = () => {
  const location = useLocation();

  // Decide which navbar to show
  let NavbarToShow;
  if (location.pathname.startsWith('/dashboard')) {
    NavbarToShow = <DashboardNavbar />;
  } else if (location.pathname.startsWith('/user')) {
    NavbarToShow = <UserNavbar />;
  } else {
    NavbarToShow = <Navbar />;
  }

  return (
    <>
      {NavbarToShow}

      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
              <Footer />
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/studiosetup" element={<StudioSetup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/registerstudio" element={<RegisterStudio />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/user" element={<UserProfile />} />
      </Routes>
    </>
  )
}

export default App
