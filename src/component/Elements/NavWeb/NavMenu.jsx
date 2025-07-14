import React, { useState, useRef, useEffect } from "react";
import NavLink from "./Navlink";
import { FaBell, FaTrashAlt, FaCheck } from "react-icons/fa";
import { notifikasiAPI } from "../../../services/api";

const NavMenu = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
 
  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notifikasiAPI.getMyNotifications(10);
      if (response && response.data) {
        setNotifications(response.data);
        const unread = response.data.filter(notif => notif.status === 'unread').length;
        setUnreadCount(unread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Gagal memuat pengumuman. Silakan coba lagi.");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Toggle notification dropdown and fetch notifications if not already fetched
  const toggleNotif = () => {
    setNotifOpen(prev => !prev);
    if (!notifOpen) {
      fetchNotifications();
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await notifikasiAPI.updateNotificationStatus(id, 'read');
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, status: 'read' } : notif
        )
      );
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      alert("Gagal menandai pengumuman sebagai dibaca.");
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await notifikasiAPI.deleteMyNotification(id);
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        setUnreadCount(prev => {
          const deletedNotif = notifications.find(notif => notif.id === id);
          return deletedNotif?.status === 'unread' ? Math.max(prev - 1, 0) : prev;
        });
      } catch (err) {
        console.error("Failed to delete notification:", err);
        alert("Gagal menghapus pengumuman.");
      }
    }
  };

  // Close dropdowns when clicking outside
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

  // Fetch notifications on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  return (
    <>
      {/* Link Navigasi */}
      <NavLink href="/">Home</NavLink>
      <NavLink href="/pelatihanlengkap">Pelatihan</NavLink>
      {/* Dropdown Tentang Kami */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="text-white hover:text-blue-200 px-4 py-2 flex items-center"
        >
          Tentang Kami
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 top-full z-50 w-64 bg-white shadow-lg rounded-b-md overflow-hidden border border-gray-200">
            <div className="py-1">
              <a href="/tentangkamilkp" className="block px-6 py-3 hover:bg-blue-50 border-b">LKP Bina ESSA</a>
              <a href="/tentangkamilpk" className="block px-6 py-3 hover:bg-blue-50 border-b">LPK Bina ESSA</a>
              <a href="/tentangkamiyayasan" className="block px-6 py-3 hover:bg-blue-50 border-b">Yayasan Bina ESSA</a>
            </div>
          </div>
        )}
      </div>
      <NavLink href="/beritalengkap">Berita</NavLink>
      <NavLink href="/galeri">Galeri</NavLink>

      {isLoggedIn && (
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotif}
            className="text-white hover:text-blue-200 px-4 py-2 flex items-center relative"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 w-80 bg-white shadow-lg rounded-md mt-2 border border-gray-200">
              <div className="px-4 py-3 font-semibold border-b flex justify-between items-center">
                <span>Pengumuman</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-blue-600">{unreadCount} belum dibaca</span>
                )}
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {loading ? (
                  <li className="px-4 py-2 text-gray-500 text-center">Memuat pengumuman...</li>
                ) : error ? (
                  <li className="px-4 py-2 text-red-500 text-center">{error}</li>
                ) : notifications.length === 0 ? (
                  <li className="px-4 py-2 text-gray-500 text-center">Tidak ada pengumuman</li>
                ) : (
                  notifications.map(notif => (
                    <li
                      key={notif.id}
                      className={`px-4 py-2 hover:bg-blue-50 text-gray-700 border-b last:border-b-0 ${
                        notif.status === 'unread' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{notif.judul}</p>
                          <p className="text-xs text-gray-600">{notif.pesan}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.created_at).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {notif.status === 'unread' && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-green-500 hover:text-green-700"
                              title="Tandai sebagai dibaca"
                            >
                              <FaCheck size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus pengumuman"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NavMenu;