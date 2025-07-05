import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken, fetchData } from "../../services/api";
import ProfileCard from "../Fragments/ProfileCard";
import StatusStepper from "../Fragments/StatusStepper";
import FeedbackModal from "../Fragments/FeedbackModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshProfile, setRefreshProfile] = useState(0);

  const [registeredTrainings, setRegisteredTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [workplace, setWorkplace] = useState("");

  const statusSteps = [
    "Unggah Persyaratan",
    "Lolos Seleksi",
    "Pelaksanaan Pelatihan",
    "Feedback Pelatihan",
    "Selesai Pelatihan",
  ];

  const getStepIndex = useCallback((status) => {
    switch (status) {
      case "ditinjau":
        return 0; // Unggah Persyaratan
      case "diterima":
        return 1; // Lolos Seleksi
      case "menunggu_feedback":
        return 3;
      case "selesai":
        return 4;
      case "ditolak":
        return "Ditolak";
      default:
        return 0;
    }
  }, []);

  const loadUserProfileAndTrainings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const storedToken = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    if (!storedToken) {
      console.log("ProfilePage: Tidak ada token, mengarahkan ke login.");
      navigate("/login");
      setLoading(false);
      return;
    }

    setAuthToken(storedToken);

    try {
      let currentUserData = null;
      if (storedUser) {
        try {
          currentUserData = JSON.parse(storedUser);
          console.log("ProfilePage: Data pengguna dimuat dari localStorage.");
        } catch (e) {
          console.error("Gagal mengurai data pengguna dari localStorage:", e);
          setError("Data pengguna rusak di penyimpanan lokal.");
          localStorage.removeItem("user");
        }
      }

      if (!currentUserData) {
        console.log("ProfilePage: Data pengguna tidak ada di localStorage atau rusak, mencoba ambil dari API /user.");
        const response = await fetchData("/user");
        if (response && response.data) {
          currentUserData = response.data;
          localStorage.setItem("user", JSON.stringify(currentUserData));
          console.log("ProfilePage: Data pengguna dimuat dari API /user:", currentUserData);
        } else {
          setError("Gagal memuat data pengguna dari API.");
          console.error("ProfilePage: Respon API user tidak valid:", response);
          navigate("/login");
          setLoading(false);
          return;
        }
      }

      setUser(currentUserData);

      console.log("ProfilePage: Mengambil data pendaftaran pelatihan.");
      const registeredTrainingsResponse = await fetchData("/daftar-pelatihan/current-user");
      if (registeredTrainingsResponse && Array.isArray(registeredTrainingsResponse.data)) {
        setRegisteredTrainings(registeredTrainingsResponse.data);
        console.log("ProfilePage: Data pendaftaran pelatihan dimuat:", registeredTrainingsResponse.data);
      } else if (registeredTrainingsResponse && registeredTrainingsResponse.data && Array.isArray(registeredTrainingsResponse.data.data)) {
        setRegisteredTrainings(registeredTrainingsResponse.data.data);
        console.log("ProfilePage: Data pendaftaran pelatihan dimuat (paginasi):", registeredTrainingsResponse.data.data);
      } else {
        console.warn("ProfilePage: Tidak ada data pendaftaran pelatihan atau respons tidak valid:", registeredTrainingsResponse);
        setRegisteredTrainings([]);
      }

    } catch (err) {
      console.error("Gagal mengambil data profil atau pendaftaran pelatihan dari API:", err);
      if (err.response && err.response.status === 401) {
        setError("Sesi kedaluwarsa atau tidak sah. Silakan login kembali.");
      } else {
        setError("Gagal mengambil data profil atau pendaftaran pelatihan. Pastikan Anda sudah login.");
      }
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleProfileUpdated = () => {
    console.log("ProfilePage: Menerima sinyal update, memicu refresh profil.");
    setRefreshProfile(prev => prev + 1);
  };

  const handleSelectTraining = (training) => {
    setSelectedTraining(training);
  };

  const handleBackToTrainings = () => {
    setSelectedTraining(null);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) {
      alert("Feedback tidak boleh kosong.");
      return;
    }
    // Pastikan `selectedTraining.originalRegistration.id` digunakan, karena itu ID dari entri `daftar_pelatihan`
    // yang akan dikaitkan dengan feedback.
    // Jika `selectedTraining.id` sudah merupakan ID dari `daftar_pelatihan` (sesuai cara Anda memuatnya), maka itu benar.
    // Berdasarkan `handleViewPelamar` di `AdminPelatihanPage.jsx` dan cara `selectedTraining` dipetakan di `ProfilePage`,
    // `selectedTraining.id` memang adalah ID dari entri `daftar_pelatihan`.
    if (!selectedTraining?.id) { //
      alert("Pelatihan tidak ditemukan untuk pengiriman feedback."); //
      return; //
    }

    try {
      const token = localStorage.getItem("jwt"); //
      setAuthToken(token); //

      // Kirim data feedback sesuai dengan yang diharapkan backend
      await api.post(
        "/feedback", //
        {
          daftar_pelatihan_id: selectedTraining.id, // ID dari entri daftar_pelatihan
          comment: feedbackContent, // Nama bidang yang benar untuk isi feedback
          tempat_kerja: workplace // Nama bidang yang benar untuk tempat kerja
        }
      );
      alert("Feedback berhasil dikirim!"); //
      setIsFeedbackModalOpen(false); //
      setFeedbackContent(""); //
      setWorkplace(""); //
      setRefreshProfile(prev => prev + 1); //
    } catch (err) {
      console.error("Gagal mengirim feedback:", err); //
      setError(`Gagal mengirim feedback: ${err.response?.data?.message || err.message || 'Terjadi kesalahan tidak dikenal'}`); //
    }
  };

  useEffect(() => {
    loadUserProfileAndTrainings(); //
  }, [refreshProfile, loadUserProfileAndTrainings]); //

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Memuat profil dan pelatihan...</div>; //
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>; //
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-500">Data pengguna tidak tersedia.</div>; //
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 flex flex-col items-center space-y-6">
      <ProfileCard user={user} onEdit={() => navigate("/editprofil")} onProfileUpdated={handleProfileUpdated} />

      {!selectedTraining ? (
        <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-4 flex flex-col items-start space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Pelatihan yang Diikuti</h3>

          {registeredTrainings.length > 0 ? (
            <div className="w-full mt-2">
              {registeredTrainings.map((training) => (
                <div key={training.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-gray-700 font-medium">
                      {training.pelatihan?.nama_pelatihan || 'Nama Pelatihan Tidak Tersedia'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status Pendaftaran: {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">Status Pelatihan: {training.pelatihan?.status_pelatihan || 'Tidak Tersedia'}</p>
                  </div>
                  <button
                    onClick={() => handleSelectTraining(training)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Lihat Detail
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Belum mendaftar pelatihan manapun.</p>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToTrainings}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali</span>
              </button>
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800">{selectedTraining.pelatihan?.nama_pelatihan || 'Detail Pelatihan'}</h2>
            </div>
          </div>

          <StatusStepper
            steps={statusSteps}
            currentStep={getStepIndex(selectedTraining.status)}
            statusString={getStepIndex(selectedTraining.status)}
            trainingStatus={selectedTraining.pelatihan?.status_pelatihan}
            onFeedback={() => setIsFeedbackModalOpen(true)}
          />
        </>
      )}

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        feedback={feedbackContent}
        setFeedback={setFeedbackContent}
        workplace={workplace}
        setWorkplace={setWorkplace}
      />
    </div>
  );
};

export default ProfilePage;