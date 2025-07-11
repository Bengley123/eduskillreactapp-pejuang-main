import React from "react";
import { useState } from "react";
import axios from "axios";
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

const LupaPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // This function will be passed to the form component
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // This is the function that makes the API call.
  // It will be passed to the form component's onSubmit prop.
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Sending request to:", "/api/forgot-password");
      console.log("With email:", email);

      // Call the Laravel backend endpoint
      const response = await axios.post("/api/forgot-password", { email });

      console.log("Response received:", response.data);
      console.log("Status code:", response.status);

      // Set the success message from the backend's response
      setSuccessMessage(response.data.message);
    } catch (err) {
      console.error("Error occurred:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      // Handle errors (e.g., validation errors, server errors)
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      // Ensure loading is set to false after the API call finishes
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Lupa Password?</h2>
          <p className="text-gray-600 mt-2">
            Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan
            tautan untuk mereset password Anda.
          </p>
        </div>

        {/* We render your form component and pass the state and handlers to it */}
        <LupaPasswordForm
          email={email}
          onEmailChange={handleEmailChange}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
        />

        {/* Display a success message if the API call was successful */}
        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md text-center">
            {successMessage}
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LupaPasswordForm;