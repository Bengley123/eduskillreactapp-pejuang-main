import React, { useState, useRef, useEffect } from "react";
import NavLink from "./Navlink";
import { FaBell } from "react-icons/fa";

const NavMenu = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleNotif = () => setNotifOpen((prev) => !prev);

  // Menutup dropdown saat klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Link Navigasi */}
      <NavLink href="/">Home</NavLink>
      <NavLink href="/galeri">Galeri</NavLink>

      {/* Dropdown Tentang Kami */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="text-white hover:text-blue-200 px-4 py-2 flex items-center"
        >
          Tentang Kami
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full z-50 w-64 bg-white shadow-lg rounded-b-md overflow-hidden border border-gray-200">
            <div className="py-1">
              {/* Dropdown Items */}
              <a href="/tentangkamilkp" className="block px-6 py-3 hover:bg-blue-50 border-b">LKP Bina ESSA</a>
              <a href="/tentangkamilpk" className="block px-6 py-3 hover:bg-blue-50 border-b">LPK Bina ESSA</a>
              <a href="/tentangkamiyayasan" className="block px-6 py-3 hover:bg-blue-50 border-b">Yayasan Bina ESSA</a>
              {/* <a href="/tentangkami" className="block px-6 py-3 hover:bg-blue-50">Galeri</a> */}
            </div>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <>
          {/* 🔔 Notifikasi di sebelah Pendaftaran */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotif}
              className="text-white hover:text-blue-200 px-4 py-2 flex items-center relative"
            >
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full z-50 w-80 bg-white shadow-lg rounded-md mt-2 border border-gray-200">
                <div className="px-4 py-3 font-semibold border-b">Notifikasi</div>
                <ul className="max-h-60 overflow-y-auto">
                  <li className="px-4 py-2 hover:bg-blue-50 text-gray-700">
                    Pendaftaranmu berhasil!
                  </li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

};

export default NavMenu;
