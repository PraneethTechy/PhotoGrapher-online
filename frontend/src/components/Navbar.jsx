import React from 'react'
import { Link } from 'react-router-dom';    

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-gray-900 text-white flex items-center px-6 shadow-md sticky top-3 z-50 my-3 rounded-lg"> 
      {/* Left: Project Title */}
      <h1 className="text-2xl font-extrabold tracking-wide">
        BookPhoto<span className="text-red-500">Grapher</span>
      </h1>

      {/* Right: Nav Items */}
      <ul className="flex space-x-8 ml-auto text-lg font-medium">
        <li>
          <Link 
            to="/signin" 
            className="hover:text-orange-400 transition duration-300"
          >
            Sign In
          </Link>
        </li>
        <li>
          <Link 
            to="/registerstudio" 
            className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md"
          >
            Register as a Studio
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
