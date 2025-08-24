import React from 'react'
import { Link } from 'react-router-dom';    

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-gray-900 text-white flex items-center px-6 shadow-md sticky top-3 z-50 my-3 rounded-lg"> 
      {/* Left: Project Title */}
      <h1 className="text-2xl font-extrabold tracking-wide">
        BookPhoto<span className="text-red-500">Grapher</span>
      </h1>

      
    </div>
  )
}

export default Navbar
