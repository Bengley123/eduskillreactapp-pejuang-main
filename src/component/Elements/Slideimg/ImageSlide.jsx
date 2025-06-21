import React from "react";

const ImageSlide = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-[500px] object-cover"
    />
  );
};

export default ImageSlide;
