import React, { useState, useEffect } from "react";
import CardBerita from "../Fragments/CardBerita";
import { fetchData } from "../../services/api";
import {
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const BeritaSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const currentPage = 1;
  const itemsPerPage = 9999; // Mengambil semua berita dalam satu halaman

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Menggunakan parameter untuk mengambil semua berita
        const url = `/berita?page=${currentPage}&per_page=${itemsPerPage}`;
        const response = await fetchData(url); // Menggunakan variabel url yang sudah dibuat

        if (response && response.data) {
          let fetchedNewsData = response.data.data || response.data;
          // Validasi untuk memastikan data yang diterima adalah array
          if (!Array.isArray(fetchedNewsData)) {
            console.warn(
              "API response data for news is not an array:",
              fetchedNewsData
            );
            setError("Format data berita tidak valid.");
            fetchedNewsData = []; // Set ke array kosong jika format salah
          }
          setNews(fetchedNewsData);
        } else {
          setError("Format data berita tidak valid atau tidak ada berita.");
        }
      } catch (err) {
        console.error("Gagal mengambil data berita:", err);
        // Penanganan error yang lebih spesifik
        if (err.code === "ERR_NETWORK") {
          setError(
            "Kesalahan Jaringan: Pastikan backend berjalan dan CORS dikonfigurasi dengan benar."
          );
        } else if (err.response) {
          setError(
            `Gagal memuat berita terbaru: ${err.response.status} - ${
              err.response.statusText || "Kesalahan Tidak Dikenal"
            }`
          );
          console.error("API Response Error:", err.response.data);
        } else {
          setError("Gagal memuat berita terbaru. Silakan coba lagi nanti.");
        }
        setNews([]); // Pastikan state news kosong saat terjadi error
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Dependensi kosong agar fetch hanya berjalan sekali

  const beritaTampil = showAll ? news : news.slice(0, 3);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Berita Terbaru
        </h2>
        <div className="text-center py-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
          <p className="text-gray-600 mt-4">Memuat berita...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Berita Terbaru
        </h2>
        <div className="text-center py-8 text-red-500 bg-red-50 p-6 rounded-lg">
          <FaExclamationCircle className="text-4xl mx-auto mb-3" />
          <p className="font-semibold">Terjadi Kesalahan</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Refresh Halaman
          </button>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Berita Terbaru
        </h2>
        <div className="text-center py-8 text-gray-600">
          <FaExclamationCircle className="mx-auto text-gray-400 text-3xl mb-3" />
          <p>Tidak ada berita terbaru saat ini.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Berita Terbaru
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {beritaTampil.map((item) => (
          <CardBerita
            key={item.id}
            image={
              item.gambar
                ? `http://127.0.0.1:8000/storage/gambar_berita/${item.gambar}`
                : null // Handle jika tidak ada gambar
            }
            title={item.title}
            date={new Date(item.date).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            summary={item.deskripsi.substring(0, 100) + "..."}
            link={`/berita/${item.id}`}
          />
        ))}
      </div>

      {news.length > 3 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
          >
            {showAll ? (
              <>
                <FaChevronUp className="mr-2" />
                Lihat Lebih Sedikit
              </>
            ) : (
              <>
                <FaChevronDown className="mr-2" />
                Lihat Semua Berita
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default BeritaSection;
