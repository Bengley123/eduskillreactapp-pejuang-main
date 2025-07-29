// src/pages/DetailPelatihan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DetailPelatihanSection from "../Fragments/DetailPelatihanSection";
import ImgCard from "../../assets/imgcard1.jpg";
import api, { fetchData } from "../../services/api";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {children}
      </div>
    </div>
  );
};

// Info Modal
const InfoModal = ({ isOpen, onClose, title, message, type = "info" }) => {
  const getIcon = () => {
    switch(type) {
      case "error":
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="sm:flex sm:items-start">
          {getIcon()}
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-5 sm:mt-4">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};

const DetailPelatihan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pelatihan, setPelatihan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kuotaTersisa, setKuotaTersisa] = useState(0);
  const [jumlahPendaftar, setJumlahPendaftar] = useState(0);

  // Modal states
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: "", message: "", type: "info" });

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
      setModalInfo({
        title: "Login Diperlukan",
        message: "Silakan login terlebih dahulu untuk mendaftar pelatihan ini.",
        type: "warning"
      });
      setShowInfoModal(true);
      return;
    }

    if (kuotaTersisa <= 0) {
      setModalInfo({
        title: "Kuota Penuh",
        message: "Maaf, kuota pelatihan sudah penuh! Silakan coba pelatihan lainnya.",
        type: "error"
      });
      setShowInfoModal(true);
      return;
    }

    // Langsung navigate ke halaman pendaftaran tanpa konfirmasi
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

  const imageUrl = pelatihan.foto_pelatihan
  ? `${import.meta.env.VITE_API_URL}${pelatihan.foto_pelatihan}`
  : ImgCard;


  return (
    <>
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

      {/* Info Modal - hanya untuk login diperlukan dan kuota penuh */}
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </>
  );
};

export default DetailPelatihan;