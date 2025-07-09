// File: src/component/pages/VerificationResultPage.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Nama komponen harus 'VerificationResultPage' agar cocok dengan App.jsx
export default function VerificationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying..."); // 'Verifying...', 'Success', 'Error'
  const [message, setMessage] = useState(
    "Mohon tunggu, kami sedang memverifikasi email Anda."
  );

  useEffect(() => {
    // Ambil parameter dari URL
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");

    if (!id || !hash) {
      setStatus("Error");
      setMessage("Parameter verifikasi tidak lengkap.");
      return;
    }

    // Buat fungsi untuk memanggil API
    const verifyEmail = async () => {
      try {
        // Panggil API backend Anda
        const response = await fetch("http://localhost:8000/api/verify-now", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id, hash }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Terjadi kesalahan.");
        }

        // Jika sukses
        setStatus("Success");
        setMessage(result.message);
      } catch (error) {
        // Jika gagal
        setStatus("Error");
        setMessage(error.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const goToLogin = () => {
    navigate("/login");
  };

  // Tampilan sederhana untuk menunjukkan status
  return (
    <div
      style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}
    >
      {status === "Verifying..." && <h2>Memverifikasi...</h2>}
      {status === "Success" && <h2 style={{ color: "green" }}>✅ Berhasil!</h2>}
      {status === "Error" && <h2 style={{ color: "red" }}>❌ Gagal!</h2>}

      <p style={{ fontSize: "18px", margin: "20px 0" }}>{message}</p>

      {(status === "Success" || status === "Error") && (
        <button
          onClick={goToLogin}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Pergi ke Halaman Login
        </button>
      )}
    </div>
  );
}
