import React from "react";

const InputText = ({ type, placeholder, value, onChange, name, icon: Icon }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
      {Icon && <Icon className="text-gray-500 mr-2" />}
      <input
        type={type}
        name={name} // ✅ Tambahkan ini
        placeholder={placeholder}
        className="w-full outline-none"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default InputText;
