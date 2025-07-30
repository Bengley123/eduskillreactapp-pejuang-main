import React from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../Head/Heading";
import Paragraph from "../Paragraph/ParagraphText";
import Button from "../Button/index";

const CardBody = ({ id, title, description, image, fullDescription }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pelatihan/${id}`, {
      state: { title, image, fullDescription },
    });
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div>
        <Heading>{title}</Heading>
        <Paragraph className="mb-4">{description}</Paragraph>
      </div>
      <Button onClick={handleClick} className="w-full max-w-xs h-10 mx-auto">
        Ikut Pelatihan
      </Button>
    </div>
  );
};

export default CardBody;