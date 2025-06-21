import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Imgcr1 from "../assets/imgcr1.jpg";
import Imgcr2 from "../assets/imgcr2.jpg";
import Imgcr3 from "../assets/imgcr3.jpg";

const images = [
  Imgcr1,
  Imgcr2,
  Imgcr3,
];

const CarouselComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-lg">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-[500px] object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CarouselComponent;
