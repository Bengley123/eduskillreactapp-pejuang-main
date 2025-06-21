import React from 'react';
import InputText from '../../Elements/Input/Input';
import Icon from '../../Elements/AdminSource/Icon';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ placeholder = "Search...", value, onChange, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <InputText 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={FaSearch}
      />
    </div>
  );
};

export default SearchBox;