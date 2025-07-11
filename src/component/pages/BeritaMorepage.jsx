// src/pages/BeritaPage.jsx
import React, { useEffect, useState } from 'react';
import CardBerita from '../Fragments/CardBerita';
import { fetchData } from '../../services/api';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const BeritaPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetchData('/berita?page=1&per_page=9999');
        const beritaArray = response?.data?.data || response?.data || [];

        if (!Array.isArray(beritaArray)) {
          setError('Format data berita tidak valid.');
          setNews([]);
        } else {
          setNews(beritaArray);
        }
      } catch (err) {
        console.error("Gagal memuat berita:", err);
        setError('Gagal memuat berita. Periksa koneksi atau server.');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Semua Berita</h1>

      {loading && (
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
          <p className="text-gray-600 mt-2">Memuat berita...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500">
          <FaExclamationCircle className="text-4xl mx-auto mb-2" />
          <p>{error}</p>
        </div>
      )}

      {!loading && news.length === 0 && (
        <p className="text-center text-gray-500">Tidak ada berita yang tersedia saat ini.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {news.map((item) => (
          <CardBerita
            key={item.id}
            image={item.gambar ? `http://127.0.0.1:8000/storage/${item.gambar}` : null}
            title={item.title}
            date={new Date(item.date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            summary={item.deskripsi.substring(0, 100) + '...'}
            link={`/berita/${item.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeritaPage;