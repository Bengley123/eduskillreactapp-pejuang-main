// src/components/Fragments/CardPelatihan.jsx
import React from "react";
import CardImage from "../Elements/Card/CardImage";
import CardBody from "../Elements/Card/Cardbody";

// Tambahkan 'id' ke dalam daftar props CardPelatihan
const CardPelatihan = ({ id, image, title, description }) => { //
  const MAX_DESCRIPTION_LENGTH = 150;

  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const truncatedDescription = truncateDescription(description, MAX_DESCRIPTION_LENGTH);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardImage src={image} alt={title} />
      <CardBody
        id={id} 
        title={title}
        description={truncatedDescription}
        image={image}
        fullDescription={description}
      />
    </div>
  );
};

export default CardPelatihan;