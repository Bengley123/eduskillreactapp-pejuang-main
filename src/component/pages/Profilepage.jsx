import React, { useEffect, useState } from "react";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [workplace, setWorkplace] = useState("");

  const statusSteps = [
    "Unggah Persyaratan",
    "Lolos Seleksi",
    "Pelaksanaan Pelatihan",
    "Feedback Pelatihan",
    "Selesai Pelatihan",
  ];

  const loadUserProfileAndTrainings = async () => {
    setLoading(true);
    setError(null);

    const storedToken = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    setAuthToken(storedToken);

    try {
      let currentUserData = null;
      if (storedUser) {
        try {
          currentUserData = JSON.parse(storedUser);
        } catch (e) {
          setError("Data pengguna rusak di penyimpanan lokal.");
          localStorage.removeItem("user");
        }
      }

      if (!currentUserData) {
        const response = await fetchData("/user");
        if (response && response.data) {
          currentUserData = response.data;
          localStorage.setItem("user", JSON.stringify(currentUserData));
        } else {
          setError("Gagal memuat data pengguna dari API.");
          navigate("/login");
          return;
        }
      }

      if (currentUserData) {
        setUser(currentUserData);
      } else {
        setError("Data pengguna tidak ditemukan.");
        navigate("/login");
        return;
      }

      // ❗ GUNAKAN DUMMY DATA
      setRegisteredTrainings([
        {
          id: 1,
          pelatihan_id: 101,
          pelatihan: {
            nama_pelatihan: "Pelatihan React Developer",
          },
          status: "Ditolak", // Ubah ke "Ditolak" untuk tes ditolak
        },
      ]);
    } catch (err) {
      setError("Gagal mengambil data profil atau pelatihan.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTraining = (training) => {
    setSelectedTraining(training);
  };

  const handleBackToTrainings = () => {
    setSelectedTraining(null);
  };

  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem("jwt");
      setAuthToken(token);

      await api.post("/feedback", {
        isi_feedback: feedback,
        tempat_kerja: workplace,
        pelatihan_id: selectedTraining?.pelatihan_id,
      });

      alert("Feedback berhasil dikirim!");
      setIsModalOpen(false);
      setFeedback("");
      setWorkplace("");
      setRefreshProfile((prev) => prev + 1);
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim feedback.");
    }
  };
  const getStepIndex = (status) => {
    if (status === "Ditolak") return "Ditolak"; // Beri sinyal khusus
    const index = statusSteps.indexOf(status);
    return index !== -1 ? index : 0; // fallback jika status tidak cocok
  };


  useEffect(() => {
    loadUserProfileAndTrainings();
  }, [navigate, refreshProfile]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Memuat profil dan pelatihan...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-500">Data pengguna tidak tersedia.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 flex flex-col items-center space-y-6">
      <ProfileCard user={user} onEdit={() => navigate("/editprofil")} />

      {!selectedTraining ? (
        <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-4 flex flex-col items-start space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Pelatihan yang Diikuti</h3>

          {registeredTrainings.length > 0 ? (
            <div className="w-full mt-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 font-medium">
                    {registeredTrainings[0].pelatihan.nama_pelatihan}
                  </p>
                  <p className="text-sm text-gray-500">Status: {registeredTrainings[0].status}</p>
                </div>
                <button
                  onClick={() => handleSelectTraining(registeredTrainings[0])}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Lihat Detail
                </button>
              </div>
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
              <h2 className="text-lg font-semibold text-gray-800">{selectedTraining.pelatihan.nama_pelatihan}</h2>
            </div>
          </div>
          
          <StatusStepper
            steps={statusSteps}
            currentStep={getStepIndex(selectedTraining.status)}
            statusString={selectedTraining.status}
            onFeedback={() => setIsModalOpen(true)}
          />
        </>
      )}

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        feedback={feedback}
        setFeedback={setFeedback}
        workplace={workplace}
        setWorkplace={setWorkplace}
      />

    </div>
  );
};

export default ProfilePage;
