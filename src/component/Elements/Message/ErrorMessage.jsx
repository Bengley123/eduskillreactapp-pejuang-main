import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-4 flex items-center text-sm">
      <FaExclamationCircle className="mr-2" />
      {message}
    </div>
  );
};

export default ErrorMessage;
