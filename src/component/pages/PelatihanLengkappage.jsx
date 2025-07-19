// src/pages/PelatihanPage.jsx
import React, { useEffect, useState } from "react";
import CardPelatihan from "../Fragments/CardPelatihan";
import { fetchData } from "../../services/api";

const PelatihanPage = () => {
  const [pelatihan, setPelatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchPelatihan = async () => {
      try {
        setLoading(true);
        const response = await fetchData(
          "/pelatihan?post_status=Published&per_page=9999"
        );
        const dataArray = response?.data?.data || response?.data || [];
        setPelatihan(dataArray);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat pelatihan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPelatihan();
  }, []);

  const kategoriUnik = [
    "Semua",
    ...Array.from(
      new Set(pelatihan.map((item) => item.kategori).filter(Boolean))
    ),
  ];

  const filteredPelatihan =
    selectedCategory === "Semua"
      ? pelatihan
      : pelatihan.filter((item) => item.kategori === selectedCategory);

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Semua Pelatihan
        </h1>

        {/* Filter */}
        <div className="mb-6">
          <label
            htmlFor="kategori"
            className="block mb-2 text-gray-700 font-medium"
          >
            Filter Kategori:
          </label>
          <select
            id="kategori"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
          >
            {kategoriUnik.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center">Memuat pelatihan...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && filteredPelatihan.length === 0 && (
          <p className="text-center text-gray-600">
            Belum ada pelatihan tersedia.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPelatihan.map((item) => (
            <CardPelatihan
              key={item.id}
              id={item.id}
              title={item.nama_pelatihan}
              description={item.keterangan_pelatihan}
              image={
                item.gambar
                  ? `http://127.0.0.1:8000/storage/gambar_pelatihan/${item.gambar}`
                  : null
              }
              kategori={item.kategori}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PelatihanPage;
