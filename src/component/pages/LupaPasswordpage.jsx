import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLightbulb, FaDesktop } from 'react-icons/fa';
import LupaPasswordForm from '../Fragments/LupaPasswordForm';

// Main ForgotPassword Page Component
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = () => {
    if (!email) {
      setError('Email harus diisi');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Tautan reset password telah dikirim ke email Anda!');
      // Handle success - redirect or show success message
    }, 2000);
  };

  return (
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">EduSkill</h1>
              <h2 className="text-xl text-blue-600 mb-4">Lupa kata sandi</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Silahkan masukan email untuk menerima tautan perubahan kata sandi
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
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Masuk
                </Link>
                <span className="mx-2">|</span>
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
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
  );
}