import React from "react";
import Imgcard from "../assets/Imgcard.jpg";

const CardPelatihan = ({ title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img src={Imgcard} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
          style={{width:"260px", height:"40px"}}  
        >
          Ikut Pelatihan
        </button>
      </div>
    </div>
  );
};

export default CardPelatihan;
