import React, { useEffect, useState } from 'react';
import api, { fetchData } from '../../services/api';
import CardPelatihan from './CardPelatihan';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PelatihanList = () => {
  const [pelatihan, setPelatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);  // Toggle lihat semua pelatihan

  useEffect(() => {
    const fetchPelatihan = async () => {
      try {
        setLoading(true);
        const response = await fetchData('/pelatihan');
        if (response && Array.isArray(response.data)) {
          setPelatihan(response.data);
        } else {
          setPelatihan([]);
        }
      } catch (err) {
        setError("Gagal memuat daftar pelatihan.");
        setPelatihan([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPelatihan();
  }, []);

  const limitedPelatihan = showAll ? pelatihan : pelatihan.slice(0, 3);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Memuat daftar pelatihan...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (pelatihan.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Belum ada pelatihan yang tersedia saat ini.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pelatihan Terbaru</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {limitedPelatihan.map((item) => (
          <CardPelatihan
            key={item.id}
            id={item.id}
            title={item.nama_pelatihan}
            description={item.keterangan_pelatihan}
            image={item.gambar ? `http://127.0.0.1:8000/storage/${item.gambar}` : null}
          />
        ))}
      </div>

      {pelatihan.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            {showAll ? (
              <>
                <FaChevronUp className="mr-2" />
                Lihat Lebih Sedikit
              </>
            ) : (
              <>
                <FaChevronDown className="mr-2" />
                Lihat Lebih Banyak
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PelatihanList;
