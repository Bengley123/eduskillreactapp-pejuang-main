// src/components/Admin/AdminKontenpage.jsx
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaUpload,
  FaChevronDown,
  FaChevronRight,
  FaImage,
  FaInfo,
  FaBuilding,
  FaNewspaper,
  FaCalendarAlt,
  FaChevronLeft,
  FaEye,
  FaFlag,
} from "react-icons/fa";

// Pastikan apiEndpoints memiliki definisi untuk visiMisi
import api, {
  fetchData,
  updateData,
  createData,
  deleteData,
  apiEndpoints,
  setAuthToken,
} from "../../services/api.js";

// --- Komponen Pagination (Tidak Berubah) ---
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  searchTerm,
  onSearchChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    rangeWithDots.push(1);

    if (currentPage - delta > 2) {
      rangeWithDots.push("...");
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...");
    }

    if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 p-4 bg-gray-50 rounded">
      <div className="flex items-center gap-2">
        <FaSearch className="text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Cari data..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-1 border rounded text-sm w-48"
        />
      </div>

      <div className="text-sm text-gray-600">
        Menampilkan {startItem}-{endItem} dari {totalItems} data
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <FaChevronLeft size={12} />
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`px-3 py-1 border rounded text-sm ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : page === "..."
                  ? "cursor-default"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Komponen VisiMisiEditor (SUB dari Tentang Kami) - Modifikasi untuk Integrasi API ---
const VisiMisiEditor = ({
  data,
  setData,
  apiEndpoint,
  visiMisiId,
  setVisiMisiId,
  onSaveSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    visi: data?.visi || "",
    misi: data?.misi || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditedData({
      visi: data?.visi || "",
      misi: data?.misi || "",
    });
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData({
      visi: data?.visi || "",
      misi: data?.misi || "",
    });
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("visi", editedData.visi || "");
      formDataToSend.append("misi", editedData.misi || "");

      let response;
      if (visiMisiId) {
        // Jika ada ID, gunakan PUT untuk update
        formDataToSend.append("_method", "PUT"); // Penting untuk Laravel PUT dengan FormData
        response = await updateData(apiEndpoint, visiMisiId, formDataToSend);
      } else {
        // Jika tidak ada ID, gunakan POST untuk membuat baru
        response = await createData(apiEndpoint, formDataToSend);
      }

      // Pastikan response.data memiliki struktur yang diharapkan
      const apiResponseData = response.data.data
        ? response.data.data
        : response.data;

      setData({
        visi: apiResponseData.visi || editedData.visi, // Gunakan data dari API jika tersedia
        misi: apiResponseData.misi || editedData.misi, // Gunakan data dari API jika tersedia
        id: apiResponseData.id || visiMisiId, // Perbarui ID jika ini adalah entri baru
      });

      if (!visiMisiId && apiResponseData.id) {
        setVisiMisiId(apiResponseData.id); // Set ID jika baru dibuat
      }

      alert("Visi dan Misi berhasil disimpan!");
      setIsEditing(false);

      if (onSaveSuccess) {
        onSaveSuccess(); // Panggil fungsi refresh data di parent
      }
    } catch (err) {
      console.error("Failed to save Visi Misi data:", err);
      // Penanganan error yang lebih detail dari response API
      setError(
        `Gagal menyimpan data Visi dan Misi. Pesan: ${
          err.response?.data?.message || err.message
        }.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaFlag className="text-blue-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">
            Visi dan Misi Yayasan BINA ESSA
          </h2>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors duration-200 flex items-center gap-2"
          >
            <FaEdit size={14} /> Edit Visi & Misi
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded flex items-center gap-1 transition-colors"
              disabled={loading}
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <FaSave size={12} /> Simpan
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-blue-500 mb-4">Memuat data...</p>}
      {error && (
        <p className="text-red-500 mb-4 p-3 bg-red-50 rounded border border-red-200">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visi Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaEye className="text-blue-600" size={16} />
            <h3 className="text-lg font-semibold text-blue-800">VISI</h3>
          </div>
          {isEditing ? (
            <textarea
              value={editedData.visi}
              onChange={(e) => handleInputChange("visi", e.target.value)}
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="6"
              placeholder="Masukkan visi lembaga..."
            />
          ) : (
            <div className="bg-white p-4 rounded border">
              {data?.visi ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {data.visi}
                </p>
              ) : (
                <p className="text-gray-400 italic">Visi belum diisi</p>
              )}
            </div>
          )}
        </div>

        {/* Misi Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaFlag className="text-green-600" size={16} />
            <h3 className="text-lg font-semibold text-green-800">MISI</h3>
          </div>
          {isEditing ? (
            <textarea
              value={editedData.misi}
              onChange={(e) => handleInputChange("misi", e.target.value)}
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="6"
              placeholder="Masukkan misi lembaga..."
            />
          ) : (
            <div className="bg-white p-4 rounded border">
              {data?.misi ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {data.misi}
                </p>
              ) : (
                <p className="text-gray-400 italic">Misi belum diisi</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <FaInfo className="text-yellow-600 mt-0.5" size={14} />
          <div>
            <p className="text-sm text-yellow-800 font-medium">
              Informasi Penting:
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Visi dan Misi yang diatur di sini akan berlaku untuk semua lembaga
              (LKP BINA ESSA, LPK BINA ESSA, dan Yayasan BINA ESSA). Perubahan
              akan otomatis tersinkronisasi ke seluruh platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen TableSection (Tidak Berubah) ---
const TableSection = ({ title, apiEndpoint, data, setData }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState(null);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    file: null,
  });

  useEffect(() => {
    const fetchTableData = async () => {
      setLoadingAction(true);
      setActionError(null);
      try {
        const response = await fetchData(apiEndpoint);
        let items = [];
        if (response && response.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response && Array.isArray(response.data)) {
          items = response.data;
        } else if (response && Array.isArray(response)) {
          items = response;
        } else {
          console.warn(
            `No data or unexpected response format for ${title}:`,
            response
          );
          setData([]);
          return;
        }

        setData(
          items.map((item) => ({
            ...item,
            name: title === "Slideshow" ? item.nama_slide : item.nama_banner,
            filename: item.url_gambar || item.gambar || null,
          }))
        );
      } catch (err) {
        console.error(`Failed to load ${title} data:`, err);
        setActionError(`Failed to load ${title} data.`);
      } finally {
        setLoadingAction(false);
      }
    };
    fetchTableData();
  }, [apiEndpoint, setData, title]);

  const filteredData = data.filter((item) =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetail = (item) => {
    setSelectedItem({ ...item });
    setEditedItem({ ...item });
    setShowDetail(true);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${title.toLowerCase()}?`
      )
    ) {
      setLoadingAction(true);
      setActionError(null);
      try {
        await deleteData(apiEndpoint, id);
        setData(data.filter((item) => item.id !== id));
        setShowDetail(false);
        alert(`${title} deleted successfully!`);
      } catch (err) {
        console.error(`Failed to delete ${title}:`, err);
        setActionError(
          `Failed to delete ${title}. Error: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedItem({ ...selectedItem });
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleSaveEdit = async () => {
    setLoadingAction(true);
    setActionError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");

      if (title === "Slideshow") {
        formDataToSend.append("nama_slide", editedItem.name || "");
      } else if (title === "Banner") {
        formDataToSend.append("nama_banner", editedItem.name || "");
      }

      if (selectedFile) {
        formDataToSend.append("gambar", selectedFile);
      } else if (editedItem.filename === null || editedItem.filename === "") {
        formDataToSend.append("remove_gambar", true);
      }

      const response = await updateData(
        apiEndpoint,
        selectedItem.id,
        formDataToSend
      );

      const updatedItem = response.data.data || response.data;

      setData(
        data.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                ...updatedItem,
                name:
                  title === "Slideshow"
                    ? updatedItem.nama_slide
                    : updatedItem.nama_banner,
                filename:
                  updatedItem.url_gambar || updatedItem.gambar || item.filename,
              }
            : item
        )
      );

      setSelectedItem((prev) => ({
        ...prev,
        ...updatedItem,
        name:
          title === "Slideshow"
            ? updatedItem.nama_slide
            : updatedItem.nama_banner,
        filename: updatedItem.url_gambar || updatedItem.gambar || prev.filename,
      }));

      setIsEditing(false);
      setSelectedFile(null);
      alert(`${title} updated successfully!`);
    } catch (err) {
      console.error(`Failed to update ${title}:`, err);
      setActionError(
        `Failed to update ${title}. Error: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedItem({ ...editedItem, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (showForm) {
        setForm({ ...form, file: file });
      }
      if (isEditing) {
        setEditedItem((prev) => ({
          ...prev,
          filename: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmitNew = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setActionError(null);

    if (!form.file) {
      setActionError("Please select a file first.");
      setLoadingAction(false);
      return;
    }
    if (!form.name.trim()) {
      setActionError("Name cannot be empty.");
      setLoadingAction(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("gambar", form.file);

      if (title === "Slideshow") {
        formDataToSend.append("nama_slide", form.name);
      } else if (title === "Banner") {
        formDataToSend.append("nama_banner", form.name);
      }

      const response = await createData(apiEndpoint, formDataToSend);
      const newItem = response.data.data || response.data;

      setData([
        ...data,
        {
          ...newItem,
          name:
            title === "Slideshow" ? newItem.nama_slide : newItem.nama_banner,
          filename: newItem.url_gambar || newItem.gambar,
        },
      ]);
      setForm({
        name: "",
        file: null,
      });
      setSelectedFile(null);
      setShowForm(false);
      alert(`${title} added successfully!`);
    } catch (err) {
      console.error(`Failed to add ${title}:`, err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join("; ");
        setActionError(`Failed to add ${title}. Errors: ${errorMessages}`);
      } else {
        setActionError(`Failed to add ${title}. Error: ${err.message}`);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors duration-200 flex items-center gap-1"
        >
          <FaPlus size={12} /> Tambah
        </button>
      </div>

      {loadingAction && <p className="text-blue-500 mb-2">Processing...</p>}
      {actionError && <p className="text-red-500 mb-2">{actionError}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Nama {title}</th>
              <th className="px-4 py-2 text-center">More</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDetail(item)}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Form Tambah Data dengan File Upload - LENGKAP */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold">Tambah {title}</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setActionError(null);
                  setSelectedFile(null);
                  setForm({ name: "", file: null });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
            {actionError && (
              <p className="text-red-500 text-xs mb-2">{actionError}</p>
            )}

            <div className="max-h-80 overflow-y-auto pr-1">
              <form onSubmit={handleSubmitNew} className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500">
                    Nama {title}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-1 border rounded mt-0.5 text-xs"
                    required
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id={`file-upload-${title}`}
                    accept=".png,.jpg,.jpeg,.gif"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor={`file-upload-${title}`}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaUpload className="text-gray-400" size={20} />
                      <span className="text-sm text-gray-500">
                        {selectedFile
                          ? selectedFile.name
                          : `Pilih file untuk ${title.toLowerCase()}`}
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG, JPEG, atau GIF
                      </span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setActionError(null);
                  setSelectedFile(null);
                  setForm({ name: "", file: null });
                }}
                className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                disabled={loadingAction}
              >
                {loadingAction ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal - LENGKAP */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold">Detail {title}</h3>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setActionError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
            {actionError && (
              <p className="text-red-500 text-xs mb-2">{actionError}</p>
            )}

            <div className="space-y-2 mb-3 max-h-72 overflow-y-auto pr-1">
              {/* Image Preview */}
              <div className="flex flex-col items-center mb-4">
                <p className="text-xs text-gray-500 mb-1">Gambar</p>
                {editedItem.filename ? (
                  <img
                    src={editedItem.filename}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x100?text=No+Image";
                    }}
                    alt="Preview"
                    className="w-24 h-24 object-contain mb-2 border rounded"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <FaImage className="text-gray-400" size={30} />
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Nama {title}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedItem.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-1 border rounded mt-0.5 text-xs"
                  />
                ) : (
                  <p className="font-medium text-sm">{selectedItem.name}</p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-xs text-gray-500">
                    Ganti File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id={`edit-file-upload-${title}`}
                      accept=".png,.jpg,.jpeg,.gif"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor={`edit-file-upload-${title}`}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <FaUpload className="text-gray-400" size={16} />
                        <span className="text-xs text-gray-500">
                          {selectedFile ? selectedFile.name : "Pilih file baru"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {selectedItem.created_at && (
                <div>
                  <p className="text-xs text-gray-500">Tanggal Upload</p>
                  <p className="font-medium text-sm">
                    {new Date(selectedItem.created_at).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>
                </div>
              )}

              {selectedItem.updated_at && (
                <div>
                  <p className="text-xs text-gray-500">Terakhir Diubah</p>
                  <p className="font-medium text-sm">
                    {new Date(selectedItem.updated_at).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-xs"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 text-xs"
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <FaSave size={12} /> Simpan
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 text-xs"
                  >
                    <FaTrashAlt size={12} /> Hapus
                  </button>
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 text-xs"
                  >
                    <FaEdit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      setActionError(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-xs"
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
  );
};

// --- Komponen BeritaSection (Tidak Berubah) ---
const BeritaSection = ({ apiEndpoint, data, setData }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState(null);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    date: "",
    gambar: null,
  });

  useEffect(() => {
    const fetchBeritaData = async () => {
      setLoadingAction(true);
      setActionError(null);
      try {
        const response = await fetchData(apiEndpoint);
        let fetchedDataArray = [];
        if (response && Array.isArray(response.data)) {
          fetchedDataArray = response.data;
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          fetchedDataArray = response.data.data;
        } else {
          console.warn(`Unexpected data format for Berita:`, response);
          fetchedDataArray = [];
        }

        setData(
          fetchedDataArray.map((item) => ({
            ...item,
            judul: item.title || "",
            date: item.date || "",
            gambar: item.gambar
              ? `http://127.0.0.1:8000/storage/${item.gambar}`
              : null,
          }))
        );
      } catch (err) {
        console.error("Failed to load Berita data:", err);
        setActionError("Failed to load Berita data.");
      } finally {
        setLoadingAction(false);
      }
    };
    fetchBeritaData();
  }, [apiEndpoint, setData]);

  const filteredData = data.filter(
    (item) =>
      (item.judul || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.deskripsi || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetail = (item) => {
    setSelectedItem({ ...item });
    setEditedItem({ ...item });
    setShowDetail(true);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      setLoadingAction(true);
      setActionError(null);
      try {
        await deleteData(apiEndpoint, id);
        setData(data.filter((item) => item.id !== id));
        setShowDetail(false);
        alert("News item deleted successfully!");
      } catch (err) {
        console.error("Failed to delete news item:", err);
        setActionError(
          `Failed to delete news item. Error: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedItem({ ...selectedItem });
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleSaveEdit = async () => {
    const pubDate = new Date(editedItem.date);
    pubDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (pubDate < today) {
      setActionError("Tanggal publikasi tidak boleh di masa lalu.");
      return;
    }
    setLoadingAction(true);
    setActionError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("title", editedItem.judul || "");
      formDataToSend.append("deskripsi", editedItem.deskripsi || "");
      formDataToSend.append("date", editedItem.date || "");

      if (selectedFile) {
        formDataToSend.append("gambar", selectedFile);
      } else if (editedItem.gambar === null && selectedItem.gambar) {
        formDataToSend.append("remove_gambar", true);
      }

      const response = await updateData(
        apiEndpoint,
        selectedItem.id,
        formDataToSend
      );
      const updatedItem = response.data || {};

      const updatedGambarUrl = updatedItem.gambar
        ? `http://localhost:8000/storage/berita_gambar/${updatedItem.gambar}`
        : null;

      setData(
        data.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                judul: updatedItem.title || item.judul || "",
                deskripsi: updatedItem.deskripsi || item.deskripsi || "",
                date: updatedItem.date || item.date || "",
                gambar: updatedGambarUrl,
              }
            : item
        )
      );

      setSelectedItem((prev) => ({
        ...prev,
        judul: updatedItem.title || prev.judul || "",
        deskripsi: updatedItem.deskripsi || prev.deskripsi || "",
        date: updatedItem.date || prev.date || "",
        gambar: updatedGambarUrl,
      }));
      setIsEditing(false);
      setSelectedFile(null);
      alert("News item updated successfully!");
    } catch (err) {
      console.error("Failed to update news item:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join("; ");
        setActionError(`Failed to update news item. Errors: ${errorMessages}`);
      } else {
        setActionError(`Failed to update news item. Error: ${err.message}`);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedItem({ ...editedItem, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (showForm) {
        setForm({ ...form, gambar: file });
      } else if (isEditing) {
        setEditedItem((prev) => ({
          ...prev,
          gambar: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmitNew = async () => {
    const pubDate = new Date(form.date);
    pubDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (pubDate < today) {
      setActionError("Tanggal publikasi tidak boleh di masa lalu.");
      return;
    }
    setLoadingAction(true);
    setActionError(null);

    if (!form.gambar) {
      setActionError("Please select a news image first.");
      setLoadingAction(false);
      return;
    }
    if (!form.judul.trim() || !form.deskripsi.trim() || !form.date.trim()) {
      setActionError("Title, description, and date cannot be empty.");
      setLoadingAction(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", form.judul);
      formDataToSend.append("deskripsi", form.deskripsi);
      formDataToSend.append("date", form.date);
      formDataToSend.append("gambar", form.gambar);

      const response = await createData(apiEndpoint, formDataToSend);
      const newItem = response.data || {};

      const newGambarUrl = newItem.gambar
        ? `http://localhost:8000/storage/${newItem.gambar}`
        : null;

      setData((prevData) => [
        ...prevData,
        {
          ...newItem,
          judul: newItem.title || "",
          gambar: newGambarUrl,
        },
      ]);
      setForm({
        judul: "",
        deskripsi: "",
        date: "",
        gambar: null,
      });
      setSelectedFile(null);
      setShowForm(false);
      alert("News item added successfully!");
    } catch (err) {
      console.error("Failed to add news item:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join("; ");
        setActionError(`Failed to add news item. Errors: ${errorMessages}`);
      } else {
        setActionError(`Failed to add news item. Error: ${err.message}`);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Berita</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors duration-200 flex items-center gap-1"
        >
          <FaPlus size={12} /> Tambah Berita
        </button>
      </div>

      {loadingAction && <p className="text-blue-500 mb-2">Processing...</p>}
      {actionError && <p className="text-red-500 mb-2">{actionError}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Judul Berita</th>
              <th className="px-4 py-2">Tanggal Upload</th>
              <th className="px-4 py-2 text-center">More</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">
                  <div>
                    <p className="font-medium">{item.judul}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.deskripsi
                        ? item.deskripsi.substring(0, 80) + "..."
                        : ""}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaCalendarAlt size={12} />
                    {item.date
                      ? new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDetail(item)}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Form Tambah Berita - LENGKAP */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Tambah Berita Baru</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setActionError(null);
                  setSelectedFile(null);
                  setForm({ judul: "", deskripsi: "", date: "", gambar: null });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
            {actionError && (
              <p className="text-red-500 text-xs mb-2">{actionError}</p>
            )}

            <div className="max-h-96 overflow-y-auto pr-1">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Berita
                  </label>
                  <input
                    type="text"
                    value={form.judul}
                    onChange={(e) =>
                      setForm({ ...form, judul: e.target.value })
                    }
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Masukkan judul berita"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={form.deskripsi}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                    className="w-full p-2 border rounded text-sm"
                    rows="4"
                    placeholder="Masukkan deskripsi berita"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Berita
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Berita
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="berita-file-upload"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="berita-file-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaUpload className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-500">
                          {selectedFile
                            ? selectedFile.name
                            : "Pilih gambar berita"}
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG atau JPG
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setActionError(null);
                  setSelectedFile(null);
                  setForm({ judul: "", deskripsi: "", date: "", gambar: null });
                }}
                className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                disabled={loadingAction}
              >
                {loadingAction ? "Menyimpan..." : "Simpan Berita"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal Berita - LENGKAP */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Detail Berita</h3>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setActionError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
            {actionError && (
              <p className="text-red-500 text-xs mb-2">{actionError}</p>
            )}

            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
              {/* Image Preview */}
              <div className="flex flex-col items-center mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Gambar Berita
                </p>
                {editedItem.gambar ? (
                  <img
                    src={editedItem.gambar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/128x128/e0e0e0/888888?text=No+Image";
                    }}
                    alt="Gambar Berita Preview"
                    className="w-32 h-32 object-contain mb-2 border rounded"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <FaImage className="text-gray-400" size={40} />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Judul Berita
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedItem.judul || ""}
                    onChange={(e) => handleInputChange("judul", e.target.value)}
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                ) : (
                  <p className="font-medium text-sm mt-1">
                    {selectedItem.judul}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Deskripsi</p>
                {isEditing ? (
                  <textarea
                    value={editedItem.deskripsi || ""}
                    onChange={(e) =>
                      handleInputChange("deskripsi", e.target.value)
                    }
                    className="w-full p-2 border rounded mt-1 text-sm"
                    rows="4"
                  />
                ) : (
                  <p className="text-sm mt-1 text-gray-600">
                    {selectedItem.deskripsi}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Tanggal Berita
                </p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedItem.date || ""}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                ) : (
                  <p className="text-sm mt-1">
                    {selectedItem.date
                      ? new Date(selectedItem.date).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "N/A"}
                  </p>
                )}
              </div>

              {isEditing && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Ganti Gambar
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-2">
                    <input
                      type="file"
                      id="edit-berita-file-upload"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-berita-file-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <FaUpload className="text-gray-400" size={16} />
                        <span className="text-xs text-gray-500">
                          {selectedFile
                            ? selectedFile.name
                            : "Pilih gambar baru"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Tanggal Upload
                  </p>
                  <p className="text-sm mt-1">
                    {selectedItem.created_at
                      ? new Date(selectedItem.created_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Terakhir Diubah
                  </p>
                  <p className="text-sm mt-1">
                    {selectedItem.updated_at
                      ? new Date(selectedItem.updated_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
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
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <FaSave size={12} /> Simpan
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
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
                    onClick={() => {
                      setShowDetail(false);
                      setActionError(null);
                    }}
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
  );
};

// --- Komponen GaleriSection (Tidak Berubah) ---
const GaleriSection = ({ apiEndpoint, data, setData }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState(null);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    judulFoto: "",
    fileFoto: null,
  });

  useEffect(() => {
    const fetchGaleriData = async () => {
      setLoadingAction(true);
      setActionError(null);
      try {
        const response = await fetchData(apiEndpoint);
        let items = [];
        if (response && response.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response && Array.isArray(response.data)) {
          items = response.data;
        } else if (response && Array.isArray(response)) {
          items = response;
        } else {
          console.warn(
            `No data or unexpected response format for Galeri:`,
            response
          );
          setData([]);
          return;
        }

        setData(
          items.map((item) => ({
            ...item,
            file_foto: item.file_foto
              ? `http://localhost:8000/storage/${item.file_foto}`
              : null,
            judulFoto: item.judul_foto || item.judulFoto,
          }))
        );
      } catch (err) {
        console.error("Failed to load Galeri data:", err);
        setActionError("Failed to load Galeri data.");
      } finally {
        setLoadingAction(false);
      }
    };
    fetchGaleriData();
  }, [apiEndpoint, setData]);

  const filteredData = data.filter((item) =>
    (item.judulFoto || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetail = (item) => {
    setSelectedItem({ ...item });
    setEditedItem({ ...item });
    setShowDetail(true);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      setLoadingAction(true);
      setActionError(null);
      try {
        await deleteData(apiEndpoint, id);
        setData(data.filter((item) => item.id !== id));
        setShowDetail(false);
        alert("Gallery item deleted successfully!");
      } catch (err) {
        console.error("Failed to delete gallery item:", err);
        setActionError(
          `Failed to delete gallery item. Error: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedItem({ ...selectedItem });
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleSaveEdit = async () => {
    setLoadingAction(true);
    setActionError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("judul_foto", editedItem.judulFoto || "");

      if (selectedFile) {
        formDataToSend.append("file_foto", selectedFile);
      }

      const response = await updateData(
        apiEndpoint,
        selectedItem.id,
        formDataToSend
      );
      const updatedItem = response.data.data || response.data;

      setData(
        data.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                ...updatedItem,
                judulFoto: updatedItem.judul_foto || item.judulFoto,
                file_foto: updatedItem.file_foto
                  ? `http://localhost:8000/storage/${updatedItem.file_foto}`
                  : null,
              }
            : item
        )
      );
      setSelectedItem((prev) => ({
        ...prev,
        ...updatedItem,
        judulFoto: updatedItem.judul_foto || prev.judulFoto,
        file_foto: updatedItem.file_foto
          ? `http://localhost:8000/storage/${updatedItem.file_foto}`
          : null,
      }));
      setIsEditing(false);
      setSelectedFile(null);
      alert("Gallery item updated successfully!");
    } catch (err) {
      console.error("Failed to update gallery item:", err);
      setActionError(
        `Failed to update gallery item. Error: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedItem({ ...editedItem, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (showForm) {
        setForm({ ...form, fileFoto: file });
      }
      if (isEditing) {
        setEditedItem((prev) => ({
          ...prev,
          file_foto: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmitNew = async () => {
    setLoadingAction(true);
    setActionError(null);

    if (!form.fileFoto) {
      setActionError("Please select a photo file first.");
      setLoadingAction(false);
      return;
    }
    if (!form.judulFoto.trim()) {
      setActionError("Photo title cannot be empty.");
      setLoadingAction(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("judul_foto", form.judulFoto);
      formDataToSend.append("file_foto", form.fileFoto);

      const response = await createData(apiEndpoint, formDataToSend);
      const newItem = response.data.data || response.data;

      setData([
        ...data,
        {
          ...newItem,
          judulFoto: newItem.judul_foto || newItem.judulFoto,
          file_foto: newItem.file_foto
            ? `http://localhost:8000/storage/${newItem.file_foto}`
            : null,
        },
      ]);
      setForm({
        judulFoto: "",
        fileFoto: null,
      });
      setSelectedFile(null);
      setShowForm(false);
      alert("Photo added successfully!");
    } catch (err) {
      console.error("Failed to add photo:", err);
      setActionError(
        `Failed to add photo. Error: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Galeri Foto</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors duration-200 flex items-center gap-1"
        >
          <FaPlus size={12} /> Tambah Foto
        </button>
      </div>

      {loadingAction && <p className="text-blue-500 mb-2">Processing...</p>}
      {actionError && <p className="text-red-500 mb-2">{actionError}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 w-16">No</th>
              <th className="px-4 py-2">Judul Foto</th>
              <th className="px-4 py-2">File Foto</th>
              <th className="px-4 py-2">Tanggal Upload</th>
              <th className="px-4 py-2 text-center">More</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{startIndex + idx + 1}</td>
                <td className="px-4 py-2">
                  <p className="font-medium">{item.judulFoto}</p>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <FaImage className="text-gray-400" size={14} />
                    <span>
                      {item.file_foto ? item.file_foto.split("/").pop() : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaCalendarAlt size={12} />
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDetail(item)}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Form Tambah Foto Galeri - LENGKAP */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Tambah Foto Galeri</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setActionError(null);
                  setSelectedFile(null);
                  setForm({ judulFoto: "", fileFoto: null });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
            {actionError && (
              <p className="text-red-500 text-xs mb-2">{actionError}</p>
            )}

            <div className="max-h-96 overflow-y-auto pr-1">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Foto
                  </label>
                  <input
                    type="text"
                    value={form.judulFoto}
                    onChange={(e) =>
                      setForm({ ...form, judulFoto: e.target.value })
                    }
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Masukkan judul foto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Foto
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="galeri-file-upload"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="galeri-file-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaUpload className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-500">
                          {selectedFile ? selectedFile.name : "Pilih foto"}
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG atau JPG
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setActionError(null);
                  setSelectedFile(null);
                  setForm({ judulFoto: "", fileFoto: null });
                }}
                className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                disabled={loadingAction}
              >
                {loadingAction ? "Menyimpan..." : "Simpan Foto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal Galeri - LENGKAP */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Detail Foto Galeri</h3>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setActionError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
            {actionError && (
              <p className="text-red-500 text-xs mb-2">{actionError}</p>
            )}

            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
              {/* Image Preview */}
              <div className="flex flex-col items-center mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Preview Foto
                </p>
                {editedItem.file_foto ? (
                  <img
                    src={editedItem.file_foto}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/128x128/e0e0e0/888888?text=No+Image";
                    }}
                    alt="Foto Galeri Preview"
                    className="w-32 h-32 object-contain mb-2 border rounded"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <FaImage className="text-gray-400" size={40} />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Judul Foto</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedItem.judulFoto || ""}
                    onChange={(e) =>
                      handleInputChange("judulFoto", e.target.value)
                    }
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                ) : (
                  <p className="font-medium text-sm mt-1">
                    {selectedItem.judulFoto}
                  </p>
                )}
              </div>

              {isEditing && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Ganti File Foto
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-2">
                    <input
                      type="file"
                      id="edit-galeri-file-upload"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-galeri-file-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <FaUpload className="text-gray-400" size={16} />
                        <span className="text-xs text-gray-500">
                          {selectedFile ? selectedFile.name : "Pilih file baru"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Tanggal Upload
                  </p>
                  <p className="text-sm mt-1">
                    {selectedItem.created_at
                      ? new Date(selectedItem.created_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Terakhir Diubah
                  </p>
                  <p className="text-sm mt-1">
                    {selectedItem.updated_at
                      ? new Date(selectedItem.updated_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
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
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <FaSave size={12} /> Simpan
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
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
                    onClick={() => {
                      setShowDetail(false);
                      setActionError(null);
                    }}
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
  );
};

// --- Komponen InformasiKontakEditor (Tidak Berubah) ---
const InformasiKontakEditor = ({
  data,
  setData,
  apiEndpoint,
  kontakId,
  setKontakId,
  onSaveSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    namaOrganisasi: data?.namaOrganisasi || "BINA ESSA",
    alamat: data?.alamat || "",
    email: data?.email || "",
    telepon: data?.telepon || "",
    whatsapp: data?.whatsapp || "",
    instagram: data?.instagram || "",
    resources: data?.resources || [
      { name: "Publikasi", url: "#" },
      { name: "Pelayanan Publik", url: "#" },
      { name: "FAQ", url: "#" },
      { name: "Hubungi Kami", url: "#" },
    ],
    socialMedia: data?.socialMedia || [
      { platform: "Facebook", url: "", icon: "facebook" },
      { platform: "Twitter", url: "", icon: "twitter" },
      { platform: "Instagram", url: "", icon: "instagram" },
      { platform: "YouTube", url: "", icon: "youtube" },
      { platform: "TikTok", url: "", icon: "tiktok" },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("organisasi");

  useEffect(() => {
    setEditedData({
      namaOrganisasi: data?.namaOrganisasi || "BINA ESSA",
      alamat: data?.alamat || "",
      email: data?.email || "",
      telepon: data?.telepon || "",
      whatsapp: data?.whatsapp || "",
      instagram: data?.instagram || "",
      resources: data?.resources || [
        { name: "Publikasi", url: "#" },
        { name: "Pelayanan Publik", url: "#" },
        { name: "FAQ", url: "#" },
        { name: "Hubungi Kami", url: "#" },
      ],
      socialMedia: data?.socialMedia || [
        { platform: "Facebook", url: "", icon: "facebook" },
        { platform: "Twitter", url: "", icon: "twitter" },
        { platform: "Instagram", url: "", icon: "instagram" },
        { platform: "YouTube", url: "", icon: "youtube" },
        { platform: "TikTok", url: "", icon: "tiktok" },
      ],
    });
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData({
      namaOrganisasi: data?.namaOrganisasi || "BINA ESSA",
      alamat: data?.alamat || "",
      email: data?.email || "",
      telepon: data?.telepon || "",
      whatsapp: data?.whatsapp || "",
      instagram: data?.instagram || "",
      resources: data?.resources || [
        { name: "Publikasi", url: "#" },
        { name: "Pelayanan Publik", url: "#" },
        { name: "FAQ", url: "#" },
        { name: "Hubungi Kami", url: "#" },
      ],
      socialMedia: data?.socialMedia || [
        { platform: "Facebook", url: "", icon: "facebook" },
        { platform: "Twitter", url: "", icon: "twitter" },
        { platform: "Instagram", url: "", icon: "instagram" },
        { platform: "YouTube", url: "", icon: "youtube" },
        { platform: "TikTok", url: "", icon: "tiktok" },
      ],
    });
    setIsEditing(false);
    setError(null);
  };
  const validatePhoneNumber = (number) => {
    return /^[0-9]{8,15}$/.test(number);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    if (!editedData.alamat) {
      setError("Alamat tidak boleh kosong");
      setLoading(false);
      return;
    }

    if (editedData.telepon && !validatePhoneNumber(editedData.telepon)) {
      setError("Nomor telepon harus berupa angka (8-15 digit)");
      setLoading(false);
      return;
    }

    if (editedData.whatsapp && !validatePhoneNumber(editedData.whatsapp)) {
      setError("Nomor WhatsApp harus berupa angka (8-15 digit)");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_organisasi", editedData.namaOrganisasi || "");
      formDataToSend.append("alamat", editedData.alamat);
      formDataToSend.append("email", editedData.email || "");
      formDataToSend.append("telepon", editedData.telepon || "");
      formDataToSend.append("whatsapp", editedData.whatsapp || "");
      formDataToSend.append("instagram", editedData.instagram || "");
      formDataToSend.append("resources", JSON.stringify(editedData.resources));
      formDataToSend.append(
        "social_media",
        JSON.stringify(editedData.socialMedia)
      );

      let response;
      if (kontakId) {
        response = await createData(apiEndpoint, formDataToSend);
      } else {
        response = await createData(apiEndpoint, formDataToSend);
      }
      const apiResponseData = response.data.data
        ? response.data.data
        : response.data;

      setData({
        namaOrganisasi:
          apiResponseData.nama_organisasi || editedData.namaOrganisasi,
        email: apiResponseData.email || editedData.email,
        telepon: apiResponseData.telepon || editedData.telepon,
        whatsapp: apiResponseData.whatsapp || editedData.whatsapp,
        instagram: apiResponseData.instagram || editedData.instagram,
        resources: apiResponseData.resources
          ? JSON.parse(apiResponseData.resources)
          : editedData.resources,
        socialMedia: apiResponseData.social_media
          ? JSON.parse(apiResponseData.social_media)
          : editedData.socialMedia,
        id: apiResponseData.id || kontakId,
      });

      if (!kontakId && apiResponseData.id) {
        setKontakId(apiResponseData.id);
      }

      alert("Informasi Kontak berhasil disimpan!");
      setIsEditing(false);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Failed to save Informasi Kontak data:", err);
      setError(
        `Gagal menyimpan data Informasi Kontak. Pesan: ${
          err.response?.data?.message || err.message
        }.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleResourceChange = (index, field, value) => {
    const newResources = [...editedData.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setEditedData({ ...editedData, resources: newResources });
  };

  const handleSocialMediaChange = (index, field, value) => {
    const newSocialMedia = [...editedData.socialMedia];
    newSocialMedia[index] = { ...newSocialMedia[index], [field]: value };
    setEditedData({ ...editedData, socialMedia: newSocialMedia });
  };

  const addResource = () => {
    setEditedData({
      ...editedData,
      resources: [...editedData.resources, { name: "", url: "" }],
    });
  };

  const removeResource = (index) => {
    const newResources = editedData.resources.filter((_, i) => i !== index);
    setEditedData({ ...editedData, resources: newResources });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaInfo className="text-blue-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">
            Informasi Kontak Footer
          </h2>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors duration-200 flex items-center gap-2"
          >
            <FaEdit size={14} /> Edit Informasi Kontak
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded flex items-center gap-1 transition-colors"
              disabled={loading}
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <FaSave size={12} /> Simpan
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-blue-500 mb-4">Memuat data...</p>}
      {error && (
        <p className="text-red-500 mb-4 p-3 bg-red-50 rounded border border-red-200">
          {error}
        </p>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("organisasi")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "organisasi"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Informasi Organisasi
          </button>
          {/* <button
            onClick={() => setActiveTab("resources")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "resources"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Menu Resources
          </button> */}
          <button
            onClick={() => setActiveTab("social")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "social"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Media Sosial
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "organisasi" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Informasi Organisasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Organisasi
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.namaOrganisasi}
                  onChange={(e) =>
                    handleInputChange("namaOrganisasi", e.target.value)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700 font-semibold">
                  {data?.namaOrganisasi || "BINA ESSA"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              {isEditing ? (
                <textarea
                  value={editedData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="2"
                  required
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{data?.alamat || "Alamat belum diisi"}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="binaessa@example.com"
                />
              ) : (
                <p className="text-gray-700">{data?.email || "Belum diisi"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.telepon}
                  onChange={(e) => handleInputChange("telepon", e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(021) 1234-5678"
                />
              ) : (
                <p className="text-gray-700">
                  {data?.telepon || "Belum diisi"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0812-3456-7890"
                />
              ) : (
                <p className="text-gray-700">
                  {data?.whatsapp || "Belum diisi"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@binaessa"
                />
              ) : (
                <p className="text-gray-700">
                  {data?.instagram || "Belum diisi"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "resources" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Menu Resources
            </h3>
            {isEditing && (
              <button
                onClick={addResource}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <FaPlus size={12} /> Tambah Menu
              </button>
            )}
          </div>
          <div className="space-y-3">
            {editedData.resources.map((resource, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded"
              >
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Nama Menu
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={resource.name}
                      onChange={(e) =>
                        handleResourceChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border rounded text-sm"
                      placeholder="Publikasi"
                    />
                  ) : (
                    <p className="text-gray-700">{resource.name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      URL/Link
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={resource.url}
                        onChange={(e) =>
                          handleResourceChange(index, "url", e.target.value)
                        }
                        className="w-full p-2 border rounded text-sm"
                        placeholder="/publikasi"
                      />
                    ) : (
                      <p className="text-gray-700">{resource.url}</p>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeResource(index)}
                      className="px-2 py-1 text-red-500 hover:bg-red-50 rounded text-sm mt-5"
                    >
                      <FaTrashAlt size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Media Sosial</h3>
          <div className="space-y-3">
            {editedData.socialMedia.map((social, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded"
              >
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Platform
                  </label>
                  <p className="text-gray-700 font-medium">{social.platform}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    URL/Link
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) =>
                        handleSocialMediaChange(index, "url", e.target.value)
                      }
                      className="w-full p-2 border rounded text-sm"
                      placeholder={`https://${social.platform.toLowerCase()}.com/binaessa`}
                    />
                  ) : (
                    <p className="text-gray-700 break-all">
                      {social.url || "Belum diisi"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <FaInfo className="text-blue-600 mt-0.5" size={14} />
          <div>
            <p className="text-sm text-blue-800 font-medium">Informasi:</p>
            <p className="text-sm text-blue-700 mt-1">
              Informasi yang diatur di sini akan tampil di footer website dan
              digunakan untuk kontak organisasi. Pastikan semua informasi sudah
              benar sebelum menyimpan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen TentangKamiEditor (Tidak Berubah) ---
const TentangKamiEditor = ({
  data,
  setData,
  type,
  apiEndpoint,
  aboutId,
  setAboutId,
  onSaveSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData({ ...data });
    setIsEditing(false);
    setSelectedLogo(null);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const formDataToSend = new FormData();
      // formDataToSend.append("_method", "PUT");

      let response;
      if (type === "LKP BINA ESSA") {
        formDataToSend.append("nama_lkp", editedData.title || "");
        formDataToSend.append("deskripsi_lkp", editedData.description || "");
        if (selectedLogo) formDataToSend.append("foto_lkp", selectedLogo);
        formDataToSend.append("id_lembaga", 1);

        response = await createData(apiEndpoint, formDataToSend);
      } else if (type === "LPK BINA ESSA") {
        formDataToSend.append("nama_lpk", editedData.title || "");
        formDataToSend.append("deskripsi_lpk", editedData.description || "");
        if (selectedLogo) formDataToSend.append("foto_lpk", selectedLogo);
        formDataToSend.append("id_lembaga", 1);

        response = await createData(apiEndpoint, formDataToSend);
      } else if (type === "YAYASAN BINA ESSA") {
        formDataToSend.append("nama_yayasan", editedData.title || "");
        formDataToSend.append(
          "deskripsi_yayasan",
          editedData.description || ""
        );
        if (selectedLogo) formDataToSend.append("foto_yayasan", selectedLogo);

        response = await createData(apiEndpoint, formDataToSend);
      } else {
        setData(editedData);
        setIsEditing(false);
        setLoading(false);
        alert(`${type} berhasil disimpan (lokal)!`);
        return;
      }

      const apiResponseData = response.data.data
        ? response.data.data
        : response.data;

      setData((prev) => ({
        ...prev,
        [type]: {
          ...editedData,
          title:
            apiResponseData.nama_lkp ||
            apiResponseData.nama_lpk ||
            apiResponseData.nama_yayasan ||
            editedData.title,
          description:
            apiResponseData.deskripsi_lkp ||
            apiResponseData.deskripsi_lpk ||
            apiResponseData.deskripsi_yayasan ||
            editedData.description,
          logoUrl:
            apiResponseData.foto_lkp ||
            apiResponseData.foto_lpk ||
            apiResponseData.foto_yayasan ||
            editedData.logoUrl,
          id: apiResponseData.id || aboutId,
        },
      }));

      if (!aboutId && apiResponseData.id) {
        setAboutId(apiResponseData.id);
      }

      alert(`${type} berhasil disimpan!`);
      setIsEditing(false);
      setSelectedLogo(null);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error(`Failed to save ${type} data:`, err);
      setError(
        `Gagal menyimpan data ${type}. Pesan: ${
          err.response?.data?.message || err.message
        }.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      setEditedData({ ...editedData, logoUrl: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{type}</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors duration-200 flex items-center gap-1"
          >
            <FaEdit size={12} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-green-500 text-white hover:bg-green-600 rounded flex items-center gap-1"
              disabled={loading}
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <FaSave size={12} /> Simpan
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-blue-500 mb-2">Memuat data...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="text-lg font-semibold">{data.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            {isEditing ? (
              <textarea
                value={editedData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full p-2 border rounded"
                rows="6"
              />
            ) : (
              <p className="text-sm text-gray-600">{data.description}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          <div className="border rounded p-4 flex flex-col items-center justify-center">
            {isEditing ? (
              <div className="w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-2">
                  <input
                    type="file"
                    id={`logo-upload-${type}`}
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor={`logo-upload-${type}`}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaUpload className="text-gray-400" size={20} />
                      <span className="text-sm text-gray-500">
                        {selectedLogo ? selectedLogo.name : "Pilih file logo"}
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG, atau SVG
                      </span>
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Logo saat ini:</span>
                  <span className="text-sm font-medium">
                    {editedData.logoUrl || "Tidak ada file dipilih"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {data.logoUrl ? (
                  <img
                    src={`http://localhost:8000/storage/images/${data.logoUrl}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/128x128/e0e0e0/888888?text=No+Image";
                    }}
                    alt="Logo"
                    className="w-32 h-32 object-contain mx-auto mb-2"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <FaImage className="text-gray-400" size={40} />
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {data.logoUrl || "Tidak ada logo"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen utama untuk Kelola Informasi - Modifikasi untuk Integrasi API Visi Misi
const AdminKontenpage = () => {
  const [slideshowData, setSlideshowData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [beritaData, setBeritaData] = useState([]);
  const [galeriData, setGaleriData] = useState([]);

  // State untuk Visi Misi
  const [visiMisiData, setVisiMisiData] = useState({ visi: "", misi: "" });
  const [visiMisiId, setVisiMisiId] = useState(null);
  const [loadingVisiMisi, setLoadingVisiMisi] = useState(true);

  // State untuk Informasi Kontak (FITUR BARU)
  const [informasiKontakData, setInformasiKontakData] = useState({
    namaOrganisasi: "BINA ESSA",
    email: "",
    telepon: "",
    whatsapp: "",
    instagram: "",
    resources: [],
    socialMedia: [],
  });
  const [kontakId, setKontakId] = useState(null);
  const [loadingKontak, setLoadingKontak] = useState(true);

  const dataTentangKamiStrukturAwal = {
    "LKP BINA ESSA": { title: "", logoUrl: "", description: "", id: null },
    "LPK BINA ESSA": { title: "", logoUrl: "", description: "", id: null },
    "YAYASAN BINA ESSA": { title: "", logoUrl: "", description: "", id: null },
  };
  const [tentangKamiData, setTentangKamiData] = useState(
    dataTentangKamiStrukturAwal
  );
  const [loadingTentangKami, setLoadingTentangKami] = useState(true);

  const [lkpId, setLkpId] = useState(null);
  const [lpkId, setLpkId] = useState(null);
  const [yayasanId, setYayasanId] = useState(null);

  const [activeSection, setActiveSection] = useState(null);
  const [activeTentangKami, setActiveTentangKami] = useState(null);

  // Fungsi untuk fetch data Visi Misi (Implementasi API)
  const fetchVisiMisiData = async () => {
    setLoadingVisiMisi(true);
    try {
      // Menggunakan apiEndpoints.visiMisi yang diasumsikan ada
      const response = await fetchData(
        apiEndpoints.visiMisi || "/api/informasi-lembaga"
      ); // Default fallback jika apiEndpoints.visiMisi belum ada
      if (response && response.data) {
        // Asumsi API mengembalikan objek tunggal atau array dengan satu objek
        const apiItem = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (apiItem && apiItem.id) {
          // Pastikan ada ID untuk mengidentifikasi record
          setVisiMisiData({
            visi: apiItem.visi || "",
            misi: apiItem.misi || "",
            id: apiItem.id, // Simpan ID
          });
          setVisiMisiId(apiItem.id); // Set ID ke state
        } else {
          // Jika API mengembalikan data tapi tanpa ID atau tidak terstruktur, inisialisasi kosong
          setVisiMisiData({ visi: "", misi: "" });
          setVisiMisiId(null);
        }
      } else {
        // Jika tidak ada data atau response tidak valid
        setVisiMisiData({ visi: "", misi: "" });
        setVisiMisiId(null);
      }
    } catch (error) {
      console.error("Error fetching Visi Misi data:", error);
      setError("Gagal memuat Visi dan Misi. Coba refresh halaman."); // Set error state jika ada masalah
      setVisiMisiData({ visi: "", misi: "" });
      setVisiMisiId(null);
    } finally {
      setLoadingVisiMisi(false);
    }
  };

  // Fungsi untuk fetch data Informasi Kontak (Tidak Berubah)
  const fetchInformasiKontakData = async () => {
    setLoadingKontak(true);
    try {
      const response = await fetchData(
        apiEndpoints.informasiKontak || "/api/informasi-kontak"
      );
      if (response && response.data) {
        const apiItem = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (apiItem && apiItem.id) {
          setInformasiKontakData({
            namaOrganisasi: apiItem.nama_organisasi || "BINA ESSA",
            alamat: apiItem.alamat || "",
            email: apiItem.email || "",
            telepon: apiItem.telepon || "",
            whatsapp: apiItem.whatsapp || "",
            instagram: apiItem.instagram || "",
            resources: apiItem.resources
              ? JSON.parse(apiItem.resources)
              : [
                  { name: "Publikasi", url: "#" },
                  { name: "Pelayanan Publik", url: "#" },
                  { name: "FAQ", url: "#" },
                  { name: "Hubungi Kami", url: "#" },
                ],
            socialMedia: apiItem.social_media
              ? JSON.parse(apiItem.social_media)
              : [
                  { platform: "Facebook", url: "", icon: "facebook" },
                  { platform: "Twitter", url: "", icon: "twitter" },
                  { platform: "Instagram", url: "", icon: "instagram" },
                  { platform: "YouTube", url: "", icon: "youtube" },
                  { platform: "TikTok", url: "", icon: "tiktok" },
                ],
            id: apiItem.id,
          });
          setKontakId(apiItem.id);
        }
      }
    } catch (error) {
      console.error("Error fetching Informasi Kontak data:", error);
      setInformasiKontakData({
        namaOrganisasi: "BINA ESSA",
        alamat: "",
        email: "",
        telepon: "",
        whatsapp: "",
        instagram: "",
        resources: [
          { name: "Publikasi", url: "#" },
          { name: "Pelayanan Publik", url: "#" },
          { name: "FAQ", url: "#" },
          { name: "Hubungi Kami", url: "#" },
        ],
        socialMedia: [
          { platform: "Facebook", url: "", icon: "facebook" },
          { platform: "Twitter", url: "", icon: "twitter" },
          { platform: "Instagram", url: "", icon: "instagram" },
          { platform: "YouTube", url: "", icon: "youtube" },
          { platform: "TikTok", url: "", icon: "tiktok" },
        ],
      });
      setKontakId(null);
    } finally {
      setLoadingKontak(false);
    }
  };

  const fetchAllTentangKamiData = async () => {
    setLoadingTentangKami(true);
    const newTentangKamiData = { ...dataTentangKamiStrukturAwal };
    let fetchedLkpId = null;
    let fetchedLpkId = null;
    let fetchedYayasanId = null;

    try {
      const lkpResponse = await fetchData(apiEndpoints.lkp);
      if (lkpResponse && lkpResponse.data) {
        const apiItem = Array.isArray(lkpResponse.data)
          ? lkpResponse.data[0]
          : lkpResponse.data;
        if (apiItem && apiItem.id) {
          newTentangKamiData["LKP BINA ESSA"] = {
            title: apiItem.nama_lkp || "",
            logoUrl: apiItem.foto_lkp || apiItem.url_foto_lkp || "",
            description: apiItem.deskripsi_lkp || "",
            id: apiItem.id,
          };
          fetchedLkpId = apiItem.id;
        }
      }

      const lpkResponse = await fetchData(apiEndpoints.lpk);
      if (lpkResponse && lpkResponse.data) {
        const apiItem = Array.isArray(lpkResponse.data)
          ? lpkResponse.data[0]
          : lpkResponse.data;
        if (apiItem && apiItem.id) {
          newTentangKamiData["LPK BINA ESSA"] = {
            title: apiItem.nama_lpk || "",
            logoUrl: apiItem.foto_lpk || apiItem.url_foto_lpk || "",
            description: apiItem.deskripsi_lpk || "",
            id: apiItem.id,
          };
          fetchedLpkId = apiItem.id;
        }
      }

      const yayasanResponse = await fetchData(apiEndpoints.yayasan);
      if (yayasanResponse && yayasanResponse.data) {
        const apiItem = Array.isArray(yayasanResponse.data)
          ? yayasanResponse.data[0]
          : yayasanResponse.data;
        if (apiItem && apiItem.id) {
          newTentangKamiData["YAYASAN BINA ESSA"] = {
            title: apiItem.nama_yayasan || "",
            logoUrl: apiItem.foto_yayasan || apiItem.url_foto_yayasan || "",
            description: apiItem.deskripsi_yayasan || "",
            id: apiItem.id,
          };
          fetchedYayasanId = apiItem.id;
        }
      }
    } catch (error) {
      console.error("Error fetching initial Tentang Kami data:", error);
    } finally {
      setTentangKamiData(newTentangKamiData);
      setLkpId(fetchedLkpId);
      setLpkId(fetchedLpkId);
      setYayasanId(fetchedYayasanId);
      setLoadingTentangKami(false);
    }
  };

  const fetchAllContentData = async () => {
    // Fetch Slideshow
    try {
      const response = await fetchData(apiEndpoints.slideshow);
      let items = [];
      if (response && response.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        items = response.data;
      }
      setSlideshowData(items);
    } catch (err) {
      console.error("Failed to load slideshow data:", err);
    }

    // Fetch Banner
    try {
      const response = await fetchData(apiEndpoints.banner);
      let items = [];
      if (response && response.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        items = response.data;
      }
      setBannerData(items);
    } catch (err) {
      console.error("Failed to load banner data:", err);
    }

    // Fetch Berita
    try {
      const response = await fetchData(apiEndpoints.berita);
      let items = [];
      if (response && response.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        items = response.data;
      }
      setBeritaData(
        items.map((item) => ({
          ...item,
          judul: item.title,
          gambar: item.gambar ? `${item.gambar}` : null,
        }))
      );
    } catch (err) {
      console.error("Failed to load news data:", err);
    }

    // Fetch Galeri
    try {
      const response = await fetchData(apiEndpoints.informasiGaleri);
      let items = [];
      if (response && response.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        items = response.data;
      }
      setGaleriData(
        items.map((item) => ({
          ...item,
          judulFoto: item.judul_foto || item.judulFoto,
          file_foto: item.file_foto
            ? `http://localhost:8000/storage/galeri_kegiatan/${item.file_foto}`
            : null,
        }))
      );
    } catch (err) {
      console.error("Failed to load gallery data:", err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setAuthToken(storedToken);
      console.log(
        "AdminKontenpage useEffect: Token set from localStorage for initial data fetch."
      );
      fetchAllContentData();
      fetchAllTentangKamiData();
      fetchVisiMisiData(); // Panggil saat komponen dimuat
      fetchInformasiKontakData(); // Panggil saat komponen dimuat
    } else {
      console.log(
        "AdminKontenpage useEffect: No token found in localStorage for initial data fetch. Please login."
      );
    }
  }, []);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      if (section !== "tentangKami") {
        setActiveTentangKami(null);
      }
    }
  };

  const toggleTentangKami = (section) => {
    if (activeTentangKami === section) {
      setActiveTentangKami(null);
    } else {
      setActiveTentangKami(section);
    }
  };

  const updateTentangKamiData = (type, newData) => {
    setTentangKamiData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        ...newData,
      },
    }));
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Kelola Informasi
      </h1>

      <div className="space-y-4">
        {/* Section Slideshow */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection("slideshow")}
            className="w-full p-4 text-left flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center">
              <FaImage className="text-blue-500 mr-2" />
              <span className="font-medium text-blue-800">Slideshow</span>
            </div>
            {activeSection === "slideshow" ? (
              <FaChevronDown className="text-blue-600" />
            ) : (
              <FaChevronRight className="text-blue-600" />
            )}
          </button>

          {activeSection === "slideshow" && (
            <div className="p-4 border-t border-gray-200">
              <TableSection
                title="Slideshow"
                apiEndpoint={apiEndpoints.slideshow}
                data={slideshowData}
                setData={setSlideshowData}
              />
            </div>
          )}
        </div>

        {/* Section Banner */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection("banner")}
            className="w-full p-4 text-left flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center">
              <FaImage className="text-green-500 mr-2" />
              <span className="font-medium text-green-800">Banner</span>
            </div>
            {activeSection === "banner" ? (
              <FaChevronDown className="text-green-600" />
            ) : (
              <FaChevronRight className="text-green-600" />
            )}
          </button>

          {activeSection === "banner" && (
            <div className="p-4 border-t border-gray-200">
              <TableSection
                title="Banner"
                apiEndpoint={apiEndpoints.banner}
                data={bannerData}
                setData={setBannerData}
              />
            </div>
          )}
        </div>

        {/* Section Berita */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection("berita")}
            className="w-full p-4 text-left flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center">
              <FaNewspaper className="text-orange-500 mr-2" />
              <span className="font-medium text-orange-800">Berita</span>
            </div>
            {activeSection === "berita" ? (
              <FaChevronDown className="text-orange-600" />
            ) : (
              <FaChevronRight className="text-orange-600" />
            )}
          </button>

          {activeSection === "berita" && (
            <div className="p-4 border-t border-gray-200">
              <BeritaSection
                apiEndpoint={apiEndpoints.berita}
                data={beritaData}
                setData={setBeritaData}
              />
            </div>
          )}
        </div>

        {/* Section Galeri */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection("galeri")}
            className="w-full p-4 text-left flex items-center justify-between bg-pink-50 hover:bg-pink-100 transition-colors"
          >
            <div className="flex items-center">
              <FaImage className="text-pink-500 mr-2" />
              <span className="font-medium text-pink-800">Galeri Foto</span>
            </div>
            {activeSection === "galeri" ? (
              <FaChevronDown className="text-pink-600" />
            ) : (
              <FaChevronRight className="text-pink-600" />
            )}
          </button>

          {activeSection === "galeri" && (
            <div className="p-4 border-t border-gray-200">
              <GaleriSection
                apiEndpoint={apiEndpoints.informasiGaleri}
                data={galeriData}
                setData={setGaleriData}
              />
            </div>
          )}
        </div>

        {/* Section Informasi Tentang Kami */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection("tentangKami")}
            className="w-full p-4 text-left flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center">
              <FaInfo className="text-purple-500 mr-2" />
              <span className="font-medium text-purple-800">
                Informasi Tentang Kami
              </span>
            </div>
            {activeSection === "tentangKami" ? (
              <FaChevronDown className="text-purple-600" />
            ) : (
              <FaChevronRight className="text-purple-600" />
            )}
          </button>

          {activeSection === "tentangKami" && (
            <div className="p-4 border-t border-gray-200">
              {loadingTentangKami ? (
                <p className="text-blue-500 text-center">
                  Memuat informasi Tentang Kami...
                </p>
              ) : (
                <>
                  {/* SUB-SECTION: Visi dan Misi (INTEGRASI API) */}
                  <div className="mb-6">
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTentangKami("VISI_MISI")}
                        className={`w-full p-3 text-left flex items-center justify-between transition-colors
                                      ${
                                        activeTentangKami === "VISI_MISI"
                                          ? "bg-indigo-100"
                                          : "bg-gray-50 hover:bg-gray-100"
                                      }`}
                      >
                        <div className="flex items-center">
                          <FaFlag className="text-indigo-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            Visi dan Misi
                          </span>
                        </div>
                        {activeTentangKami === "VISI_MISI" ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </button>

                      {activeTentangKami === "VISI_MISI" && (
                        <div className="p-4 border-t border-gray-200">
                          {loadingVisiMisi ? (
                            <p className="text-blue-500 text-center">
                              Memuat informasi Visi dan Misi...
                            </p>
                          ) : (
                            <VisiMisiEditor
                              data={visiMisiData}
                              setData={setVisiMisiData}
                              apiEndpoint={
                                apiEndpoints.visiMisi ||
                                "/api/informasi-lembaga"
                              } // Menggunakan endpoint API
                              visiMisiId={visiMisiId}
                              setVisiMisiId={setVisiMisiId}
                              onSaveSuccess={fetchVisiMisiData} // Memanggil ulang fetch setelah save
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SUB-SECTIONS: Lembaga Information (Tidak Berubah) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTentangKami("LKP BINA ESSA")}
                        className={`w-full p-3 text-left flex items-center justify-between transition-colors
                                      ${
                                        activeTentangKami === "LKP BINA ESSA"
                                          ? "bg-blue-100"
                                          : "bg-gray-50 hover:bg-gray-100"
                                      }`}
                      >
                        <div className="flex items-center">
                          <FaBuilding className="text-blue-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            LKP BINA ESSA
                          </span>
                        </div>
                        {activeTentangKami === "LKP BINA ESSA" ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </button>
                    </div>

                    <div className="bg-white border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTentangKami("LPK BINA ESSA")}
                        className={`w-full p-3 text-left flex items-center justify-between transition-colors
                                      ${
                                        activeTentangKami === "LPK BINA ESSA"
                                          ? "bg-green-100"
                                          : "bg-gray-50 hover:bg-gray-100"
                                      }`}
                      >
                        <div className="flex items-center">
                          <FaBuilding className="text-green-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            LPK BINA ESSA
                          </span>
                        </div>
                        {activeTentangKami === "LPK BINA ESSA" ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </button>
                    </div>

                    <div className="bg-white border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTentangKami("YAYASAN BINA ESSA")}
                        className={`w-full p-3 text-left flex items-center justify-between transition-colors
                                      ${
                                        activeTentangKami ===
                                        "YAYASAN BINA ESSA"
                                          ? "bg-orange-100"
                                          : "bg-gray-50 hover:bg-gray-100"
                                      }`}
                      >
                        <div className="flex items-center">
                          <FaBuilding className="text-orange-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            YAYASAN BINA ESSA
                          </span>
                        </div>
                        {activeTentangKami === "YAYASAN BINA ESSA" ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Detail Sections untuk setiap lembaga (Tidak Berubah) */}
                  {activeTentangKami === "LKP BINA ESSA" && (
                    <TentangKamiEditor
                      data={tentangKamiData["LKP BINA ESSA"]}
                      setData={(newData) =>
                        updateTentangKamiData("LKP BINA ESSA", newData)
                      }
                      type={"LKP BINA ESSA"}
                      apiEndpoint={apiEndpoints.lkp}
                      aboutId={lkpId}
                      setAboutId={setLkpId}
                      onSaveSuccess={fetchAllTentangKamiData}
                    />
                  )}
                  {activeTentangKami === "LPK BINA ESSA" && (
                    <TentangKamiEditor
                      data={tentangKamiData["LPK BINA ESSA"]}
                      setData={(newData) =>
                        updateTentangKamiData("LPK BINA ESSA", newData)
                      }
                      type={"LPK BINA ESSA"}
                      apiEndpoint={apiEndpoints.lpk}
                      aboutId={lpkId}
                      setAboutId={setLpkId}
                      onSaveSuccess={fetchAllTentangKamiData}
                    />
                  )}
                  {activeTentangKami === "YAYASAN BINA ESSA" && (
                    <TentangKamiEditor
                      data={tentangKamiData["YAYASAN BINA ESSA"]}
                      setData={(newData) =>
                        updateTentangKamiData("YAYASAN BINA ESSA", newData)
                      }
                      type={"YAYASAN BINA ESSA"}
                      apiEndpoint={apiEndpoints.yayasan}
                      aboutId={yayasanId}
                      setAboutId={setYayasanId}
                      onSaveSuccess={fetchAllTentangKamiData}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Section Informasi Kontak (Tidak Berubah) */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection("informasiKontak")}
            className="w-full p-4 text-left flex items-center justify-between bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <div className="flex items-center">
              <FaInfo className="text-teal-500 mr-2" />
              <span className="font-medium text-teal-800">
                Informasi Kontak
              </span>
            </div>
            {activeSection === "informasiKontak" ? (
              <FaChevronDown className="text-teal-600" />
            ) : (
              <FaChevronRight className="text-teal-600" />
            )}
          </button>

          {activeSection === "informasiKontak" && (
            <div className="p-4 border-t border-gray-200">
              {loadingKontak ? (
                <p className="text-blue-500 text-center">
                  Memuat informasi kontak...
                </p>
              ) : (
                <InformasiKontakEditor
                  data={informasiKontakData}
                  setData={setInformasiKontakData}
                  apiEndpoint={
                    apiEndpoints.informasiKontak || "/api/informasi-kontak"
                  }
                  kontakId={kontakId}
                  setKontakId={setKontakId}
                  onSaveSuccess={fetchInformasiKontakData}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminKontenpage;