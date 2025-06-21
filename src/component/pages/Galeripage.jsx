import React from 'react';
import image1 from '../../assets/imgcr1.jpg';
import image2 from '../../assets/imgcr2.jpg';
import image3 from '../../assets/imgcr3.jpg';
import image4 from '../../assets/imgcard.jpg';
import image5 from '../../assets/imgcard.jpg';
import image6 from '../../assets/imgcard.jpg';
import image7 from '../../assets/imgcard.jpg';
import image8 from '../../assets/imgcard.jpg';

const galleryItems = [
  { src: image1, alt: 'Kegiatan 1', title: 'Garmen' },
  { src: image2, alt: 'Kegiatan 2', title: 'Jahit' },
  { src: image3, alt: 'Kegiatan 3', title: 'Jahit Mesin' },
  { src: image4, alt: 'Kegiatan 4', title: 'Giling Kopi' },
  { src: image5, alt: 'Kegiatan 4', title: 'Giling Kopi' },
  { src: image6, alt: 'Kegiatan 4', title: 'Giling Kopi' },
  { src: image7, alt: 'Kegiatan 4', title: 'Giling Kopi' },
  { src: image8, alt: 'Kegiatan 4', title: 'Giling Kopi' },
];

const Galeripage = () => {
  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-5xl w-full mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-left">
          GALERI KEGIATAN YAYASAN BINA ESSA
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {galleryItems.map(({ src, alt, title }, index) => (
            <div
              key={index}
              className="bg-gray-50 shadow-md rounded-lg overflow-hidden flex flex-col items-center"
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 w-full text-center">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Galeripage;

