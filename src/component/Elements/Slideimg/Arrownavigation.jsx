// src/component/atoms/CustomArrows.jsx
import React from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-3xl text-white z-10"
    onClick={onClick}
  >
    <FaChevronRight />
  </div>
);

export const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-3xl text-white z-10"
    onClick={onClick}
  >
    <FaChevronLeft />
  </div>
);
