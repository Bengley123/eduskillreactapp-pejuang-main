import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaBell,
  FaTimes,
  FaUsers,
  FaUser,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaClock,
  FaEye,
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

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <FaQuestionCircle className="text-yellow-500" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Ya, Lanjutkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail Pengumuman Modal
const DetailPengumumanModal = ({ isOpen, onClose, pengumuman }) => {
  if (!isOpen || !pengumuman) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Detail Pengumuman
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                {pengumuman.judul}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pesan
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                {pengumuman.pesan}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pengirim
                </label>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-gray-900">
                  <FaUser size={14} className="text-gray-500" />
                  <span>{pengumuman.pengirim || "Admin"}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Kirim
                </label>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-gray-900">
                  <FaClock size={14} className="text-gray-500" />
                  <span>
                    {new Date(pengumuman.created_at).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Penerima
              </label>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-gray-900">
                <FaUsers size={14} className="text-gray-500" />
                <span>
                  {pengumuman.target_count
                    ? `${pengumuman.target_count} Peserta`
                    : "Semua Peserta"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
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
  getPengumuman: async () => {
    return await apiRequest("/pengumuman");
  },
  updatePengumuman: async (id, data) => {
    return await apiRequest(`/pengumuman/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deletePengumuman: async (id) => {
    return await apiRequest(`/pengumuman/${id}`, {
      method: "DELETE",
    });
  },
};

const fetchData = async (endpoint) => {
  return await apiRequest(endpoint);
};

const AdminNotifikasiPage = () => {
  const [pesertaList, setPesertaList] = useState([]);
  const [totalPeserta, setTotalPeserta] = useState(0); // <-- 1. ADDED STATE for total count
  const [pengumumanList, setPengumumanList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    judul: "",
    pesan: "",
    pengirim: "Admin",
    excluded_peserta_ids: [],
  });

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Detail Modal State
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    pengumuman: null,
  });

  // Edit Mode State
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPesertaList();
    fetchPengumumanList();
  }, []);

  const fetchPesertaList = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching peserta list from /peserta...");
      const response = await fetchData("/peserta");

      // <-- 2. MODIFIED LOGIC to handle paginated response
      if (response && response.data) {
        setPesertaList(response.data); // This is the list for the current page
        setTotalPeserta(response.total); // This is the TOTAL count from the paginator
        console.log(
          "Peserta loaded:",
          response.data.length,
          "Total in DB:",
          response.total
        );
      } else {
        console.warn("No peserta data received");
        setPesertaList([]);
        setTotalPeserta(0);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
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
          "Gagal memuat daftar peserta. Sistem pengumuman masih bisa digunakan.",
          "warning"
        );
      }
      setPesertaList([]);
      setTotalPeserta(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPengumumanList = async () => {
    try {
      const response = await notifikasiAPI.getPengumuman();

      if (response && response.data) {
        setPengumumanList(response.data);
      } else {
        setPengumumanList([]);
      }
    } catch (error) {
      console.error("Error fetching pengumuman:", error);
      setPengumumanList([]);
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

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
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

    if (totalPeserta === 0 && notification.excluded_peserta_ids.length === 0) {
      showConfirm(
        "Konfirmasi Pengiriman",
        "Data peserta tidak tersedia. Pengumuman akan dikirim ke semua peserta di sistem. Lanjutkan?",
        () => sendNotification()
      );
    } else {
      sendNotification();
    }
  };

  const sendNotification = async () => {
    setIsLoading(true);
    try {
      if (editMode && editId) {
        await notifikasiAPI.updatePengumuman(editId, {
          judul: notification.judul,
          pesan: notification.pesan,
          pengirim: notification.pengirim,
        });
        showAlert("Berhasil", "Pengumuman berhasil diperbarui!", "success");
      } else {
        await notifikasiAPI.sendAnnouncementToAll({
          judul: notification.judul,
          pesan: notification.pesan,
          pengirim: notification.pengirim,
          excluded_peserta_ids: notification.excluded_peserta_ids,
        });
        showAlert("Berhasil", "Pengumuman berhasil dikirim!", "success");
      }

      setNotification({
        judul: "",
        pesan: "",
        pengirim: "Admin",
        excluded_peserta_ids: [],
      });
      setIsModalOpen(false);
      setEditMode(false);
      setEditId(null);

      fetchPengumumanList();
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

  const handleEdit = (pengumuman) => {
    setNotification({
      judul: pengumuman.judul,
      pesan: pengumuman.pesan,
      pengirim: pengumuman.pengirim || "Admin",
      excluded_peserta_ids: [],
    });
    setEditMode(true);
    setEditId(pengumuman.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm(
      "Hapus Pengumuman",
      "Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await notifikasiAPI.deletePengumuman(id);
          showAlert("Berhasil", "Pengumuman berhasil dihapus", "success");
          fetchPengumumanList();
        } catch (error) {
          console.error("Error deleting pengumuman:", error);
          showAlert("Gagal", "Gagal menghapus pengumuman", "error");
        }
      }
    );
  };

  const toggleExcludePeserta = (pesertaId) => {
    setNotification((prev) => ({
      ...prev,
      excluded_peserta_ids: prev.excluded_peserta_ids.includes(pesertaId)
        ? prev.excluded_peserta_ids.filter((id) => id !== pesertaId)
        : [...prev.excluded_peserta_ids, pesertaId],
    }));
  };

  const targetCount =
    totalPeserta > 0
      ? totalPeserta - notification.excluded_peserta_ids.length
      : "Semua";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Kelola Pengumuman
          </h1>
          <button
            onClick={() => {
              setNotification({
                judul: "",
                pesan: "",
                pengirim: "Admin",
                excluded_peserta_ids: [],
              });
              setEditMode(false);
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <FaPlus size={14} />
            Kirim Pengumuman
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
                Kirim pengumuman penting kepada peserta
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {/* <-- 3. UPDATED DISPLAY to use totalPeserta state */}
                {isLoading ? "..." : totalPeserta > 0 ? totalPeserta : "⚠️"}
              </div>
              <div className="text-sm text-gray-600">
                {totalPeserta > 0 ? "Total Peserta" : "Data Peserta N/A"}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {pengumumanList.length}
              </div>
              <div className="text-sm text-gray-600">Total Pengumuman</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                <FaUsers className="text-2xl mx-auto" />
              </div>
              <div className="text-sm text-gray-600">Broadcast</div>
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
            <li>• Klik "Kirim Pengumuman" untuk membuat pengumuman baru</li>
            <li>• Isi judul dan pesan pengumuman</li>
            <li>• Pengumuman akan ditandai dari Admin</li>
            <li>• Pilih peserta yang ingin dikecualikan (opsional)</li>
            <li>• Pengumuman akan muncul di ikon lonceng peserta</li>
          </ul>
        </div>

        {/* Daftar Pengumuman */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Daftar Pengumuman</h3>
          </div>

          {pengumumanList.length === 0 ? (
            <div className="p-8 text-center">
              <FaBell className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">Belum ada pengumuman yang dibuat</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pengumumanList.map((pengumuman) => (
                <div
                  key={pengumuman.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {pengumuman.judul}
                      </h4>
                      <p
                        className="text-gray-600 text-sm mb-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {pengumuman.pesan}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUser size={12} />
                          {pengumuman.pengirim || "Admin"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={12} />
                          {new Date(pengumuman.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUsers size={12} />
                          {pengumuman.target_count || "Semua"} Peserta
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() =>
                          setDetailModal({ isOpen: true, pengumuman })
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(pengumuman)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pengumuman.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal untuk Kirim Pengumuman */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editMode ? "Edit Pengumuman" : "Kirim Pengumuman"}
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

                  {/* Peserta yang Dikecualikan */}
                  {!editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kecualikan Peserta (Opsional)
                      </label>

                      {pesertaList.length === 0 ? (
                        <div className="border border-gray-300 rounded-lg p-4 bg-yellow-50">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <span>⚠️</span>
                            <span className="text-sm font-medium">
                              Data peserta tidak tersedia di halaman ini
                            </span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            Pengumuman akan dikirim ke semua{" "}
                            <strong>{totalPeserta}</strong> peserta di sistem.
                            Gunakan filter di halaman daftar peserta jika ingin
                            mengirim ke grup spesifik.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                            {pesertaList.map((peserta) => (
                              <label
                                key={peserta.id}
                                className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={notification.excluded_peserta_ids.includes(
                                    peserta.id
                                  )}
                                  onChange={() =>
                                    toggleExcludePeserta(peserta.id)
                                  }
                                  className="mr-2"
                                />
                                <span className="text-sm">
                                  {peserta.user?.name ||
                                    peserta.nama_lengkap ||
                                    `Peserta ${peserta.id}`}
                                </span>
                              </label>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-600">
                              {notification.excluded_peserta_ids.length} peserta
                              dikecualikan
                            </span>
                            <span className="text-blue-600 font-medium">
                              {targetCount} peserta akan menerima pengumuman
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
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
                        {editMode
                          ? "Update Pengumuman"
                          : totalPeserta > 0
                          ? `Kirim ke ${targetCount} Peserta`
                          : "Kirim Pengumuman"}
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

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />

        {/* Detail Pengumuman Modal */}
        <DetailPengumumanModal
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, pengumuman: null })}
          pengumuman={detailModal.pengumuman}
        />
      </div>
    </div>
  );
};

export default AdminNotifikasiPage;
