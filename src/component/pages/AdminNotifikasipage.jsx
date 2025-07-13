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
                    : "Peserta Diterima"
                  }
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
  const [totalPeserta, setTotalPeserta] = useState(0);
  const [pengumumanList, setPengumumanList] = useState([]);
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
    fetchTotalPeserta();
    fetchPengumumanList();
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
      
      // Handle 404 - endpoint belum ditambahkan
      if (error.message.includes("status: 404")) {
        console.warn("Endpoint /pengumuman belum ditambahkan di routes/api.php");
        setPengumumanList([]);
        return;
      }
      
      // Handle error lainnya
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
          "Peringatan",
          "Tidak dapat memuat daftar pengumuman. Fitur pengiriman pengumuman masih dapat digunakan.",
          "warning"
        );
      }
      
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

    if (totalPeserta === 0) {
      showConfirm(
        "Konfirmasi Pengiriman",
        "Data peserta diterima tidak tersedia. Pengumuman akan dikirim ke semua peserta yang diterima di sistem. Lanjutkan?",
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
        });
        showAlert("Berhasil", "Pengumuman berhasil dikirim!", "success");
      }

      setNotification({
        judul: "",
        pesan: "",
        pengirim: "Admin",
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
      } else if (error.message.includes("status: 404") && editMode) {
        showAlert(
          "Endpoint Belum Tersedia",
          "Route PUT /pengumuman/{id} belum ditambahkan di Laravel. Silakan implementasikan method update() di NotifikasiController.",
          "error"
        );
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
    });
    setEditMode(true);
    setEditId(pengumuman.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm(
      "Hapus Pengumuman",
      "Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini akan menghapus pengumuman untuk semua peserta dan tidak dapat dibatalkan.",
      async () => {
        try {
          await notifikasiAPI.deletePengumuman(id);
          showAlert("Berhasil", "Pengumuman berhasil dihapus", "success");
          fetchPengumumanList();
        } catch (error) {
          console.error("Error deleting pengumuman:", error);
          if (error.message.includes("status: 404")) {
            showAlert("Endpoint Belum Tersedia", "Route DELETE /pengumuman/{id} belum ditambahkan di Laravel.", "error");
          } else {
            showAlert("Gagal", `Gagal menghapus pengumuman: ${error.message}`, "error");
          }
        }
      }
    );
  };

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
                Kirim pengumuman penting kepada peserta yang telah diterima
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : totalPeserta > 0 ? totalPeserta : "⚠️"}
              </div>
              <div className="text-sm text-gray-600">
                {totalPeserta > 0 ? "Peserta Diterima" : "Data Peserta N/A"}
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
              <div className="text-sm text-gray-600">Broadcast ke Peserta Diterima</div>
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
            <li>• Pengumuman akan dikirim ke peserta yang telah diterima pelatihannya</li>
            <li>• Pengumuman akan muncul di ikon lonceng peserta</li>
          </ul>
          
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-0.5" size={14} />
              <div>
                <p className="text-xs text-green-800 font-medium mb-1">Status Backend Laravel:</p>
                <p className="text-xs text-green-700">
                  ✅ <code>POST /notifikasi-pengumuman</code> - Tersedia<br/>
                  🔧 <code>GET /pengumuman</code> - Siap ditambahkan (lihat petunjuk di bawah)<br/>
                  🔧 <code>PUT /pengumuman/{`{id}`}</code> - Siap ditambahkan<br/>
                  🔧 <code>DELETE /pengumuman/{`{id}`}</code> - Siap ditambahkan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Pengumuman */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">Daftar Pengumuman</h3>
                <p className="text-xs text-gray-500">
                  Siap digunakan - implementasi backend tersedia
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {pengumumanList.length} pengumuman ditemukan
              </div>
            </div>
          </div>

          {pengumumanList.length === 0 ? (
            <div className="p-8 text-center">
              <FaBell className="text-gray-300 text-5xl mx-auto mb-4" />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-800 mb-3">
                  <FaInfoCircle size={16} />
                  <span className="font-medium">Petunjuk Implementasi Backend</span>
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-700 mb-3">
                    <strong>1. Tambahkan method berikut ke NotifikasiController.php:</strong>
                  </p>
                  <div className="bg-white rounded border p-3 text-xs font-mono mb-3 overflow-x-auto">
                    <div className="text-green-600">// Method index(), update(), destroy()</div>
                    <div className="text-gray-600">// Kode lengkap sudah disediakan di atas</div>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>2. Tambahkan route di routes/api.php:</strong>
                  </p>
                  <div className="bg-white rounded border p-3 text-xs font-mono">
                    <div className="text-green-600">// Dalam grup middleware admin:</div>
                    <div className="text-blue-600">Route::get('/pengumuman', [NotifikasiController::class, 'index']);</div>
                    <div className="text-blue-600">Route::put('/pengumuman/{`{id}`}', [NotifikasiController::class, 'update']);</div>
                    <div className="text-blue-600">Route::delete('/pengumuman/{`{id}`}', [NotifikasiController::class, 'destroy']);</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 mb-2">
                Setelah implementasi, refresh halaman untuk melihat daftar pengumuman
              </p>
              <p className="text-sm text-gray-400">
                Atau buat pengumuman pertama dengan mengklik tombol "Kirim Pengumuman" di atas
              </p>
            </div>
          ) : (
            <>
              {/* Header untuk aksi */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-end">
                  <div className="text-xs text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaEye className="text-blue-600" size={12} />
                      Lihat Detail
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEdit className="text-green-600" size={12} />
                      Edit
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTrash className="text-red-600" size={12} />
                      Hapus
                    </span>
                  </div>
                </div>
              </div>

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
                            {pengumuman.target_count 
                              ? `${pengumuman.target_count} Peserta` 
                              : "Peserta Diterima"
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
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
                          title="Edit Pengumuman"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(pengumuman.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Pengumuman"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal untuk Kirim Pengumuman */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

                  {/* Info Target Penerima */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FaUsers size={16} />
                      <span className="font-medium">Target Penerima:</span>
                      <span>
                        {totalPeserta > 0 
                          ? `Peserta Diterima (${totalPeserta} orang)` 
                          : "Peserta Diterima di Sistem"
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
                        {editMode ? "Update Pengumuman" : "Kirim ke Peserta Diterima"}
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