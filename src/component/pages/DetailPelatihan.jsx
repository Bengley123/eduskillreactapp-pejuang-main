// src/pages/DetailPelatihan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DetailPelatihanSection from "../Fragments/DetailPelatihanSection";
import ImgCard from "../../assets/imgcard1.jpg";
import api, { fetchData } from "../../services/api";

const DetailPelatihan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pelatihan, setPelatihan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("DetailPelatihan: ID dari useParams:", id);

  useEffect(() => {
    const fetchPelatihanDetail = async () => {
      if (!id) {
        console.warn("DetailPelatihan: ID pelatihan tidak ditemukan di URL, tidak melakukan fetch.");
        setLoading(false);
        setError("ID pelatihan tidak valid atau tidak ditemukan.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Logika location.state di sini adalah untuk optimasi tampilan awal,
        // data API akan menimpanya setelah selesai fetch.
        if (location.state && location.state.title && location.state.fullDescription) {
          // Hanya set sebagai data awal sementara loading dari API
          setPelatihan({
            id: id,
            nama_pelatihan: location.state.title,
            keterangan_pelatihan: location.state.fullDescription,
            gambar: location.state.image // Asumsi ini adalah URL lengkap atau path storage
          });
          console.log("Data pelatihan dimuat dari location.state (preload):", location.state);
        }

        const response = await fetchData(`/pelatihan/${id}`);
        // PERBAIKAN PENTING DI SINI: Akses response.data untuk objek pelatihan
        if (response && response.data) { // Pastikan response.data ada
          setPelatihan(response.data); // <--- UBAH DI SINI! setPelatihan(response.data)
          console.log("Data pelatihan dimuat dari API:", response.data); // Log data yang sudah benar
        } else {
          setError("Detail pelatihan tidak ditemukan atau format data tidak valid.");
          setPelatihan(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail pelatihan:", err);
        setError("Gagal memuat detail pelatihan. Silakan coba lagi.");
        setPelatihan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPelatihanDetail();
  }, [id, location.state]);

  const handleDaftar = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      navigate(`/daftar/${id}`);
    } else {
      alert("Silakan login terlebih dahulu!");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Memuat detail pelatihan...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!pelatihan) {
    return <div className="text-center mt-10 text-gray-600">Pelatihan tidak ditemukan atau ID tidak valid.</div>;
  }

  const imageUrl = pelatihan.gambar
    ? `http://127.0.0.1:8000/storage/${pelatihan.gambar}`
    : ImgCard;

  return (
    <DetailPelatihanSection
      id={pelatihan.id}
      title={pelatihan.nama_pelatihan}
      imageSrc={imageUrl}
      description={pelatihan.keterangan_pelatihan}
      instructor={pelatihan.instruktur || "Tidak tersedia"}
      biaya={pelatihan.biaya || 0}
      kuota={pelatihan.kuota || 0}
      onDaftar={handleDaftar}
    />
  );
};

export default DetailPelatihan;