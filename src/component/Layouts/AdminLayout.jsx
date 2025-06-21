import React, { useState, useRef, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Fragments/SidebarAdmin';
import Header from '../Fragments/HeaderAdmin';
import { AuthContext } from '../Layouts/Contexts/AuthContext';
import LogoBinaEssa from '../../assets/logo-bina-essa1.jpg';

const AdminTemplate = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dropdownItems = [
    { label: 'Keluar', onClick: handleLogout }
  ];

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0 sm:w-16'} bg-slate-900 text-white flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden`}>
        <Sidebar 
          isOpen={isSidebarOpen}
          logoSrc={LogoBinaEssa}
          companyName="BINA ESSA"
        />
      </aside>

      <div className="flex-1 flex flex-col">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          searchValue={searchValue}
          onSearchChange={(e) => setSearchValue(e.target.value)}
          isDropdownOpen={isDropdownOpen}
          onDropdownToggle={() => setDropdownOpen(!isDropdownOpen)}
          dropdownItems={dropdownItems}
          dropdownRef={dropdownRef}
        />

        <main className="flex-1 bg-gray-100 overflow-x-auto p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminTemplate;