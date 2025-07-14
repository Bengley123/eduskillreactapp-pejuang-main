// src/Fragments/BannerSection.jsx
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick'; // Import Slider
import "slick-carousel/slick/slick.css"; // Import slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick theme CSS
import { fetchData, apiEndpoints } from '../../services/api.js';

const BannerSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings untuk react-slick carousel
  const settings = {
    dots: true, 
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Menampilkan 1 slide dalam satu waktu
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Ganti slide setiap 3 detik
    // Anda bisa menambahkan atau menyesuaikan pengaturan lain di sini
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchData(apiEndpoints.banner);

        let fetchedBannersData = [];
        if (response && response.data && Array.isArray(response.data.data)) {
          fetchedBannersData = response.data.data;
        } else if (response && Array.isArray(response.data)) {
          fetchedBannersData = response.data;
        } else {
          setError('Invalid banner data format from API.');
          console.error('API Response for banner was not an array or pagination object:', response);
          setBanners([]);
          return;
        }

        setBanners(fetchedBannersData);
        
      } catch (err) {
        console.error("Failed to fetch banners:", err);
        setError('Failed to load banners. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="py-8 text-center text-gray-500">
        Loading banners...
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 text-center text-red-500">
        {error}
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="py-8 text-center text-gray-500">
        No banners available at the moment.
      </section>
    );
  }

  return (
    <section className="py-8">
        {banners.length > 1 ? ( // Jika ada lebih dari satu banner, gunakan carousel
          <div className="w-full h-auto rounded-lg overflow-hidden"> {/* Wrapper untuk carousel */}
            <Slider {...settings}>
              {banners.map((bannerItem) => (
                <div key={bannerItem.id}>
                  {bannerItem.url_gambar ? (
                    <img
                      src={bannerItem.url_gambar} // URL lengkap dari API
                      alt={bannerItem.nama_banner || 'Banner'}
                      className="w-full h-[250px] object-cover " // Tinggi disesuaikan untuk slide
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x300?text=Banner+Image+Not+Found"; }}
                    />
                  ) : (
                    <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                      <span className="text-lg">No image for this banner</span>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        ) : ( // Jika hanya ada satu banner, tampilkan gambar tunggal
          <div className="bg-white rounded-lg overflow-hidden ">
            {banners[0].url_gambar ? (
              <img
                src={banners[0].url_gambar} // URL lengkap dari API
                alt={banners[0].nama_banner || 'Banner'} // 'nama_banner' adalah field dari API
                className="w-full h-64 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x300?text=Banner+Image+Not+Found"; }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="text-lg">No image for this banner</span>
              </div>
            )}
          </div>
        )}
    </section>
  );
};

export default BannerSection;