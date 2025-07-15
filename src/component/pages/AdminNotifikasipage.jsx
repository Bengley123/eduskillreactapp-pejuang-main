import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaBell,
  FaTimes,
  FaUsers,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

// Custom Modal Components with consistent design
const AlertModal = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const iconMap = {
    success: <FaCheckCircle className="text-green-500" size={24} />,
    error: <FaExclamationCircle className="text-red-500" size={24} />,
    warning: <FaExclamationCircle className="text-yellow-500" size={24} />,
    info: <FaInfoCircle className="text-blue-500" size={24} />,
  };

  const colorMap = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{iconMap[type]}</div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${colorMap[type]} mb-2`}>
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Storage helper with fallback
const storage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.log("localStorage not available");
    }
  },
};

// API request function with Auth Token
const apiRequest = async (endpoint, options = {}) => {
  const token = storage.getItem("jwt");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api${endpoint}`,
      finalOptions
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

const notifikasiAPI = {
  sendAnnouncementToAll: async (data) => {
    return await apiRequest("/notifikasi-pengumuman", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

const fetchData = async (endpoint) => {
  return await apiRequest(endpoint);
};

const AdminNotifikasiPage = () => {
  const [totalPeserta, setTotalPeserta] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    judul: "",
    pesan: "",
    pengirim: "Admin",
  });

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    fetchTotalPeserta();
  }, []);

  const fetchTotalPeserta = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching total peserta with status diterima from /peserta...");
      // Fetch dengan filter status diterima seperti di halaman peserta
      const response = await fetchData("/peserta?registration_status=diterima");

      if (response && response.total) {
        setTotalPeserta(response.total);
        console.log("Total peserta yang diterima:", response.total);
      } else if (response && response.data) {
        // Fallback jika tidak ada total, hitung dari data array
        setTotalPeserta(response.data.length);
        console.log("Total peserta yang diterima (dari array):", response.data.length);
      } else {
        console.warn("No peserta total received");
        setTotalPeserta(0);
      }
    } catch (error) {
      console.error("Error fetching total peserta:", error);
      if (error.message.includes("Session expired")) {
        showAlert(
          "Sesi Berakhir",
          "Sesi Anda telah berakhir. Silakan login kembali.",
          "error"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        showAlert(
          "Gagal Memuat Data",
          "Gagal memuat jumlah peserta. Sistem pengumuman masih bisa digunakan.",
          "warning"
        );
      }
      setTotalPeserta(0);
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (title, message, type = "info") => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const handleSubmit = async () => {
    if (!notification.judul || !notification.pesan) {
      showAlert(
        "Peringatan",
        "Mohon lengkapi judul dan pesan pengumuman",
        "warning"
      );
      return;
    }

    sendNotification();
  };

  const sendNotification = async () => {
    setIsLoading(true);
    try {
      await notifikasiAPI.sendAnnouncementToAll({
        judul: notification.judul,
        pesan: notification.pesan,
        pengirim: notification.pengirim,
      });
      
      showAlert("Berhasil", "Pengumuman berhasil dikirim ke semua peserta!", "success");

      setNotification({
        judul: "",
        pesan: "",
        pengirim: "Admin",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      if (error.message.includes("Session expired")) {
        showAlert(
          "Sesi Berakhir",
          "Sesi Anda telah berakhir. Silakan login kembali.",
          "error"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        showAlert(
          "Gagal",
          "Gagal mengirim pengumuman. Silakan coba lagi.",
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Kirim Pengumuman
          </h1>
          <button
            onClick={() => {
              setNotification({
                judul: "",
                pesan: "",
                pengirim: "Admin",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <FaPlus size={14} />
            Buat Pengumuman
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBell className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sistem Pengumuman</h3>
              <p className="text-gray-600 text-sm">
                Kirim pengumuman penting kepada semua peserta
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : totalPeserta > 0 ? totalPeserta : "⚠️"}
              </div>
              <div className="text-sm text-gray-600">
                {totalPeserta > 0 ? "Peserta" : "Data Peserta N/A"}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                <FaUsers className="text-2xl mx-auto" />
              </div>
              <div className="text-sm text-gray-600">Broadcast ke Peserta</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Aktif</div>
              <div className="text-sm text-gray-600">Status Sistem</div>
            </div>
          </div>
        </div>

        {/* Petunjuk */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">Cara Menggunakan:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Klik "Buat Pengumuman" untuk membuat pengumuman baru</li>
            <li>• Isi judul dan pesan pengumuman</li>
            <li>• Pengumuman akan ditandai dari Admin</li>
            <li>• Pengumuman akan dikirim ke semua peserta yang telah masuk/login ke aplikasi web!</li>
            <li>• Pengumuman akan muncul di notifikasi lonceng peserta</li>
          </ul>
        </div>



        {/* Modal untuk Kirim Pengumuman */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Buat Pengumuman Baru
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Judul */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Pengumuman *
                    </label>
                    <input
                      type="text"
                      value={notification.judul}
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          judul: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan judul pengumuman"
                    />
                  </div>

                  {/* Pesan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <textarea
                      value={notification.pesan}
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          pesan: e.target.value,
                        })
                      }
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan isi pengumuman"
                    />
                  </div>

                  {/* Pengirim (Display Only, Non-Editable) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pengirim
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 flex items-center gap-2">
                      <FaUser size={14} />
                      <span>{notification.pengirim}</span>
                    </div>
                  </div>

                  {/* Info Target Penerima */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FaUsers size={16} />
                      <span className="font-medium">Target Penerima:</span>
                      <span>
                        {totalPeserta > 0 
                          ? `Peserta (${totalPeserta} orang)` 
                          : "Peserta di Sistem"
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isLoading || !notification.judul || !notification.pesan
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <FaBell size={14} />
                        Kirim ke Peserta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </div>
  );
};

export default AdminNotifikasiPage;