import React from "react";

const CardImage = ({ src, alt }) => {
  return <img src={src} alt={alt} className="w-full h-48 object-cover" />;
};

export default CardImage;
