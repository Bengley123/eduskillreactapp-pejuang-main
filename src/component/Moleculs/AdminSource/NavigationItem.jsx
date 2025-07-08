import React, { useState } from "react";
import Icon from "../../Elements/AdminSource/Icon";
import Typography from "../../Elements/AdminSource/Typhography";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const NavigationItem = ({
  href,
  icon,
  label,
  isOpen,
  isActive = false,
  subItems = null, // Array of sub-menu items
  onClick = null, // Custom click handler for dropdown
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    if (isOpen && subItems) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    if (subItems) {
      e.preventDefault();
      toggleDropdown();
    }
  };

  // If has sub-items, render as dropdown
  if (subItems) {
    return (
      <div className="relative">
        {/* Main dropdown button */}
        <button
          onClick={handleClick}
          className={`w-full hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white transition-colors ${
            isActive || dropdownOpen ? "bg-gray-700" : ""
          } ${isOpen ? "justify-between" : "justify-center"}`}
        >
          {isOpen ? (
            <>
              <div className="flex items-center">
                <Icon icon={icon} size="md" color="white" className="mr-2" />
                <Typography variant="body2" className="text-white">
                  {label}
                </Typography>
              </div>
              {dropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </>
          ) : (
            <div className="text-center w-full group relative">
              <Icon icon={icon} size="lg" color="white" />
              {/* Tooltip for collapsed state */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}
              </div>
            </div>
          )}
        </button>

        {/* Sub-menu dropdown */}
        {isOpen && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              dropdownOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-6 space-y-1 border-l-2 border-gray-600 pl-4">
              {subItems.map((subItem, index) => (
                <a
                  key={index}
                  href={subItem.href}
                  className={`block hover:bg-gray-700 px-3 py-2 rounded-md transition-colors ${
                    window.location.pathname === subItem.href
                      ? "text-white bg-gray-700"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon
                      icon={subItem.icon}
                      size="sm"
                      color="currentColor"
                      className="mr-2"
                    />
                    <Typography variant="caption" className="text-current">
                      {subItem.label}
                    </Typography>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular navigation item (no dropdown)
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white transition-colors ${
          isActive ? "bg-gray-700" : ""
        }`}
      >
        {isOpen ? (
          <>
            <Icon icon={icon} size="md" color="white" className="mr-2" />
            <Typography variant="body2" className="text-white">
              {label}
            </Typography>
          </>
        ) : (
          <div className="text-center w-full group relative">
            <Icon icon={icon} size="lg" color="white" />
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {label}
            </div>
          </div>
        )}
      </button>
    );
  }
  return (
    <a
      href={href}
      className={`hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white transition-colors ${
        isActive ? "bg-gray-700" : ""
      }`}
    >
      {isOpen ? (
        <>
          <Icon icon={icon} size="md" color="white" className="mr-2" />
          <Typography variant="body2" className="text-white">
            {label}
          </Typography>
        </>
      ) : (
        <div className="text-center w-full group relative">
          <Icon icon={icon} size="lg" color="white" />
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {label}
          </div>
        </div>
      )}
    </a>
  );
};

export default NavigationItem;
