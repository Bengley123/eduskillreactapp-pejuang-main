import React from "react";
import CardPelatihan from "../Fragments/CardPelatihan";
import CarouselComponent from "../Elements/Slideimg/Carouselcomponent";
import TestimoniCarousel from "../Fragments/TestimoniCarousel";
import BeritaSection from '../Fragments/BeritaSection';
import PelatihanList from '../Fragments/PelatihanList';
import BannerSection from '../Fragments/BannerSection';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Safe zone wrapper */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6">

        {/* Carousel Atas */}
        <div className="py-4">
        <CarouselComponent />
        </div>

        {/* Pelatihan */}
        <PelatihanList />

        {/* Banner Section */}
        <BannerSection />

        {/* === SECTION: BERITA === */}
        <BeritaSection />

        {/* === SECTION: TESTIMONI === */}
        <section className="py-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Apa Kata Peserta?</h2>
          <TestimoniCarousel />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
