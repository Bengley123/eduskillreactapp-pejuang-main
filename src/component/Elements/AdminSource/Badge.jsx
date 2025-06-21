import React from 'react';

const Badge = ({ children, variant = "default", size = "md" }) => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800", 
    danger: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800"
  };

  const sizes = {
    sm: "px-1 py-0.5 text-xs",
    md: "px-2 py-1 text-xs"
  };

  return (
    <span className={`rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;