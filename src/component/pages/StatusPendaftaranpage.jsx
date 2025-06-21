import React from "react";
import ImgCard from "../../assets/imgcard1.jpg";
import StatusPendaftaran from "../Fragments/StatusDaftar";

const DaftarStatusPage = () => {
    const daftarStatus = [
      {
        title: "Penjahitan Profesioal Siap Industri Ekspor",
        tanggal: "10 Juni 2025",
        status: "Ditinjau",
      },

    ];
  
    return (
      <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
        <div
                className="h-36 md:h-30 rounded-lg flex items-center justify-center bg-center bg-cover relative"
                style={{
                  backgroundImage: `url(${ImgCard})`,
                  backgroundBlendMode: "overlay",
                  backgroundColor: "rgba(8, 136, 241, 0.5)",
                  //filter: "blur(1px)",
                }}
              >
                <div className="absolute inset-0 bg-blue-900 bg-opacity-60 backdrop-blur-sm rounded-lg"></div>
                <h1 className="relative text-white text-3xl md:text-4xl font-bold z-10 text-left w-full pl-10">
                <label>Status Pendaftaran</label>
                </h1>
        
        </div>
        <div className="max-w-3xl mx-auto">
          {daftarStatus.map((item, index) => (
            <StatusPendaftaran
              key={index}
              title={item.title}
              tanggal={item.tanggal}
              status={item.status}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default DaftarStatusPage;