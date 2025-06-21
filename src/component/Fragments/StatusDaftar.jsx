import React from "react";

const StatusPendaftaran = ({ title, tanggal, status }) => {
    // Warna tombol sesuai status
    const buttonClass = status === "Diterima"
      ? "bg-green-500 hover:bg-green-600"
      : status === "Ditinjau"
      ? "bg-yellow-500 hover:bg-yellow-600"
      : "bg-red-500 hover:bg-red-600";
  
    return (
      
      <div className="bg-white shadow-md rounded-xl p-6 mb-4 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-3">Tanggal Pelatihan: <strong>{tanggal}</strong></p>
        <div className="flex justify-end">
          <button className={`text-white px-4 py-2 rounded-md ${buttonClass}`}>
            {status}
          </button>
        </div>
      </div>
    );
  };
  
  export default StatusPendaftaran;
  