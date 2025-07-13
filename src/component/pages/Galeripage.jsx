import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/api'; // Import fungsi API

const Galeripage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk modal lightbox
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch data galeri dari API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const response = await fetchData('/informasi-galeri');
        
        let items = [];
        if (response && response.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response && Array.isArray(response.data)) {
          items = response.data;
        } else if (response && Array.isArray(response)) {
          items = response;
        } else {
          console.warn('Unexpected data format for Galeri:', response);
          items = [];
        }

        // Transform data untuk sesuai dengan format yang dibutuhkan
        const transformedItems = items.map((item) => ({
          id: item.id,
          src: item.file_foto 
            ? (item.file_foto.startsWith('http') 
                ? item.file_foto 
                : `http://127.0.0.1:8000/storage/${item.file_foto}`)
            : null,
          alt: item.judul_foto || 'Kegiatan',
          title: item.judul_foto || 'Kegiatan',
          createdAt: item.created_at
        }));

        setGalleryItems(transformedItems);
      } catch (err) {
        console.error('Failed to load gallery data:', err);
        setError('Gagal memuat data galeri. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Handle ESC key dan arrow keys untuk navigasi modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'Escape':
          setIsModalOpen(false);
          break;
        case 'ArrowLeft':
          if (galleryItems.length > 1) {
            goToPrevious();
          }
          break;
        case 'ArrowRight':
          if (galleryItems.length > 1) {
            goToNext();
          }
          break;
        default:
          break;
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, galleryItems.length]);

  // Touch handling untuk mobile swipe
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (!isModalOpen || galleryItems.length <= 1) return;
      
      const swipeThreshold = 50;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe left - next image
          goToNext();
        } else {
          // Swipe right - previous image
          goToPrevious();
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isModalOpen, galleryItems.length]);

  // Fungsi untuk membuka modal
  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    setImageLoading(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(0);
  };

  // Navigasi ke gambar sebelumnya
  const goToPrevious = () => {
    setImageLoading(true);
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryItems.length - 1 : prevIndex - 1
    );
  };

  // Navigasi ke gambar selanjutnya
  const goToNext = () => {
    setImageLoading(true);
    setSelectedImageIndex((prevIndex) => 
      prevIndex === galleryItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle image load untuk modal
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat galeri kegiatan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (galleryItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex justify-center py-10 px-4">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-5xl w-full mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-left">
            GALERI KEGIATAN YAYASAN BINA ESSA
          </h2>
          
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Belum Ada Foto Kegiatan
            </h3>
            <p className="text-gray-500">
              Galeri kegiatan akan ditampilkan di sini setelah admin mengunggah foto-foto kegiatan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-5xl w-full mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-left">
            GALERI KEGIATAN YAYASAN BINA ESSA
          </h2>
          <div className="text-sm text-gray-500">
            {galleryItems.length} foto kegiatan
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-gray-50 shadow-md rounded-lg overflow-hidden flex flex-col items-center group hover:shadow-lg transition-shadow duration-300"
            >
              <div 
                className="relative w-full h-48 overflow-hidden cursor-pointer group-hover:ring-2 group-hover:ring-blue-300 rounded-t-lg transition-all duration-300" 
                onClick={() => openModal(index)}
              >
                {item.src ? (
                  <>
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/300x200/e5e7eb/9ca3af?text=Foto+Tidak+Tersedia';
                      }}
                      loading="lazy"
                    />
                    {/* Overlay untuk menunjukkan bahwa gambar bisa diklik */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <p className="text-xs mt-2 text-center">Klik untuk memperbesar</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl">📷</div>
                  </div>
                )}
              </div>
              <div className="p-4 w-full text-center">
                <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                {item.createdAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {isModalOpen && galleryItems[selectedImageIndex] && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-description"
          >
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              {/* Tombol Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 transition-colors duration-200"
                aria-label="Tutup galeri"
                title="Tutup (ESC)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Tombol Previous */}
              {galleryItems.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-colors duration-200"
                  aria-label="Gambar sebelumnya"
                  title="Sebelumnya (←)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Tombol Next */}
              {galleryItems.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-colors duration-200"
                  aria-label="Gambar selanjutnya"
                  title="Selanjutnya (→)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Loading spinner untuk gambar modal */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center" aria-label="Memuat gambar">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}

              {/* Gambar utama dalam modal */}
              <div 
                className="relative flex items-center justify-center w-full h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={galleryItems[selectedImageIndex].src}
                  alt={galleryItems[selectedImageIndex].alt}
                  className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/800x600/e5e7eb/9ca3af?text=Foto+Tidak+Tersedia';
                    setImageLoading(false);
                  }}
                  id="lightbox-image"
                />
              </div>

              {/* Thumbnail navigation (jika ada lebih dari 3 gambar) */}
              {galleryItems.length > 3 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg max-w-md overflow-x-auto">
                  {galleryItems.map((item, index) => (
                    <button
                      key={item.id || index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                        setImageLoading(true);
                      }}
                      className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all duration-200 ${
                        index === selectedImageIndex 
                          ? 'border-white scale-110' 
                          : 'border-gray-400 hover:border-gray-200'
                      }`}
                      aria-label={`Lihat ${item.title}`}
                      title={item.title}
                    >
                      <img
                        src={item.src}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/48x48/e5e7eb/9ca3af?text=?';
                        }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Info gambar di bagian bawah */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black bg-opacity-70 px-6 py-3 rounded-lg max-w-md">
                <h3 
                  id="lightbox-title" 
                  className="text-lg font-medium mb-1"
                >
                  {galleryItems[selectedImageIndex].title}
                </h3>
                {galleryItems[selectedImageIndex].createdAt && (
                  <p 
                    id="lightbox-description" 
                    className="text-sm text-gray-300"
                  >
                    {new Date(galleryItems[selectedImageIndex].createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
                {galleryItems.length > 1 && (
                  <>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedImageIndex + 1} dari {galleryItems.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Gunakan ← → atau swipe untuk navigasi
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Galeri kegiatan diperbarui secara berkala oleh tim admin.
            {galleryItems.length > 0 && (
              <span className="block mt-1">
                Terakhir diperbarui: {new Date(Math.max(...galleryItems
                  .filter(item => item.createdAt)
                  .map(item => new Date(item.createdAt).getTime())
                )).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Galeripage;