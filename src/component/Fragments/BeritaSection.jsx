import React, { useState, useEffect } from 'react';
import CardBerita from '../Fragments/CardBerita'; 
import { fetchData } from '../../services/api';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BeritaSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData('/berita'); 

        if (response && response.data) {
          const newsData = response.data.data || response.data; 
          setNews(newsData); 
        } else {
          setError('Format data berita tidak valid.');
        }
      } catch (err) {
        console.error('Gagal mengambil data berita:', err);
        setError('Gagal memuat berita terbaru. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const beritaTampil = showAll ? news : news.slice(0, 3);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Berita Terbaru</h2>
        <div className="text-center text-gray-600">Memuat berita...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Berita Terbaru</h2>
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Berita Terbaru</h2>
        <div className="text-center text-gray-600">Tidak ada berita terbaru saat ini.</div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Berita Terbaru</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {beritaTampil.map((item) => (
          <CardBerita
            key={item.id}
            image={item.gambar ? `http://127.0.0.1:8000/storage/${item.gambar}` : null}
            title={item.title}
            date={new Date(item.date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            summary={item.deskripsi.substring(0, 100) + '...'}
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
