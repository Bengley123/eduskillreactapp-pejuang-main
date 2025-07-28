import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaUser, FaLightbulb, FaDesktop, FaCheckCircle, FaTimes, FaEnvelope } from "react-icons/fa";
import LupaPasswordForm from "../Fragments/LupaPasswordForm";

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-green-500 rounded-t-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Email Berhasil Dikirim!</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-700 mb-2">
              Tautan reset password telah dikirim ke:
            </p>
            <p className="text-blue-600 font-semibold break-all">{email}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Langkah selanjutnya:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Periksa kotak masuk email Anda</li>
              <li>• Klik tautan yang dikirimkan</li>
            </ul>
          </div>

          {/* Close button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main ForgotPassword Page Component
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async () => {
    // Validasi dasar
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Panggil endpoint backend '/api/forgot-password'
      const response = await api.post("/forgot-password", { email });
      
      // Set success message dan tampilkan modal
      setSuccessMessage(response.data.message);
      setSentEmail(email);
      setShowSuccessModal(true);
      
      // Reset form
      setEmail("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSentEmail("");
    setSuccessMessage("");
  };



  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full flex items-center justify-between">
          {/* Left Illustration */}
          <div className="hidden lg:flex flex-col items-center space-y-4 w-1/3">
            <div className="relative">
              <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center relative">
                <FaUser className="w-24 h-24 text-blue-600" />
                <div className="absolute top-4 right-8 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaDesktop className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-8 left-4 w-8 h-8 bg-blue-400 rounded-full"></div>
                <div className="absolute top-8 left-8 w-6 h-6 bg-blue-300 rounded-full"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-300 rounded-full"></div>
            </div>
          </div>

          {/* Center Form */}
          <div className="w-full lg:w-1/3 max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  EduSkill
                </h1>
                <h2 className="text-xl text-blue-600 mb-4">Lupa kata sandi</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Silahkan masukan email untuk menerima tautan perubahan kata
                  sandi
                </p>
              </div>

              {/* Menggunakan komponen LupaPasswordForm */}
              <LupaPasswordForm
                email={email}
                onEmailChange={handleEmailChange}
                onSubmit={handleSubmit}
                error={error}
                loading={loading}
              />

              <div className="mt-6 text-center">
                <div className="text-sm text-gray-600">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Masuk
                  </Link>
                  <span className="mx-2">|</span>
                  <Link
                    to="/register"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:flex flex-col items-center space-y-4 w-1/3">
            <div className="relative">
              <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center relative">
                <FaUser className="w-24 h-24 text-blue-600" />
                <div className="absolute top-6 right-6 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaLightbulb className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-4 left-8 w-10 h-10 bg-blue-400 rounded-full"></div>
                <div className="absolute top-12 left-4 w-6 h-6 bg-blue-300 rounded-full"></div>
              </div>
              <div className="absolute -top-2 -right-6 w-8 h-8 bg-blue-200 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-300 rounded-full"></div>
              <div className="absolute top-4 -right-2 w-4 h-4 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        email={sentEmail}
      />
    </>
  );
}