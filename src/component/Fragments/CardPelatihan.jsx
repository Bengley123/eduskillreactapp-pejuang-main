// src/components/Fragments/CardPelatihan.jsx
import React from "react";
import CardImage from "../Elements/Card/CardImage";
import CardBody from "../Elements/Card/Cardbody";

const CardPelatihan = ({ id, image, title, description, kategori }) => {
  const MAX_DESCRIPTION_LENGTH = 150;

  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };

  const truncatedDescription = truncateDescription(description, MAX_DESCRIPTION_LENGTH);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardImage src={image} alt={title} />
      <div className="p-4">
        {kategori && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mb-2">
            {kategori}
          </span>
        )}
        <CardBody
          id={id}
          title={title}
          description={truncatedDescription}
          image={image}
          fullDescription={description}
        />
      </div>
    </div>
  );
};

export default CardPelatihan;
