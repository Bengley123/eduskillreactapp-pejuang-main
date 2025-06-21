import React, { useState } from "react";
//import { FaBars, FaTimes } from 'react-icons/fa';
import LogoBinaEssa from '../../../assets/logo-bina-essa1.jpg';

const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="h-full">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white flex flex-col h-full transition-all duration-300
                       ${isOpen ? 'w-full' : 'w-16'}`}>
        {/* Logo dan toggle button */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img src={LogoBinaEssa} alt="Bina Essa Logo" className="w-10 h-10 rounded-full" />
            <div className={`flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden sm:block'}`}>
              <div className="text-[9px] leading-tight font-bold text-white">LEMBAGA KURSUS DAN PELATIHAN</div>
              <div className="text-lg font-bold -mt-1 text-white">BINA ESSA</div>
            </div>
          </div>
          
          {/* Tombol toggle di dalam sidebar */}
          {/* <button 
            onClick={toggleSidebar} 
            className="text-white p-1 rounded hover:bg-gray-700 focus:outline-none transition-colors"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button> */}
        </div>

        {/* Navigasi Vertikal */}
        <nav className="flex flex-col space-y-2 mt-6 px-4">
          <a href="/admindashboard" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Dashboard Admin</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-home text-lg"></i>
              </span>
            )}
          </a>
          <a href="/adpeserta" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Peserta</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-users text-lg"></i>
              </span>
            )}
          </a>
          <a href="/adpelatihan" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Pelatihan</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-chalkboard-teacher text-lg"></i>
              </span>
            )}
          </a>
          {/* <a href="#" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Pendaftaran</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-clipboard-list text-lg"></i>
              </span>
            )}
          </a> */}
          <a href="/adkonten" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Kelola Informasi</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-info-circle text-lg"></i>
              </span>
            )}
          </a>
          <a href="/adnotif" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Kelola Feedback</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-info-circle text-lg"></i>
              </span>
            )}
          </a>
          <a href="/adlaporan" className="hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white">
            {isOpen ? (
              <span className="ml-2">Unggah Laporan</span>
            ) : (
              <span className="text-center w-full">
                <i className="fas fa-chart-bar text-lg"></i>
              </span>
            )}
          </a>
        </nav>
      </aside>
    </div>
  );
}

export default SidebarAdmin;