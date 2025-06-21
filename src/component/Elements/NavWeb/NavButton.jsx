import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../Layouts/Contexts/AuthContext";

const NavButton = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  const toggleDropdown = () => setOpen(!open);

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-white hover:text-blue-200 text-2xl"
          >
            <FaUserCircle />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50">
              <Link
                to="/profil"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Profil Saya
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-white text-[#31328C] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
        >
          Masuk
        </Link>
      )}
    </>
  );
};

export default NavButton;
