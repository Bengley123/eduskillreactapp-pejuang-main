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
  const [kuotaTersisa, setKuotaTersisa] = useState(0);
  const [jumlahPendaftar, setJumlahPendaftar] = useState(0);

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

        // Fetch detail pelatihan
        const response = await fetchData(`/pelatihan/${id}`);
        
        if (response && response.data) {
          setPelatihan(response.data);
          console.log("Data pelatihan dimuat dari API:", response.data);
          
          // Fetch data pendaftar untuk menghitung kuota tersisa
          await fetchPendaftarData(response.data);
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

    const fetchPendaftarData = async (pelatihanData) => {
      try {
        console.log("Fetching pendaftar data for pelatihan ID:", id);
        
        // Fetch semua pendaftar
        const pendaftarResponse = await fetchData(`/daftar-pelatihan`);
        
        let allPendaftar = [];
        if (pendaftarResponse && Array.isArray(pendaftarResponse.data)) {
          allPendaftar = pendaftarResponse.data;
        } else if (pendaftarResponse && pendaftarResponse.data && Array.isArray(pendaftarResponse.data.data)) {
          allPendaftar = pendaftarResponse.data.data;
        }

        // Filter pendaftar untuk pelatihan ini
        const pendaftarPelatihanIni = allPendaftar.filter(pendaftar => {
          const pelatihanId = pendaftar.pelatihan_id || pendaftar.id_pelatihan;
          return String(pelatihanId) === String(id);
        });

        const jumlahPendaftarPelatihan = pendaftarPelatihanIni.length;
        const kuotaTotal = pelatihanData.jumlah_kuota || 0;
        const kuotaTersisaHitung = Math.max(0, kuotaTotal - jumlahPendaftarPelatihan);

        setJumlahPendaftar(jumlahPendaftarPelatihan);
        setKuotaTersisa(kuotaTersisaHitung);

        console.log("Kuota calculation:", {
          kuotaTotal,
          jumlahPendaftarPelatihan,
          kuotaTersisaHitung,
          pendaftarPelatihanIni
        });

      } catch (err) {
        console.error("Gagal memuat data pendaftar:", err);
        // Jika gagal fetch pendaftar, gunakan kuota penuh
        setKuotaTersisa(pelatihanData.jumlah_kuota || 0);
        setJumlahPendaftar(0);
      }
    };

    fetchPelatihanDetail();
  }, [id, location.state]);

  const handleDaftar = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu!");
      return;
    }

    if (kuotaTersisa <= 0) {
      alert("Maaf, kuota pelatihan sudah penuh!");
      return;
    }

    navigate(`/daftar/${id}`);
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
    ? `http://127.0.0.1:8000/storage/gambar_pelatihan/${pelatihan.gambar}`
    : ImgCard;

  return (
    <DetailPelatihanSection
      id={pelatihan.id}
      title={pelatihan.nama_pelatihan}
      imageSrc={imageUrl}
      description={pelatihan.keterangan_pelatihan}
      kategori={pelatihan.kategori}
      instructor={pelatihan.mentor?.nama_mentor || "Tidak tersedia"}
      biaya={pelatihan.biaya || 0}
      kuota={pelatihan.jumlah_kuota || 0}
      kuotaTersisa={kuotaTersisa}
      jumlahPendaftar={jumlahPendaftar}
      deadline={pelatihan.waktu_pengumpulan}
      onDaftar={handleDaftar}
    />
  );
};

export default DetailPelatihan;