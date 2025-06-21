import React from 'react';

const Avatar = ({ src, alt, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizes[size]} rounded-full object-cover`} 
    />
  );
};

export default Avatar;