import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api"; // Pastikan path ini benar

// Import komponen UI Anda
import InputWithLabel from "../Elements/Input/index"; // Sesuaikan path
import Button from "../Elements/Button/index"; // Sesuaikan path

// Import ikon
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State untuk data dari URL
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  // State untuk form
  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirmation: "",
  });

  // State untuk UI & validasi
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirmation: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // --- Validasi ---
  const validatePassword = (password) => {
    if (!password) return "Password baru tidak boleh kosong.";
    if (password.length < 8) return "Password minimal 8 karakter.";
    // Anda bisa menambahkan validasi regex untuk kompleksitas di sini
    return "";
  };

  const validateConfirmPassword = (confirmPassword, newPassword) => {
    if (!confirmPassword) return "Konfirmasi password tidak boleh kosong.";
    if (confirmPassword !== newPassword)
      return "Konfirmasi password tidak cocok.";
    return "";
  };

  // Efek untuk mengambil token dan email dari URL saat komponen dimuat
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (!urlToken || !urlEmail) {
      setError("Tautan reset password tidak valid atau tidak lengkap.");
    } else {
      setToken(urlToken);
      setEmail(urlEmail);
    }
  }, [searchParams]);

  // Efek untuk mengecek validitas form setiap kali input berubah
  useEffect(() => {
    const passErr = validatePassword(passwordData.password);
    const confirmErr = validateConfirmPassword(
      passwordData.password_confirmation,
      passwordData.password
    );
    
    // Perbarui state error untuk password dan konfirmasi password
    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);
    
    setIsFormValid(!passErr && !confirmErr);
  }, [passwordData]);

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Validasi saat mengetik
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
      // Validasi ulang konfirmasi jika password utama berubah
      if (passwordData.password_confirmation) {
        setConfirmPasswordError(
          validateConfirmPassword(passwordData.password_confirmation, value)
        );
      }
    } else if (name === "password_confirmation") {
      setConfirmPasswordError(
        validateConfirmPassword(value, passwordData.password)
      );
    }
  };

  // Handler untuk toggle visibilitas password
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi lagi sebelum submit untuk memastikan
    const passErr = validatePassword(passwordData.password);
    const confirmErr = validateConfirmPassword(
      passwordData.password_confirmation,
      passwordData.password
    );
    
    // Update error state
    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);
    
    // Hentikan submit jika ada error
    if (passErr || confirmErr) {
      setIsFormValid(false);
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        email,
        token,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      };

      const response = await api.post("/reset-password", payload);
      setSuccessMessage(response.data.message);

      // Arahkan ke halaman login setelah beberapa detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal mengatur ulang password.";
      setError(errorMessage);
      
      // Cek apakah ada error yang spesifik untuk password dari server
      if (err.response?.data?.errors?.password) {
        setPasswordError(err.response.data.errors.password[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">EduSkill</h1>
          <h2 className="text-xl text-blue-600">Atur Ulang Password</h2>
          <p className="text-gray-600 text-sm mt-2">
            Masukkan password baru Anda di bawah ini.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md mb-4 text-sm text-white bg-red-500 text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-md mb-4 text-sm text-white bg-green-500 text-center">
            {successMessage}
          </div>
        )}

        {token && email && !successMessage ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <InputWithLabel
                label="Password Baru"
                type={showPasswords.new ? "text" : "password"}
                name="password"
                value={passwordData.password}
                onChange={handleChange}
                icon={FaLock}
                error={passwordError}
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
              {/* Tambahkan tampilan error yang jelas */}
              {passwordError && (
                <div className="text-red-500 text-sm mt-1">{passwordError}</div>
              )}
            </div>

            <div className="relative">
              <InputWithLabel
                label="Konfirmasi Password Baru"
                type={showPasswords.confirmation ? "text" : "password"}
                name="password_confirmation"
                value={passwordData.password_confirmation}
                onChange={handleChange}
                icon={FaLock}
                error={confirmPasswordError}
                placeholder="Konfirmasi password baru Anda"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmation")}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirmation ? <FaEyeSlash /> : <FaEye />}
              </button>
              {/* Tambahkan tampilan error yang jelas */}
              {confirmPasswordError && (
                <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>
              )}
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <p className="font-medium mb-1">Ketentuan Password Baru:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Minimal 8 karakter.</li>
                <li>Sebaiknya gunakan kombinasi huruf dan angka.</li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Menyimpan..." : "Reset Password"}
            </Button>
          </form>
        ) : !successMessage ? (
          <div className="text-center text-red-600">
            Tautan tidak valid atau parameter tidak ada.
          </div>
        ) : null}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}