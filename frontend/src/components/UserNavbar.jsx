import React, { useEffect, useState } from 'react';

const UserNavbar = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
  }, []);

  return (
    <div className="w-full h-16 bg-gray-900 text-white flex items-center px-6 shadow-md sticky top-3 z-50 my-3 rounded-lg"> 
      {/* Left: Project Title */}
      <h1 className="text-2xl font-extrabold tracking-wide">
        BookPhoto<span className="text-red-500">Grapher</span>
      </h1>

      {/* Right: User Name */}
      <div className="ml-auto flex items-center gap-4">
        {userName && (
          <span className="bg-gray-700 px-4 py-2 rounded-lg font-semibold text-white">{userName}</span>
        )}
      </div>
    </div>
  );
};

export default UserNavbar;
