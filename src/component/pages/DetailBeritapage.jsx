import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; 

const BeritaDetail = () => {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeritaDetail = async () => {
      setLoading(true);
      setError(null);
      try {
       
        const response = await axios.get(`http://localhost:8000/api/berita/${id}`);
        
        setBerita(response.data.data); 
      } catch (err) {
        console.error("Gagal mengambil detail berita:", err);
        setError("Gagal memuat berita. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeritaDetail();
  }, [id]); 

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Memuat berita...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!berita) {
    return <div className="text-center text-red-500 py-10">Berita tidak ditemukan.</div>;
  }

  const getImageUrl = (gambarPath) => {
    if (!gambarPath) return "https://via.placeholder.com/800x400?text=No+Image"; 
    return `http://localhost:8000/storage/${gambarPath}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={getImageUrl(berita.gambar)} 
        alt={berita.title}
        className="w-full h-64 object-cover rounded-lg shadow mb-6"
      />
      <p className="text-sm text-gray-500">{berita.date}</p> 
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{berita.title}</h1>
      <p className="text-gray-700 leading-relaxed">{berita.deskripsi}</p> 
    </div>
  );
};

export default BeritaDetail;