// src/components/Molecules/HeroBanner.jsx
import React from "react";

const HeroBanner = ({ title, backgroundImage }) => {
  return (
    <div
      className="h-36 md:h-30 rounded-lg flex items-center justify-center bg-center bg-cover relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(8, 136, 241, 0.5)",
      }}
    >
      <div className="absolute inset-0 bg-blue-900 bg-opacity-60 backdrop-blur-sm rounded-lg"></div>
      <h1 className="relative text-white text-3xl md:text-4xl font-bold z-10 text-center">
        {title}
      </h1>
    </div>
  );
};

export default HeroBanner;
