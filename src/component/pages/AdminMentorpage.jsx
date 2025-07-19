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

  // Fetch data mentor
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

      let fetchedRawItems = [];
      let currentTotal = 0;
      let currentLastPage = 1;
      let currentCurrentPage = 1;

      if (response && Array.isArray(response.data)) {
        fetchedRawItems = response.data;
        currentTotal = response.total || response.data.length;
        currentLastPage = response.last_page || 1;
        currentCurrentPage = response.current_page || 1;
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        fetchedRawItems = response.data.data;
        currentTotal = response.data.total || response.data.data.length;
        currentLastPage = response.data.last_page || 1;
        currentCurrentPage = response.data.current_page || 1;
      } else {
        console.warn(
          "API response for mentor data is not in expected format:",
          response
        );
      }

      const mappedData = fetchedRawItems.map((item) => ({
        id: item.id,
        nama_mentor: item.nama_mentor,
        admin_id: item.admin_id,
        admin_name:
          item.admin_profile?.nama ||
          item.adminProfile?.nama ||
          "Admin tidak diketahui",
        jumlah_pelatihan: item.pelatihan?.length || 0,
        created_at: item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID")
          : "",
        updated_at: item.updated_at
          ? new Date(item.updated_at).toLocaleDateString("id-ID")
          : "",
      }));

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
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus mentor "${mentorToDelete.nama_mentor}" ini?`
      )
    ) {
      setLoading(true);
      try {
        await deleteData(apiEndpoints.mentor, mentorToDelete.id);
        alert("Mentor berhasil dihapus!");
        fetchMentorData();
        setShowDetail(false);
      } catch (err) {
        console.error("Failed to delete mentor:", err);
        alert(
          `Gagal menghapus mentor: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    }
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
        alert("Mentor berhasil diperbarui!");
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
        alert("Validasi gagal. Mohon periksa kembali input Anda.");
      } else {
        alert(
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
      alert("Mohon lengkapi nama mentor");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama_mentor", form.nama_mentor);

      const response = await createData(apiEndpoints.mentor, formData);
      if (response) {
        alert("Mentor berhasil ditambahkan!");
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
        alert("Validasi gagal. Mohon periksa kembali input Anda.");
      } else {
        alert(
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
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserTie className="text-blue-500" />
            Kelola Data Mentor
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setForm({
                nama_mentor: "",
              });
              setValidationErrors({});
            }}
            className="px-4 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg rounded transition-colors duration-200 flex items-center gap-1"
          >
            <FaPlus size={12} /> Tambah Mentor
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleApplySearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700"
                title="Cari"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Reset Button dan Info */}
          <div className="flex items-center gap-3">
            {appliedSearchQuery && (
              <button
                onClick={handleResetFilter}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
              >
                Reset Filter
              </button>
            )}
            <span className="text-sm text-gray-500">
              {totalItems} mentor ditemukan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama Mentor</th>
                <th className="px-4 py-2">Admin Pembuat</th>
                <th className="px-4 py-2">Jumlah Pelatihan</th>
                <th className="px-4 py-2">Dibuat</th>
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
                    <td className="px-4 py-2">{mentor.admin_name}</td>
                    <td className="px-4 py-2 text-center">
                      {mentor.jumlah_pelatihan}
                    </td>
                    <td className="px-4 py-2">{mentor.created_at}</td>
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
                    colSpan="6"
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
                      <Label>Admin Pembuat</Label>
                      <p className="font-medium">{selectedMentor.admin_name}</p>
                    </div>

                    <div>
                      <Label>Jumlah Pelatihan</Label>
                      <p className="font-medium">
                        {selectedMentor.jumlah_pelatihan} pelatihan
                      </p>
                    </div>

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
