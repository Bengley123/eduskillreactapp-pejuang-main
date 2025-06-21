// src/components/Elements/Card/Cardbody.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../Head/Heading";
import Paragraph from "../Paragraph/ParagraphText";
import Button from "../Button/index";

// Tambahkan 'id' ke props CardBody
const CardBody = ({ id, title, description, image, fullDescription }) => { //
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("CardBody: Meneruskan ID:", id); // Tambahkan ini
    navigate(`/pelatihan/${id}`, { //
      state: { title, image, fullDescription },
    });
  };

  return (
    <div className="p-4">
      <Heading>{title}</Heading>
      <Paragraph>{description}</Paragraph>
      <div className="w-full flex justify-center mt-4">
        <Button onClick={handleClick} className="w-full max-w-xs h-10">
          Ikut Pelatihan
        </Button>
      </div>

    </div>
  );
};

export default CardBody;