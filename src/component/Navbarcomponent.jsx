import React, { useState } from 'react';
import { FaUser, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo-bina-essa1.jpg';

const NavbarComponent = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-blue-500 shadow z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo Bina Essa" className="h-12 bg-white rounded" />
          <div className="text-dark">
            <div className="text-xs leading-tight font-bold text-dark">LEMBAGA KURSUS DAN PELATIHAN</div>
            <div className="text-xl font-bold -mt-1 text-dark">BINA ESSA</div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-white hover:underline">Home</a>
          {isLoggedIn ? (
            <>
              <a href="#feedback" className="text-white hover:underline">Feedback</a>
              <a href="#pendaftaran" className="text-white hover:underline">Pendaftaran</a>
            </>
          ) : (
            <>
              <a href="#info" className="text-white hover:underline">Info</a>
              <a href="#galeri" className="text-white hover:underline">Galeri</a>
            </>
          )}
          <button className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg flex items-center shadow hover:bg-blue-100 transition">
            {isLoggedIn ? <FaUser className="mr-2" /> : <FaSignInAlt className="mr-2" />}
            {isLoggedIn ? 'Profile' : 'Masuk'}
          </button>
        </div>

        {/* Hamburger Button (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-blue-500 space-y-3">
          <a href="/" className="block text-white hover:underline">Home</a>
          {isLoggedIn ? (
            <>
              <a href="#feedback" className="block text-white hover:underline">Feedback</a>
              <a href="#pendaftaran" className="block text-white hover:underline">Pendaftaran</a>
            </>
          ) : (
            <>
              <a href="#info" className="block text-white hover:underline">Info</a>
              <a href="#galeri" className="block text-white hover:underline">Galeri</a>
            </>
          )}
          <button className="w-full bg-white text-blue-600 font-medium px-4 py-2 rounded-lg flex items-center justify-center shadow hover:bg-blue-100 transition">
            {isLoggedIn ? <FaUser className="mr-2" /> : <FaSignInAlt className="mr-2" />}
            {isLoggedIn ? 'Profile' : 'Masuk'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;
