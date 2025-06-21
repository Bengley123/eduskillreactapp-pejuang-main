import React from "react";
import Label from "../Input/Label";
import InputText from "../Input/Input";

const InputWithLabel = ({ label, type, placeholder, value, onChange, name, icon }) => {
  return (
    <div>
      <Label>{label}</Label>
      <InputText
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        icon={icon} // ✅ pastikan ini lowercase
      />
    </div>
  );
};

export default InputWithLabel;
