import React, { useState } from "react";
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
import { Link } from "react-router-dom";

const RegisterForm = () => {
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
        setSuccess("Registrasi berhasil! Silakan login.");
        setForm({
          email: "",
          username: "",
          name: "",
          nomor_telp: "",
          password: "",
          password_confirmation: "",
        });
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
      />

      <InputWithLabel
        label="Username"
        type="text"
        placeholder="Masukkan username"
        value={form.username}
        onChange={handleChange}
        icon={FaUser}
        name="username"
      />

      <InputWithLabel
        label="Nama Lengkap"
        type="text"
        placeholder="Masukkan nama"
        value={form.name}
        onChange={handleChange}
        icon={FaSignature}
        name="name"
      />

      <InputWithLabel
        label="Nomor Telp"
        type="text"
        placeholder="Masukkan nomor telepon"
        value={form.nomor_telp}
        onChange={handleChange}
        icon={FaPhone}
        name="nomor_telp"
      />

      <InputWithLabel
        label="Password"
        type="password"
        placeholder="Masukkan password"
        value={form.password}
        onChange={handleChange}
        icon={FaLock}
        name="password"
      />

      <InputWithLabel
        label="Konfirmasi Password"
        type="password"
        placeholder="Masukkan ulang password"
        value={form.password_confirmation}
        onChange={handleChange}
        icon={FaLock}
        name="password_confirmation"
      />

      <ErrorMessage message={error} />

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md mb-4 text-sm">
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
        >
          Daftar
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
