import React, { useState, useRef, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
//import Sidebar from "../Fragments/SidebarAdmin"; // Asumsi menggunakan Sidebar yang sama
//import Header from "../Fragments/HeaderAdmin"; // Asumsi menggunakan Header yang sama
import { AuthContext } from "../Layouts/Contexts/AuthContext";
import { SessionTimeoutProvider } from "../Layouts/Contexts/SessionTimeoutProvider";
//import LogoBinaEssa from "../../assets/logo-bina-essa1.jpg"; // Pastikan path logo benar

export default function KetuaLayout() {
  const [setDropdownOpen] = useState(false);
  //const [isSidebarOpen, setSidebarOpen] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Ambil fungsi logout dan status login dari context
  const { logout, isLoggedIn } = useContext(AuthContext);

  // Efek untuk menutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi untuk handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dropdownItems = [{ label: "Keluar", onClick: handleLogout }];

  // Definisikan seluruh JSX layout ke dalam sebuah variabel
  const layoutContent = (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0 sm:w-16"
        } bg-slate-900 text-white flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          logoSrc={LogoBinaEssa}
          companyName="BINA ESSA"
        />
      </aside> */}

      <div className="flex-1 flex flex-col">
        {/* <Header
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          isDropdownOpen={isDropdownOpen}
          onDropdownToggle={() => setDropdownOpen(!isDropdownOpen)}
          dropdownItems={dropdownItems}
          dropdownRef={dropdownRef}
        /> */}

        <main className="flex-1 bg-gray-100 overflow-x-auto p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );

  // Bungkus layout dengan SessionTimeoutProvider HANYA jika user sudah login
  if (isLoggedIn) {
    return (
      <SessionTimeoutProvider timeoutInMinutes={15}>
        {layoutContent}
      </SessionTimeoutProvider>
    );
  }

  // Jika belum login, tampilkan layout biasa (nantinya akan diarahkan oleh rute)
  return layoutContent;
}