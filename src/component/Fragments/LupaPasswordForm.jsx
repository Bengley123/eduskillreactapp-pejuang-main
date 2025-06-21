import React from "react";
import { Link } from "react-router-dom";
import InputWithLabel from "../Elements/Input/index";
import Button from "../Elements/Button/index";
import ErrorMessage from "../Elements/Message/ErrorMessage";
import { FaEnvelope } from "react-icons/fa";

const LupaPasswordForm = ({
  email,
  onEmailChange,
  onSubmit,
  error,
  loading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputWithLabel
        label="Email"
        type="email"
        placeholder="Masukkan email"
        value={email}
        onChange={onEmailChange}
        icon={FaEnvelope}
        name="email"
      />
      
      <ErrorMessage message={error} />

      <div className="w-full flex justify-center mt-6">
        <Button
          loading={loading}
          type="submit"
          variant="dark"
          size="md"
          className="w-full py-2 text-sm"
        >
          Kirim Tautan
        </Button>
      </div>
    </form>
  );
};

export default LupaPasswordForm;