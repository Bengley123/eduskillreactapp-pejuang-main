// src/components/Fragments/PelatihanList.jsx
import React, { useEffect, useState } from "react";
import CardPelatihan from "./CardPelatihan";
import { fetchData } from "../../services/api";

const PelatihanList = () => {
  const [pelatihan, setPelatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchPelatihan = async () => {
      try {
        setLoading(true);
        const url = `/pelatihan?post_status=Published&per_page=9999`;
        const response = await fetchData(url);

        let fetched = [];
        if (Array.isArray(response.data)) {
          fetched = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          fetched = response.data.data;
        }
        setPelatihan(fetched);
      } catch (err) {
        console.error("Error fetching pelatihan:", err);
        setError("Gagal memuat daftar pelatihan.");
      } finally {
        setLoading(false);
      }
    };
    fetchPelatihan();
  }, []);

  // Ambil daftar kategori unik
  const categories = [
    "Semua",
    ...new Set(pelatihan.map((p) => p.kategori).filter(Boolean)),
  ];

  // Filter berdasarkan kategori
  const filtered =
    selectedCategory === "Semua"
      ? pelatihan
      : pelatihan.filter((p) => p.kategori === selectedCategory);

  const displayedPelatihan = showAll ? filtered : filtered.slice(0, 3);

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">
        Memuat daftar pelatihan...
      </div>
    );
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (pelatihan.length === 0)
    return (
      <div className="text-center py-8 text-gray-600">
        Belum ada pelatihan tersedia saat ini.
      </div>
    );

  return (
    <div className="bg-gray-100 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Pelatihan Terbaru
      </h2>

      {/* Filter Kategori */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-sm rounded-full border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List Pelatihan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedPelatihan.map((item) => (
          <CardPelatihan
            key={item.id}
            id={item.id}
            title={item.nama_pelatihan}
            description={item.keterangan_pelatihan}
            // ▼▼▼ APPLY THE SAME FIX HERE ▼▼▼
            image={
              item.foto_pelatihan
                ? `${import.meta.env.VITE_API_URL}${item.foto_pelatihan}`
                : null
            }
            // ▲▲▲ END OF FIX ▲▲▲
            kategori={item.kategori}
          />
        ))}
      </div>
    </div>
  );
};

export default PelatihanList;
