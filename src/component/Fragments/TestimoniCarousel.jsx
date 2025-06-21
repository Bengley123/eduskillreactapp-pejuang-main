import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { fetchData } from "../../services/api"; //

const TestimoniCarousel = () => {
  const [testimonies, setTestimonies] = useState([]); //
  const [loading, setLoading] = useState(true); //
  const [error, setError] = useState(null); //

  const settings = { //
    dots: true, //
    infinite: true, //
    autoplay: true, //
    autoplaySpeed: 4000, //
    slidesToShow: 1, //
    slidesToScroll: 1, //
    arrows: false, //
  };

  useEffect(() => { //
    const fetchTestimonies = async () => { //
      setLoading(true); //
      setError(null); //
      try {
        const response = await fetchData('/feedback'); //

        let fetchedData = []; //
        if (response && response.data && Array.isArray(response.data.data)) { //
          fetchedData = response.data.data; //
        }
        else if (response && Array.isArray(response.data)) { //
          fetchedData = response.data; //
        }
        else {
          setError('Format data testimoni tidak valid dari API. Respons tidak mengandung array data yang diharapkan.'); //
          console.error('API Response for feedback was not an array or pagination object:', response); //
          setTestimonies([]); //
          return;
        }

        setTestimonies(fetchedData); //

      } catch (err) {
        console.error('Gagal mengambil data testimoni:', err); //
        setError('Gagal memuat testimoni. Silakan coba lagi nanti.'); //
      } finally {
        setLoading(false); //
      }
    };

    fetchTestimonies(); //
  }, []); //

  if (loading) { //
    return (
      <div className="text-center py-8 text-gray-600">Memuat testimoni...</div> //
    );
  }

  if (error) { //
    return (
      <div className="text-center py-8 text-red-500">{error}</div> //
    );
  }

  if (testimonies.length === 0) { //
    return (
      <div className="text-center py-8 text-gray-600">Belum ada testimoni saat ini.</div> //
    );
  }

  return (
    <Slider {...settings}> {/* */}
      {testimonies.map((item) => { //
        const userName = item.peserta?.user?.name ?? "Pengguna Tak Dikenal"; //
        // *******************************************************************
        // PERBAIKAN DI SINI: Akses item.tempat_kerja
        const userTempatKerja = item.tempat_kerja ?? "Tidak Diketahui"; 
        // *******************************************************************

        const userRoleDisplay = `${userTempatKerja.replace(/_/g, ' ')}`; //

        const photoPathFromApi = item.peserta?.foto_peserta; //
        const baseUrl = 'http://127.0.0.1:8000/storage/'; // // Sesuaikan jika berbeda!
        
        let photoUrl; //
        if (photoPathFromApi && photoPathFromApi !== "") { //
          // Cek apakah URL sudah lengkap (misal: dimulai dengan http/https)
          if (photoPathFromApi.startsWith('http://') || photoPathFromApi.startsWith('https://')) { //
            photoUrl = photoPathFromApi; // // Jika sudah lengkap, gunakan langsung
          } else {
            photoUrl = `${baseUrl}${photoPathFromApi}`; // // Jika hanya path, gabungkan dengan base URL storage
          }
        } else {
          photoUrl = null; // // Fallback placeholder jika tidak ada foto
        }

        return (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-md text-center"> {/* */}
            <p className="text-gray-800 font-medium mb-4">{item.comment}</p> {/* */}
            <div className="flex flex-col items-center"> {/* */}
              <img
                src={photoUrl} //
                alt={userName} //
                className="w-12 h-12 rounded-full mb-2 object-cover" //
              />
              <p className="font-semibold text-gray-900">{userName}</p> {/* */}
              <p className="text-sm text-gray-600">{userRoleDisplay}</p> {/* */}
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default TestimoniCarousel;
