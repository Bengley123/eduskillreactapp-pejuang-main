import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageSlide from "./ImageSlide"; 

import { fetchData } from "../../../services/api"; 

const CarouselComponent = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData('/slideshow');
        
        let fetchedSlidesData = [];
        if (response && response.data && Array.isArray(response.data.data)) { 
          fetchedSlidesData = response.data.data; // Ambil dari kunci 'data'
        } else if (response && Array.isArray(response.data)) { 
          fetchedSlidesData = response.data; // Jika respons langsung array
        } else {
          setError('Format data slideshow tidak valid dari API.');
          console.error('API Response for slideshow was not an array or pagination object:', response);
          setSlides([]); 
          return; 
        }
        
        setSlides(fetchedSlidesData); 
        
      } catch (err) {
        console.error('Gagal mengambil data slideshow:', err);
        setError('Gagal memuat slideshow. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []); 

  if (loading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-200">
          <div className="text-center text-gray-600">Memuat slideshow...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-red-100">
          <div className="text-center text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-600">Tidak ada gambar slideshow saat ini.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
  
      <div className="w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-lg">
        <Slider {...settings}>
          {slides.map((slide, index) => {
            const imageUrl = slide.url_gambar 
                             ? slide.url_gambar 
                             : `https://placehold.co/1000x500/e0e0e0/888888?text=Image+Missing`; 
            
            return (
              <div key={slide.id || index}> 
                <ImageSlide 
                  src={imageUrl} // URL yang sudah benar
                  alt={slide.nama_slide || `Slide ${index + 1}`} 
                />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default CarouselComponent;
