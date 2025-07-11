import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputWithLabel from "../Elements/Input/index";
import ErrorMessage from "../Elements/Message/ErrorMessage";
import Button from "../Elements/Button/index";
import {
  FaEnvelope,
  FaUser,
  FaSignature,
  FaPhone,
  FaLock,
} from "react-icons/fa";

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    nomor_telp: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.password_confirmation) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal mendaftar");
      } else {
        setSuccess("Registrasi berhasil! Mengalihkan ke halaman login...");
        setForm({
          email: "",
          username: "",
          name: "",
          nomor_telp: "",
          password: "",
          password_confirmation: "",
        });

        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Registrasi berhasil! Silakan login dengan akun Anda.",
              email: form.email // Pass email untuk auto-fill di login form
            }
          });
        }, 2000);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputWithLabel
        label="Email"
        type="email"
        placeholder="Masukkan email"
        value={form.email}
        onChange={handleChange}
        icon={FaEnvelope}
        name="email"
        required
      />

      <InputWithLabel
        label="Username"
        type="text"
        placeholder="Masukkan username"
        value={form.username}
        onChange={handleChange}
        icon={FaUser}
        name="username"
        required
      />

      <InputWithLabel
        label="Nama Lengkap"
        type="text"
        placeholder="Masukkan nama"
        value={form.name}
        onChange={handleChange}
        icon={FaSignature}
        name="name"
        required
      />

      <InputWithLabel
        label="Nomor Telp"
        type="text"
        placeholder="Masukkan nomor telepon"
        value={form.nomor_telp}
        onChange={handleChange}
        icon={FaPhone}
        name="nomor_telp"
        required
      />

      <InputWithLabel
        label="Password"
        type="password"
        placeholder="Masukkan password"
        value={form.password}
        onChange={handleChange}
        icon={FaLock}
        name="password"
        required
      />

      <InputWithLabel
        label="Konfirmasi Password"
        type="password"
        placeholder="Masukkan ulang password"
        value={form.password_confirmation}
        onChange={handleChange}
        icon={FaLock}
        name="password_confirmation"
        required
      />

      <ErrorMessage message={error} />

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md mb-4 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {success}
        </div>
      )}

      <div className="w-full flex justify-center mt-6">
        <Button
          loading={loading}
          type="submit"
          variant="dark"
          size="md"
          className="w-full py-2 text-sm"
          disabled={loading || success} // Disable button saat loading atau success
        >
          {loading ? "Mendaftar..." : success ? "Berhasil!" : "Daftar"}
        </Button>
      </div>

      <p className="text-xs text-center text-gray-600 mt-3">
        Sudah memiliki akun?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login sekarang
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;