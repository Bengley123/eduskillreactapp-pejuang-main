import React from 'react';
import SearchBox from '../Moleculs/AdminSource/SearchBox';
import DropdownMenu from '../Moleculs/AdminSource/DropdownMenu';
import Icon from '../Elements/AdminSource/Icon';
import Button from '../Elements/Button/index';
import { FaBars, FaUserCircle } from 'react-icons/fa';

const Header = ({ 
  onToggleSidebar, 
  searchValue, 
  onSearchChange, 
  isDropdownOpen, 
  onDropdownToggle, 
  dropdownItems,
  dropdownRef 
}) => {
  return (
    <header className="bg-[#305CDE] text-white py-3 px-6 flex justify-between items-center relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="text-white hover:text-gray-200 transition-colors focus:outline-none"
        >
          <Icon icon={FaBars} size="xl" color="white" />
        </button>
        
        {/* <SearchBox 
          placeholder="Search..."
          value={searchValue}
          onChange={onSearchChange}
          className="w-64"
        /> */}
      </div>
      
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={onDropdownToggle}
                className="text-white-700 p-2 rounded-full shadow-md hover:bg-blue-100 transition"
            >
                <FaUserCircle size={28} />
            </button>

            <DropdownMenu 
                isOpen={isDropdownOpen}
                items={dropdownItems}
            />
        </div>

    </header>
  );
};

export default Header;