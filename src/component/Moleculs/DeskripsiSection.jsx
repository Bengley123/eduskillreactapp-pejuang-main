// src/components/Molecules/DeskripsiSection.jsx
import React from "react";
import Heading from "../Elements/Head/Heading";
import ParagraphText from "../Elements/Paragraph/ParagraphText";

const DeskripsiSection = ({ title, content }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <Heading>{title}</Heading>
    <ParagraphText>{content}</ParagraphText>
  </div>
);

export default DeskripsiSection;
