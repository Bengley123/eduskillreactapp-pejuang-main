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
  FaTag,
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

const AdminKategoriPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataKategori, setDataKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [selectedKategori, setSelectedKategori] = useState(null);
  const [editedKategori, setEditedKategori] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    nama_kategori: "",
    deskripsi: "",
    status: "aktif",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

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

  

  const fetchKategoriData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: itemsPerPage,
      });

      if (appliedSearchQuery) {
        params.append("search", appliedSearchQuery);
      }
      // Note: Your backend doesn't seem to use this 'status' filter.
      // I've left the logic here in case you add it later.
      if (statusFilter !== "Semua") {
        params.append("status", statusFilter);
      }

      const endpoint = `${apiEndpoints.kategori}?${params.toString()}`;
      console.log("Fetching Kategori Data from endpoint:", endpoint);

      // 'response' will be { data: [...], links: {...}, meta: {...} }
      const response = await fetchData(endpoint);
      console.log("API Response for Kategori:", response);

      // ▼▼▼ CORRECTED LOGIC ▼▼▼
      // Check for the correct response structure
      if (response && response.data && response.meta) {
        const fetchedRawItems = response.data;
        const meta = response.meta;

        const mappedData = fetchedRawItems.map((item) => ({
          id: item.id,
          nama_kategori: item.nama_kategori || "",
          deskripsi: item.deskripsi || "",
          status: item.status || "aktif",
          jumlah_pelatihan: item.pelatihan_count || 0, // Laravel withCount creates 'field_count'
          created_at: new Date(item.created_at).toLocaleDateString("id-ID"),
          updated_at: new Date(item.updated_at).toLocaleDateString("id-ID"),
        }));

        setDataKategori(mappedData);
        // Set state from the 'meta' object
        setTotalPages(meta.last_page || 1);
        setTotalItems(meta.total || 0);
        setCurrentPage(meta.current_page || 1);
      } else {
        console.warn(
          "API response for kategori data is not in the expected format:",
          response
        );
        // Reset state if data is invalid
        setDataKategori([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      // ▲▲▲ END OF CORRECTED LOGIC ▲▲▲
    } catch (err) {
      console.error("Failed to fetch kategori:", err);
      setError(
        err.message === "Network Error"
          ? "Network Error: Pastikan backend Laravel berjalan."
          : `Failed to load kategori data: ${err.message}`
      );
      setDataKategori([]);
      setTotalPages(1);
      setTotalItems(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchQuery, statusFilter]);

  useEffect(() => {
    fetchKategoriData();
  }, [fetchKategoriData]);

  const handleViewDetail = (kategori) => {
    setSelectedKategori(kategori);
    setEditedKategori(kategori);
    setShowDetail(true);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleDelete = async (kategoriToDelete) => {
    showConfirm(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus kategori "${kategoriToDelete.nama_kategori}" ini?`,
      async () => {
        setLoading(true);
        try {
          await deleteData(apiEndpoints.kategori, kategoriToDelete.id);
          showAlert("success", "Berhasil!", "Kategori berhasil dihapus!");
          fetchKategoriData();
          setShowDetail(false);
        } catch (err) {
          console.error("Failed to delete kategori:", err);
          const errorMessage = err.response?.data?.message || err.message;
          showAlert(
            "error",
            "Gagal Menghapus",
            `Gagal menghapus kategori: ${errorMessage}`
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
    setEditedKategori(selectedKategori);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setValidationErrors({});
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("nama_kategori", editedKategori.nama_kategori);

      const response = await updateData(
        apiEndpoints.kategori,
        selectedKategori.id,
        formData
      );
      if (response) {
        showAlert("success", "Berhasil!", "Kategori berhasil diperbarui!");
        fetchKategoriData();
        setShowDetail(false);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save kategori:", err);
      if (err.response?.status === 422 && err.response.data.errors) {
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
    setEditedKategori((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    if (!form.nama_kategori) {
      setValidationErrors({ nama_kategori: ["Nama kategori wajib diisi"] });
      showAlert(
        "warning",
        "Data Tidak Lengkap",
        "Mohon lengkapi nama kategori"
      );
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama_kategori", form.nama_kategori);
      formData.append("deskripsi", form.deskripsi || "");
      formData.append("status", form.status);

      const response = await createData(apiEndpoints.kategori, formData);
      if (response) {
        showAlert("success", "Berhasil!", "Kategori berhasil ditambahkan!");
        fetchKategoriData();
        setShowForm(false);
        setForm({
          nama_kategori: "",
          deskripsi: "",
          status: "aktif",
        });
      }
    } catch (err) {
      console.error("Failed to add kategori:", err);
      if (err.response?.status === 422 && err.response.data.errors) {
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
          `Gagal menambahkan kategori: ${
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

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setStatusFilter("Semua");
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "aktif":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Aktif
          </span>
        );
      case "nonaktif":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Nonaktif
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
        <Typography variant="h2" className="mt-4 text-gray-700">
          Memuat data kategori...
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
        <Button onClick={fetchKategoriData} variant="primary" className="mt-4">
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
            <FaTag className="text-blue-500" />
            Kelola Kategori Pelatihan
          </h1>
        </div>

        {/* Filter Section - Semua di kanan dan dempet */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-end">
          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              Filter Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama kategori..."
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

          {/* Reset Button jika ada filter */}
          {(appliedSearchQuery || statusFilter !== "Semua") && (
            <button
              onClick={handleResetFilter}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
            >
              Reset Filter
            </button>
          )}

          {/* Button Tambah Kategori */}
          <button
            onClick={() => {
              setShowForm(true);
              setForm({
                nama_kategori: "",
                deskripsi: "",
                status: "aktif",
              });
              setValidationErrors({});
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg rounded transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus size={12} /> Tambah Kategori
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama Kategori</th>
                <th className="px-4 py-2">Dibuat</th>
                <th className="px-4 py-2">Diperbarui</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataKategori.length > 0 ? (
                dataKategori.map((kategori, idx) => (
                  <tr
                    key={kategori.id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {kategori.nama_kategori}
                    </td>
                    <td className="px-4 py-2">{kategori.created_at}</td>
                    <td className="px-4 py-2">{kategori.updated_at}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(kategori)}
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                          title="Lihat Detail"
                        >
                          <FaSearch />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedKategori(kategori);
                            setEditedKategori(kategori);
                            setIsEditing(true);
                            setShowDetail(true);
                          }}
                          className="text-gray-600 hover:text-green-500 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(kategori)}
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
                        {appliedSearchQuery || statusFilter !== "Semua"
                          ? "Tidak ada kategori yang sesuai dengan pencarian atau filter"
                          : "Belum ada data kategori"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(
                currentPage * itemsPerPage,
                (currentPage - 1) * itemsPerPage + dataKategori.length
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

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Tambah Kategori</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nama_kategori">Nama Kategori</Label>
                  <InputText
                    type="text"
                    id="nama_kategori"
                    name="nama_kategori"
                    value={form.nama_kategori}
                    onChange={(e) =>
                      setForm({ ...form, nama_kategori: e.target.value })
                    }
                    required
                    placeholder="Contoh: Digital Marketing"
                  />
                  {validationErrors.nama_kategori && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.nama_kategori[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                    className="w-full p-2 border rounded mt-1 text-sm"
                    rows="3"
                    placeholder="Deskripsi kategori (opsional)"
                  />
                  {validationErrors.deskripsi && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.deskripsi[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full p-2 border rounded mt-1 text-sm"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  {validationErrors.status && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.status[0]}
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

        {showDetail && selectedKategori && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Edit Kategori" : "Detail Kategori"}
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
                  <Label>Nama Kategori</Label>
                  {isEditing ? (
                    <InputText
                      type="text"
                      value={editedKategori.nama_kategori}
                      onChange={(e) =>
                        handleInputChange("nama_kategori", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-medium">
                      {selectedKategori.nama_kategori}
                    </p>
                  )}
                  {validationErrors.nama_kategori && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.nama_kategori[0]}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <>
                    <div>
                      <Label>Deskripsi</Label>
                      <p className="font-medium">
                        {selectedKategori.deskripsi || "-"}
                      </p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedKategori.status)}
                      </div>
                    </div>
                    <div>
                      <Label>Jumlah Pelatihan</Label>
                      <p className="font-medium">
                        {selectedKategori.jumlah_pelatihan} pelatihan
                      </p>
                    </div>
                    <div>
                      <Label>Dibuat</Label>
                      <p className="font-medium">
                        {selectedKategori.created_at}
                      </p>
                    </div>
                    <div>
                      <Label>Diperbarui</Label>
                      <p className="font-medium">
                        {selectedKategori.updated_at}
                      </p>
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
                      onClick={() => handleDelete(selectedKategori)}
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

export default AdminKategoriPage;
