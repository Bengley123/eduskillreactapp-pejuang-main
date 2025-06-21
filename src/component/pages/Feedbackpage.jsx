import React from "react";
import Button from "../Elements/Button";
import ImgCard from "../../assets/imgcard1.jpg";

const DetailPelatihan = () => {
  //const { id } = useParams(); // id di sini adalah judul dari pelatihan

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
      {/* Hero Section */}
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
        <label>Feedback</label>
        </h1>

      </div>

      {/* Deskripsi */}
      <div className="bg-white p-10 rounded-lg shadow-md border border-gray-200">
        <div className="bg-white p-6 rounded-lg border">
            <label>Masukkan feedback Anda!</label>
        </div>
      </div>

      {/* Tombol */}
      <div className="mt-8 flex justify-center">
        <Button onClick={() => alert("Pelatihan dimulai!")}>
          Beri Feedback
        </Button>
      </div>
    </div>
  );
};

export default DetailPelatihan;
