import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaExclamationCircle,
  FaSpinner,
  FaUserTie,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Typography from "../Elements/AdminSource/Typhography";
import Button from "../Elements/Button/index";
import InputText from "../Elements/Input/Input";
import Label from "../Elements/Input/Label";

import {
  fetchData,
  createData,
  updateData,
  deleteData,
  apiEndpoints,
} from "../../services/api.js";

// Custom Modal Components
const AlertModal = ({
  show,
  onClose,
  type = "info",
  title,
  message,
  children,
}) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case "error":
        return <FaExclamationTriangle className="text-red-500 text-4xl" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500 text-4xl" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-4xl" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div
          className={`text-center p-4 rounded-lg ${getBgColor()} border mb-4`}
        >
          <div className="flex justify-center mb-3">{getIcon()}</div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {title}
            </h3>
          )}
          {message && <p className="text-gray-700">{message}</p>}
          {children}
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  type = "warning",
}) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <FaExclamationTriangle className="text-red-500 text-4xl" />;
      case "success":
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      default:
        return <FaExclamationTriangle className="text-yellow-500 text-4xl" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
      case "success":
        return "bg-green-500 hover:bg-green-600 focus:ring-green-500";
      default:
        return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {title}
            </h3>
          )}
          {message && <p className="text-gray-600">{message}</p>}
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminMentorPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataMentor, setDataMentor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [editedMentor, setEditedMentor] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    nama_mentor: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

  // Custom Modal States
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "warning",
    onConfirm: null,
  });

  // Custom Modal Functions
  const showAlert = (type, title, message) => {
    setAlertModal({
      show: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlertModal({
      show: false,
      type: "info",
      title: "",
      message: "",
    });
  };

  const showConfirm = (title, message, onConfirm, type = "warning") => {
    setConfirmModal({
      show: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const hideConfirm = () => {
    setConfirmModal({
      show: false,
      title: "",
      message: "",
      type: "warning",
      onConfirm: null,
    });
  };

  const fetchMentorData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Buat parameter query string
      const params = new URLSearchParams({
        page: currentPage,
        per_page: itemsPerPage,
      });

      if (appliedSearchQuery) {
        params.append("search", appliedSearchQuery);
      }

      const endpoint = `${apiEndpoints.mentor}?${params.toString()}`;
      console.log("Fetching Mentor Data from endpoint:", endpoint);
      const response = await fetchData(endpoint);
      console.log("API Raw Response for Mentor:", response);
      console.log("=== FULL API RESPONSE DEBUG ===");
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response || {}));
      console.log("Response.data:", response?.data);
      console.log("Response.total:", response?.total);
      console.log("Response.last_page:", response?.last_page);
      console.log("Response.current_page:", response?.current_page);
      console.log("=== END DEBUG ===");

      let fetchedRawItems = [];
      let currentTotal = 0;
      let currentLastPage = 1;
      let currentCurrentPage = 1;

      // Handle Laravel pagination response format
      if (response && response.data && Array.isArray(response.data)) {
        // Direct Laravel pagination response
        fetchedRawItems = response.data;
        currentTotal = response.total || 0;
        currentLastPage = response.last_page || 1;
        currentCurrentPage = response.current_page || 1;
      } else if (response && Array.isArray(response)) {
        // If response is directly an array (non-paginated)
        fetchedRawItems = response;
        currentTotal = response.length;
        currentLastPage = 1;
        currentCurrentPage = 1;
      } else {
        console.warn(
          "API response for mentor data is not in expected format:",
          response
        );
        fetchedRawItems = [];
      }

      const mappedData = fetchedRawItems.map((item) => {
        console.log("Raw item data:", item);

        // Format tanggal dengan lebih robust
        const formatDate = (dateString) => {
          if (!dateString) return "-";

          try {
            // Jika sudah dalam format yang bagus, langsung return
            if (typeof dateString === "string" && dateString.includes(" ")) {
              return dateString;
            }

            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
              return dateString;
            }
            return date.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          } catch (err) {
            console.warn("Error parsing date:", dateString, err);
            return dateString || "-";
          }
        };

        return {
          id: item.id,
          nama_mentor: item.nama_mentor,
          created_at: formatDate(item.tanggal_ditambahkan || item.created_at),
          updated_at: formatDate(
            item.tanggal_diperbarui ||
              item.updated_at ||
              item.tanggal_ditambahkan
          ),
        };
      });

      setDataMentor(mappedData);
      setTotalPages(currentLastPage);
      setTotalItems(currentTotal);
      setCurrentPage(currentCurrentPage);
    } catch (err) {
      console.error("Failed to fetch mentor:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network Error: Pastikan backend Laravel berjalan dan CORS dikonfigurasi dengan benar."
        );
      } else if (err.response) {
        setError(
          `Failed to load mentor data: ${err.response.status} - ${
            err.response.statusText || "Unknown Error"
          }`
        );
        console.error("API Response Error:", err.response.data);
      } else {
        setError("Failed to load mentor data.");
      }
      setDataMentor([]);
      setTotalPages(1);
      setTotalItems(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchQuery]);

  useEffect(() => {
    fetchMentorData();
  }, [fetchMentorData]);

  const handleViewDetail = (mentor) => {
    setSelectedMentor(mentor);
    setEditedMentor(mentor);
    setShowDetail(true);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleDelete = async (mentorToDelete) => {
    showConfirm(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus mentor "${mentorToDelete.nama_mentor}" ini?`,
      async () => {
        setLoading(true);
        try {
          await deleteData(apiEndpoints.mentor, mentorToDelete.id);
          showAlert("success", "Berhasil!", "Mentor berhasil dihapus!");
          fetchMentorData();
          setShowDetail(false);
        } catch (err) {
          console.error("Failed to delete mentor:", err);
          showAlert(
            "error",
            "Gagal Menghapus",
            `Gagal menghapus mentor: ${
              err.response?.data?.message || err.message
            }`
          );
        } finally {
          setLoading(false);
        }
        hideConfirm();
      },
      "danger"
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setEditedMentor(selectedMentor);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setValidationErrors({});
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("nama_mentor", editedMentor.nama_mentor);

      const response = await updateData(
        apiEndpoints.mentor,
        selectedMentor.id,
        formData
      );
      if (response) {
        showAlert("success", "Berhasil!", "Mentor berhasil diperbarui!");
        fetchMentorData();
        setShowDetail(false);
        setIsEditing(false);
      } else {
        throw new Error("Respon update kosong atau tidak valid.");
      }
    } catch (err) {
      console.error("Failed to save mentor:", err);
      if (
        err.response &&
        err.response.status === 422 &&
        err.response.data.errors
      ) {
        setValidationErrors(err.response.data.errors);
        showAlert(
          "error",
          "Validasi Gagal",
          "Mohon periksa kembali input Anda."
        );
      } else {
        showAlert(
          "error",
          "Gagal Menyimpan",
          `Gagal menyimpan perubahan: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedMentor((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    if (!form.nama_mentor) {
      showAlert("warning", "Data Tidak Lengkap", "Mohon lengkapi nama mentor");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama_mentor", form.nama_mentor);

      const response = await createData(apiEndpoints.mentor, formData);
      if (response) {
        showAlert("success", "Berhasil!", "Mentor berhasil ditambahkan!");
        fetchMentorData();
        setShowForm(false);
        setForm({
          nama_mentor: "",
        });
      } else {
        throw new Error("Respon API tidak valid.");
      }
    } catch (err) {
      console.error("Failed to add mentor:", err);
      if (
        err.response &&
        err.response.status === 422 &&
        err.response.data.errors
      ) {
        setValidationErrors(err.response.data.errors);
        showAlert(
          "error",
          "Validasi Gagal",
          "Mohon periksa kembali input Anda."
        );
      } else {
        showAlert(
          "error",
          "Gagal Menambahkan",
          `Gagal menambahkan mentor: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleApplySearch = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApplySearch();
    }
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
        <Typography variant="h2" className="mt-4 text-gray-700">
          Memuat data mentor...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <Typography variant="h2" className="mb-6">
          Terjadi Kesalahan
        </Typography>
        <p>{error}</p>
        <Button onClick={fetchMentorData} variant="primary" className="mt-4">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Custom Modals */}
      <AlertModal
        show={alertModal.show}
        onClose={hideAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />

      <ConfirmModal
        show={confirmModal.show}
        onClose={hideConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      <div className="bg-white p-4 rounded shadow mb-6">
        {/* Header - Hanya judul */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserTie className="text-blue-500" />
            Kelola Data Mentor
          </h1>
        </div>

        {/* Filter Section - Search di kiri, Button Tambah di kanan, dempet */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-end">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama mentor..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleSearchInputKeyPress}
              className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              onClick={handleApplySearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700"
              title="Cari"
            >
              <FaSearch className="h-4 w-4" />
            </button>
          </div>

          {/* Reset Button jika ada pencarian */}
          {appliedSearchQuery && (
            <button
              onClick={handleResetFilter}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
            >
              Reset Filter
            </button>
          )}

          {/* Button Tambah Mentor */}
          <button
            onClick={() => {
              setShowForm(true);
              setForm({
                nama_mentor: "",
              });
              setValidationErrors({});
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg rounded transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus size={12} /> Tambah Mentor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama Mentor</th>
                <th className="px-4 py-2">Dibuat</th>
                <th className="px-4 py-2">Diperbarui</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataMentor.length > 0 ? (
                dataMentor.map((mentor, idx) => (
                  <tr
                    key={mentor.id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {mentor.nama_mentor}
                    </td>
                    <td className="px-4 py-2">{mentor.created_at}</td>
                    <td className="px-4 py-2">{mentor.updated_at}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(mentor)}
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                          title="Lihat Detail"
                        >
                          <FaSearch />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMentor(mentor);
                            setEditedMentor(mentor);
                            setIsEditing(true);
                            setShowDetail(true);
                          }}
                          className="text-gray-600 hover:text-green-500 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(mentor)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaExclamationCircle className="text-3xl mb-2 text-gray-400" />
                      <p className="text-sm">
                        {appliedSearchQuery
                          ? "Tidak ada mentor yang sesuai dengan pencarian"
                          : "Belum ada data mentor"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(
                currentPage * itemsPerPage,
                (currentPage - 1) * itemsPerPage + dataMentor.length
              )}{" "}
              dari {totalItems} data
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handlePrevPage}
                className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Form Tambah Mentor */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Tambah Mentor</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="nama_mentor">Nama Mentor</Label>
                  <InputText
                    type="text"
                    id="nama_mentor"
                    name="nama_mentor"
                    value={form.nama_mentor}
                    onChange={(e) =>
                      setForm({ ...form, nama_mentor: e.target.value })
                    }
                    required
                    placeholder="Contoh: John Doe"
                  />
                  {validationErrors.nama_mentor && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.nama_mentor[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && selectedMentor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Edit Mentor" : "Detail Mentor"}
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <Label>Nama Mentor</Label>
                  {isEditing ? (
                    <InputText
                      type="text"
                      value={editedMentor.nama_mentor}
                      onChange={(e) =>
                        handleInputChange("nama_mentor", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-medium">{selectedMentor.nama_mentor}</p>
                  )}
                  {validationErrors.nama_mentor && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.nama_mentor[0]}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <>
                    <div>
                      <Label>Dibuat</Label>
                      <p className="font-medium">{selectedMentor.created_at}</p>
                    </div>

                    <div>
                      <Label>Diperbarui</Label>
                      <p className="font-medium">{selectedMentor.updated_at}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded inline-flex items-center gap-1 text-sm"
                    >
                      <FaSave size={12} /> Simpan
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelete(selectedMentor)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded inline-flex items-center gap-1 text-sm"
                    >
                      <FaTrashAlt size={12} /> Hapus
                    </button>
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded inline-flex items-center gap-1 text-sm"
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setShowDetail(false)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded text-sm"
                    >
                      Tutup
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMentorPage;
