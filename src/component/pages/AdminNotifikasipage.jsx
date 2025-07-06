import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaClock,
  FaUser,
  FaTimes,
} from "react-icons/fa";

const AdminNotifikasiPage = () => {
  // State untuk data notifikasi
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Tips Sukses Menjadi Asisten Lab",
      message:
        "Untuk meningkatkan peluang diterima, pastikan Anda: 1) Memiliki nilai bagus di mata kuliah terkait, 2) Menunjukkan kemampuan komunikasi yang baik, 3) Memiliki pengalaman organisasi, 4) Dapat bekerja dalam tim.",
      type: "Info",
      status: "Terkirim",
      scheduledDate: "2025-01-07",
      createdDate: "2025-01-05",
      author: "Alumni Asisten Lab",
    },
    {
      id: 2,
      title: "Jadwal Wawancara Calon Asisten Lab",
      message:
        "Wawancara untuk calon asisten laboratorium akan dilaksanakan pada tanggal 22-26 Januari 2024. Jadwal detail akan dikirimkan melalui email kepada kandidat yang lolos tahap administrasi.",
      type: "Penting",
      status: "Terkirim",
      scheduledDate: "2025-01-05",
      createdDate: "2025-01-04",
      author: "Koordinator Lab",
    },
    {
      id: 3,
      title: "Persyaratan Minimal IPK untuk Asisten Lab",
      message:
        "Untuk periode ini, persyaratan minimal IPK untuk menjadi asisten laboratorium adalah 3.25. Pastikan IPK Anda memenuhi kriteria sebelum mendaftar.",
      type: "Perhatian",
      status: "Terjadwal",
      scheduledDate: "2025-01-03",
      createdDate: "2025-01-02",
      author: "Departemen Ilkom",
    },
    {
      id: 4,
      title: "Pembukaan Pendaftaran Asisten Lab Semester Genap 2024",
      message:
        "Pendaftaran asisten laboratorium untuk semester genap 2024 telah dibuka. Periode pendaftaran dimulai dari tanggal 1 Januari hingga 15 Januari 2024. Pastikan Anda memenuhi semua persyaratan yang telah ditentukan.",
      type: "Info",
      status: "Terkirim",
      scheduledDate: "2025-01-01",
      createdDate: "2024-12-30",
      author: "Koordinator Lab",
    },
    {
      id: 5,
      title: "Update Sistem Pendaftaran",
      message:
        "Sistem pendaftaran akan mengalami pemeliharaan pada tanggal 20 Januari 2025. Harap selesaikan pendaftaran sebelum waktu tersebut.",
      type: "Perhatian",
      status: "Draft",
      scheduledDate: "2025-01-20",
      createdDate: "2025-01-05",
      author: "Tim IT",
    },
  ]);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "Info",
    scheduledDate: "",
    status: "Draft",
    author: "Admin",
  });

  // State untuk filter
  const [filterType, setFilterType] = useState("Semua");

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "Semua") return true;
    return notification.type === filterType;
  });

  // Handle form submission
  const handleSubmit = () => {
    if (
      !newNotification.title ||
      !newNotification.message ||
      !newNotification.scheduledDate
    ) {
      alert("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    if (editingNotification) {
      // Update existing notification
      setNotifications(
        notifications.map((notification) =>
          notification.id === editingNotification.id
            ? {
                ...newNotification,
                id: editingNotification.id,
                createdDate: editingNotification.createdDate,
              }
            : notification
        )
      );
    } else {
      // Add new notification
      const newId = Math.max(...notifications.map((n) => n.id)) + 1;
      const notification = {
        ...newNotification,
        id: newId,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setNotifications([notification, ...notifications]);
    }

    // Reset form
    setNewNotification({
      title: "",
      message: "",
      type: "Info",
      scheduledDate: "",
      status: "Draft",
      author: "Admin",
    });
    setEditingNotification(null);
    setIsModalOpen(false);
  };

  // Handle edit
  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      scheduledDate: notification.scheduledDate,
      status: notification.status,
      author: notification.author,
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    }
  };

  // Get type badge styling
  const getTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (type) {
      case "Info":
        return `${baseClasses} bg-blue-100 text-blue-600`;
      case "Penting":
        return `${baseClasses} bg-red-100 text-red-600`;
      case "Perhatian":
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Pengumuman
          </h1>
          <button
            onClick={() => {
              setEditingNotification(null);
              setNewNotification({
                title: "",
                message: "",
                type: "Info",
                scheduledDate: "",
                status: "Draft",
                author: "Admin",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <FaPlus size={14} />
            Buat Pengumuman Baru
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["Semua", "Info", "Penting", "Perhatian"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Belum ada pengumuman</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {notification.title}
                    </h3>
                    <span className={getTypeBadge(notification.type)}>
                      {notification.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(notification)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Hapus"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <FaClock size={12} />
                    <span>{formatDate(notification.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUser size={12} />
                    <span>oleh {notification.author}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {notification.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Modal untuk Tambah/Edit Pengumuman */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingNotification
                      ? "Edit Pengumuman"
                      : "Buat Pengumuman Baru"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Pengumuman *
                    </label>
                    <input
                      type="text"
                      value={newNotification.title}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan judul pengumuman"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <textarea
                      value={newNotification.message}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          message: e.target.value,
                        })
                      }
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan isi pengumuman"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipe Pengumuman
                      </label>
                      <select
                        value={newNotification.type}
                        onChange={(e) =>
                          setNewNotification({
                            ...newNotification,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Info">Info</option>
                        <option value="Penting">Penting</option>
                        <option value="Perhatian">Perhatian</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={newNotification.status}
                        onChange={(e) =>
                          setNewNotification({
                            ...newNotification,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Terjadwal">Terjadwal</option>
                        <option value="Terkirim">Terkirim</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Publikasi *
                      </label>
                      <input
                        type="date"
                        value={newNotification.scheduledDate}
                        onChange={(e) =>
                          setNewNotification({
                            ...newNotification,
                            scheduledDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penulis
                      </label>
                      <input
                        type="text"
                        value={newNotification.author}
                        onChange={(e) =>
                          setNewNotification({
                            ...newNotification,
                            author: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nama penulis"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingNotification ? "Update" : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifikasiPage;
