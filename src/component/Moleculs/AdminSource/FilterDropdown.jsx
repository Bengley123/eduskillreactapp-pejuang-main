import React from "react";
import Icon from "../../Elements/AdminSource/Icon";
import { FaFilter } from "react-icons/fa"; // <- Tambahkan ini kalau belum ada

const FilterDropdown = ({ value, onChange, options, label = "Filter" }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon 
        icon={FaFilter} 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        size="sm" 
      />
    </div>
  );
};

export default FilterDropdown; // ✅ Tambahkan ini
