import React from 'react';
import Typography from '../../Elements/AdminSource/Typhography';

const DropdownMenu = ({ isOpen, items, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
        >
          <Typography variant="body2">
            {item.label}
          </Typography>
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;