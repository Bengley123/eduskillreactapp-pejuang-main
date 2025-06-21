import React from "react";

const Button = ({ loading, children, variant = "primary", size = "md", ...props }) => {
  const baseStyle = "rounded-md font-medium focus:outline-none transition-colors duration-200";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    dark: "bg-gray-900 hover:bg-black text-white", 
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-10 py-2",
    lg: "text-lg px-6 py-3",
  };

  return (
    <button
      {...props}
      disabled={loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
};

export default Button;
