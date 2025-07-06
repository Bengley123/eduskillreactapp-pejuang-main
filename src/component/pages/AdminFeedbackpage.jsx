import React, { useState, useEffect, useCallback } from "react";
import Typography from "../Elements/AdminSource/Typhography";
import DetailModal from "../Fragments/DetailModal";
import { FaSearch, FaExclamationCircle, FaSpinner } from "react-icons/fa"; // Tambahkan FaSpinner, FaExclamationCircle
import {
  fetchData,
  updateData,
  deleteData,
  apiEndpoints,
} from "../../services/api.js";

const FeedbackPage = () => {
  const [dataFeedback, setDataFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState(""); // New state for search term applied to API
  const [filterStatus, setFilterStatus] = useState(""); // State untuk filter status
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // New state for total pages from API
  const [totalItems, setTotalItems] = useState(0); // New state for total items from API

  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState(null);
  const [editedFeedbackItem, setEditedFeedbackItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const itemsPerPage = 10; // Mengubah menjadi 10 agar konsisten dengan backend paginate default

  const statusColors = {
    Ditinjau: "text-yellow-700 font-semibold",
    Ditampilkan: "text-green-700 font-semibold",
    "Tidak Ditampilkan": "text-red-700 font-semibold",
  };

  // Callback untuk mengambil data feedback dari API
  const fetchFeedbackData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${apiEndpoints.feedback}?page=${currentPage}&per_page=${itemsPerPage}`;

      // Tambahkan parameter search dan filter status ke URL API
      if (appliedSearchQuery) {
        // Gunakan appliedSearchQuery
        url += `&search=${encodeURIComponent(appliedSearchQuery)}`;
      }
      if (filterStatus) {
        url += `&status=${encodeURIComponent(filterStatus)}`;
      }

      console.log("Fetching Feedback Data from URL:", url); // Debug
      const response = await fetchData(url);
      console.log("API Raw Response for Feedback:", response); // Debug

      let fetchedRawItems = [];
      let currentTotal = 0;
      let currentLastPage = 1;
      let currentCurrentPage = 1;

      // Controller feedback mengembalikan objek pagination langsung, dengan data di 'data' key di level root
      // dan properti paginasi seperti 'total', 'last_page', 'current_page' juga di level root.
      // Sesuai dengan format Laravel Paginator standar.
      if (response && Array.isArray(response.data)) {
        // Fallback for non-paginated direct array
        fetchedRawItems = response.data;
        currentTotal = response.total || response.data.length; // If direct array, total is its length
        currentLastPage = response.last_page || 1;
        currentCurrentPage = response.current_page || 1;
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        // For Laravel Paginator 'data' key
        fetchedRawItems = response.data.data;
        currentTotal = response.data.total || response.data.data.length;
        currentLastPage = response.data.last_page || 1;
        currentCurrentPage = response.data.current_page || 1;
      } else {
        // Direct paginator response like in your controller (PelatihanController)
        // For FeedbackController, it seems to directly return the paginated object, not response.data.data
        // So this block should handle it correctly.
        fetchedRawItems = response.data; // This assumes response.data is the array of items, or response itself is array
        currentTotal = response.total;
        currentLastPage = response.last_page;
        currentCurrentPage = response.current_page;
      }

      const mappedData = fetchedRawItems.map((item) => ({
        id: item.id,
        nama: item.peserta?.user?.name || "N/A",
        email: item.peserta?.user?.email || "N/A",
        pesan: item.comment || "",
        tanggalFeedback: item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A",
        status: ["Ditinjau", "Ditampilkan", "Tidak Ditampilkan"].includes(
          item.status
        )
          ? item.status
          : "Ditinjau",
        created_at: item.created_at,
        updated_at: item.updated_at,
        tempat_kerja: item.tempat_kerja || "",
      }));
      setDataFeedback(mappedData);
      setTotalPages(currentLastPage); // Set total pages
      setTotalItems(currentTotal); // Set total items
      setCurrentPage(currentCurrentPage); // Set current page
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network Error: Pastikan backend Laravel berjalan dan CORS dikonfigurasi dengan benar."
        );
      } else if (err.response) {
        setError(
          `Failed to load feedback data: ${err.response.status} - ${err.response.statusText}`
        );
        console.error("API Response Error:", err.response.data);
      } else {
        setError("Failed to load feedback data.");
      }
      setDataFeedback([]); // Clear data on error
      setTotalPages(1);
      setTotalItems(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchQuery, filterStatus]); // Tambahkan dependencies

  // Panggil fetchFeedbackData saat komponen mount dan saat filter/search/page berubah
  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  // Kolom untuk tabel
  const columns = [
    {
      key: "no", // Gunakan 'no' untuk nomor urut
      header: "No",
      render: (value, row, index) =>
        (currentPage - 1) * itemsPerPage + index + 1,
    },
    { key: "nama", header: "Nama" },
    {
      key: "pesan",
      header: "Feedback",
      render: (pesan) => (
        <div className="max-w-xs truncate" title={pesan}>
          {pesan}
        </div>
      ),
    },
    { key: "tanggalFeedback", header: "Tanggal Feedback" },
    {
      key: "status",
      header: "Status",
      render: (status) => (
        <span className={statusColors[status] || "text-gray-500"}>
          {status}
        </span>
      ),
    },
  ];

  // Fields untuk DetailModal
  const modalFields = [
    { key: "nama", label: "Nama Lengkap", type: "text", readonly: true },
    { key: "email", label: "Email", type: "email", readonly: true },
    {
      key: "tanggalFeedback",
      label: "Tanggal Feedback",
      type: "text",
      readonly: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Ditinjau", label: "Ditinjau" },
        { value: "Ditampilkan", label: "Ditampilkan" },
        { value: "Tidak Ditampilkan", label: "Tidak Ditampilkan" },
      ],
    },
    {
      key: "pesan",
      label: "Pesan Feedback",
      type: "textarea",
      readonly: true,
    },
    {
      key: "tempat_kerja",
      label: "Tempat Kerja",
      type: "text",
      readonly: true,
    },
  ];

  const handleViewDetail = (item) => {
    setSelectedFeedbackItem(item);
    setEditedFeedbackItem({ ...item });
    setShowDetail(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedFeedbackItem({ ...selectedFeedbackItem });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (
      !editedFeedbackItem.status ||
      !["Ditinjau", "Ditampilkan", "Tidak Ditampilkan"].includes(
        editedFeedbackItem.status
      )
    ) {
      alert(
        "Please select a valid status (Ditinjau, Ditampilkan, or Tidak Ditampilkan)."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        _method: "PUT",
        status: editedFeedbackItem.status,
      };

      await updateData(apiEndpoints.feedback, selectedFeedbackItem.id, payload);

      await fetchFeedbackData(); // Re-fetch data for refresh

      alert("Feedback updated successfully!");
      setShowDetail(false);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update feedback:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join("; ");
        setError(`Failed to update feedback. Errors: ${errorMessages}`);
      } else if (err.response) {
        setError(
          `Failed to update feedback: ${err.response.status} - ${err.response.statusText}`
        );
      } else {
        setError(`Failed to update feedback: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      setLoading(true);
      setError(null);
      try {
        await deleteData(apiEndpoints.feedback, selectedFeedbackItem.id);

        await fetchFeedbackData(); // Re-fetch data for refresh

        alert("Feedback deleted successfully!");
        setShowDetail(false);
      } catch (err) {
        console.error("Failed to delete feedback:", err);
        if (err.response) {
          setError(
            `Failed to delete feedback: ${err.response.status} - ${err.response.statusText}`
          );
        } else {
          setError(`Failed to delete feedback: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedFeedbackItem((prev) => ({ ...prev, [field]: value }));
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

  // Only update searchQuery for input field, appliedSearchQuery triggers data fetch
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApplySearch = () => {
    setAppliedSearchQuery(searchQuery); // Apply the search term to trigger fetchFeedbackData
    setCurrentPage(1); // Reset to page 1 for new search
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApplySearch();
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset page on filter
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setFilterStatus(""); // Reset to empty string for 'Semua Status'
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
        <Typography variant="h2" className="mt-4 text-gray-700">
          Memuat data feedback...
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
        <Button onClick={fetchFeedbackData} variant="primary" className="mt-4">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Kelola Feedback</h1>
        </div>

        {/* Search dan Filter Section */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama peserta atau feedback..."
                value={searchQuery}
                onChange={handleSearchChange}
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

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Filter Status:
              </label>
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Semua Status</option>
                <option value="Ditinjau">Ditinjau</option>
                <option value="Ditampilkan">Ditampilkan</option>
                <option value="Tidak Ditampilkan">Tidak Ditampilkan</option>
              </select>
            </div>
          </div>

          {/* Reset Button dan Info */}
          <div className="flex items-center gap-3">
            {(appliedSearchQuery || filterStatus !== "") && (
              <button
                onClick={handleResetFilter}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
              >
                Reset Filter
              </button>
            )}
            <span className="text-sm text-gray-500">
              {totalItems} feedback ditemukan
            </span>
          </div>
        </div>

        {/* Tabel Feedback */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Feedback</th>
                <th className="px-4 py-2">Tanggal Feedback</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFeedback.length > 0 ? (
                dataFeedback.map((feedbackItem, idx) => (
                  <tr
                    key={feedbackItem.id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-2">{feedbackItem.nama}</td>
                    <td className="px-4 py-2">
                      <div
                        className="max-w-xs truncate"
                        title={feedbackItem.pesan}
                      >
                        {feedbackItem.pesan}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {feedbackItem.tanggalFeedback}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          statusColors[feedbackItem.status] || "text-gray-500"
                        }
                      >
                        {feedbackItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(feedbackItem)}
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                          title="Lihat Detail Feedback"
                        >
                          <FaSearch />
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
                        {appliedSearchQuery || filterStatus !== ""
                          ? "Tidak ada feedback yang sesuai dengan pencarian atau filter"
                          : "Belum ada data feedback"}
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
                (currentPage - 1) * itemsPerPage + dataFeedback.length
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
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detail Feedback"
        data={selectedFeedbackItem}
        isEditing={isEditing}
        editedData={editedFeedbackItem}
        onEdit={handleEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDelete}
        onInputChange={handleInputChange}
        fields={modalFields}
        showDocuments={false}
        documentFields={[]}
      />
    </div>
  );
};

export default FeedbackPage;
