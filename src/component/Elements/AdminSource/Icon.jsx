import React from 'react';

const Icon = ({ icon: IconComponent, size = "md", color = "gray-500", className = "" }) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  };

  return (
    <IconComponent className={`${sizes[size]} text-${color} ${className}`} />
  );
};

export default Icon;