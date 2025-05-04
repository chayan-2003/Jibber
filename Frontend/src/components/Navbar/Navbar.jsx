import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-transparent sticky top-0 z-50 px-0 py-4 flex items-center justify-between backdrop-blur-md">
      <div
        className="text-2xl font-bold text-white cursor-pointer"
        onClick={() => navigate('/')}
      >
        Jibber
      </div>
      <div className="flex gap-4">
        <button
          className="text-white hover:text-blue-600 font-medium transition"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="text-white hover:text-blue-600 font-medium transition"
          onClick={() => navigate('/about')}
        >
          About Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
