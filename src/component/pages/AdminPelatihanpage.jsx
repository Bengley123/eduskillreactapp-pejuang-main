import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaUserFriends,
  FaExclamationCircle,
  FaCheck,
  FaSpinner,
  FaImage,
  FaEye,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Typography from "../Elements/AdminSource/Typhography";
import Button from "../Elements/Button/index";
import InputText from "../Elements/Input/Input";
import Label from "../Elements/Input/Label";

import api, {
  fetchData,
  createData,
  updateData,
  deleteData,
  apiEndpoints,
  setAuthToken,
} from "../../services/api.js";

// Custom Modal Components (Tidak ada perubahan di sini)
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

const AdminPelatihanPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataPelatihan, setDataPelatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [selectedPelatihan, setSelectedPelatihan] = useState(null);
  const [editedPelatihan, setEditedPelatihan] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showPelamarModal, setShowPelamarModal] = useState(false);
  const [selectedPelamarList, setSelectedPelamarList] = useState([]);
  const [selectedPelatihanNama, setSelectedPelatihanNama] = useState("");
  const [selectedPelatihanId, setSelectedPelatihanId] = useState(null);
  const [loadingPelamar, setLoadingPelamar] = useState(false);

  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedPelamar, setSelectedPelamar] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  // State untuk gambar
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [selectedEditImage, setSelectedEditImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState("");
  const [documentOwnerName, setDocumentOwnerName] = useState("");

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

  const [form, setForm] = useState({
    nama_pelatihan: "",
    keterangan_pelatihan: "",
    kategori_id: "",
    biaya: "",
    jumlah_kuota: "",
    waktu_pengumpulan: "",
    mentor_id: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [postStatusFilter, setPostStatusFilter] = useState("Semua");

  const [mentorOptions, setMentorOptions] = useState([]);
  const [loadingMentorOptions, setLoadingMentorOptions] = useState(true);
  const [mentorOptionsError, setMentorOptionsError] = useState(null);

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [loadingKategoriOptions, setLoadingKategoriOptions] = useState(true);
  const [kategoriOptionsError, setKategoriOptionsError] = useState(null);

  const [isDocumentListModalOpen, setDocumentListModalOpen] = useState(false);
  const [currentPelamarDocs, setCurrentPelamarDocs] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // We get the token using the key "jwt", just like in your PesertaPage
    const token = localStorage.getItem("jwt");
    if (token) {
      setAuthToken(token);
    } else {
      console.error("Auth token not found, redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);

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

  const handleViewDocument = async (documentUrl) => {
    if (!documentUrl) {
      showAlert("error", "Gagal", "URL Dokumen tidak ditemukan.");
      return;
    }

    try {
      // ▼▼▼ USE 'api', NOT 'axios' ▼▼▼
      // 'api' is your pre-configured instance that already has the JWT token.
      const response = await api.get(documentUrl, {
        responseType: "blob",
      });

      // The rest of the function is correct
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing document:", error);
      if (error.response && error.response.status === 401) {
        showAlert(
          "error",
          "Akses Ditolak",
          "Sesi Anda mungkin telah berakhir. Silakan login kembali."
        );
        navigate("/login");
      } else {
        showAlert("error", "Gagal Memuat", "Tidak dapat memuat dokumen.");
      }
    }
  };

  // Fungsi untuk handle upload gambar
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        showAlert(
          "error",
          "Format File Tidak Valid",
          "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau GIF."
        );
        return;
      }

      if (file.size > maxSize) {
        showAlert(
          "error",
          "Ukuran File Terlalu Besar",
          "Ukuran file terlalu besar. Maksimal 5MB."
        );
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        showAlert(
          "error",
          "Format File Tidak Valid",
          "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau GIF."
        );
        return;
      }

      if (file.size > maxSize) {
        showAlert(
          "error",
          "Ukuran File Terlalu Besar",
          "Ukuran file terlalu besar. Maksimal 5MB."
        );
        return;
      }

      setSelectedEditImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById("image_upload");
    if (fileInput) fileInput.value = "";
  };

  const removeEditImagePreview = () => {
    setSelectedEditImage(null);
    setEditImagePreview(null);
    const fileInput = document.getElementById("edit_image_upload");
    if (fileInput) fileInput.value = "";
  };

  const openImageModal = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setShowImageModal(true);
  };

  // Fetch mentor options
  useEffect(() => {
    const fetchMentorOptions = async () => {
      setLoadingMentorOptions(true);
      setMentorOptionsError(null);
      try {
        const response = await fetchData(apiEndpoints.mentor || "/api/mentor");
        let mentors = [];
        if (response && Array.isArray(response.data)) {
          mentors = response.data;
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          mentors = response.data.data;
        } else {
          console.warn(
            "API response for mentor options is not in expected format:",
            response
          );
          setMentorOptions([]);
          return;
        }
        setMentorOptions(
          mentors.map((m) => ({ value: m.id, label: m.nama_mentor }))
        );
      } catch (err) {
        console.error("Failed to fetch mentor options:", err);
        setMentorOptionsError(
          "Gagal memuat daftar mentor. Pastikan API mentor berfungsi."
        );
        setMentorOptions([]);
      } finally {
        setLoadingMentorOptions(false);
      }
    };
    fetchMentorOptions();
  }, []);

  // Fetch kategori options
  useEffect(() => {
    const fetchKategoriOptions = async () => {
      setLoadingKategoriOptions(true);
      setKategoriOptionsError(null);
      try {
        const response = await fetchData(
          apiEndpoints.kategori || "/api/kategori"
        );
        let categories = [];
        if (response && Array.isArray(response.data)) {
          categories = response.data;
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          categories = response.data.data;
        } else {
          console.warn(
            "API response for kategori options is not in expected format:",
            response
          );
          setKategoriOptions([]);
          return;
        }
        setKategoriOptions(
          categories.map((k) => ({ value: k.id, label: k.nama_kategori }))
        );
      } catch (err) {
        console.error("Failed to fetch kategori options:", err);
        setKategoriOptionsError(
          "Gagal memuat daftar kategori. Pastikan API kategori berfungsi."
        );
        setKategoriOptions([]);
      } finally {
        setLoadingKategoriOptions(false);
      }
    };
    fetchKategoriOptions();
  }, []);

  // In AdminPelatihanPage.jsx

  const fetchPelatihanData = useCallback(async () => {
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
      if (statusFilter !== "Semua") {
        params.append("status_pelatihan", statusFilter);
      }
      if (postStatusFilter !== "Semua") {
        params.append("post_status", postStatusFilter);
      }

      const url = `${apiEndpoints.pelatihan}?${params.toString()}`;

      console.log("Fetching Pelatihan Data from URL:", url);
      // The 'response' variable here is the object from your log
      const response = await fetchData(url);
      console.log("API Response for Pelatihan:", response);

      // ▼▼▼ FINAL CORRECTED LOGIC ▼▼▼
      // The check now correctly looks at the object you logged
      if (response && response.data && response.meta) {
        // No extra .data needed here
        const fetchedRawItems = response.data;
        const meta = response.meta;

        const mappedData = fetchedRawItems.map((item) => ({
          id: item.id,
          nama: item.nama_pelatihan,
          keterangan: item.keterangan_pelatihan,
          kategori_id: item.kategori_id || "",
          kategori: item.kategori || "N/A", // Using the pre-loaded 'kategori' from your resource
          biaya: item.biaya,
          jumlah_kuota: item.jumlah_kuota,
          jumlah_peserta: item.jumlah_peserta || 0,
          waktu_pengumpulan: item.waktu_pengumpulan
            ? item.waktu_pengumpulan.slice(0, 16)
            : "",
          mentor_id: item.mentor_id || "",
          instruktur: item.mentor ? item.mentor.nama_mentor : "N/A",
          status: item.status_pelatihan || "Belum Dimulai",
          postStatus: item.post_status || "Draft",
          foto_pelatihan: item.foto_pelatihan
            ? `${import.meta.env.VITE_API_URL}${item.foto_pelatihan}`
            : null,
        }));

        setDataPelatihan(mappedData);
        setTotalPages(meta.last_page || 1);
        setTotalItems(meta.total || 0);
      } else {
        // This warning will no longer trigger
        console.warn(
          "API response for pelatihan data is not in the expected format:",
          response
        );
        setDataPelatihan([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      // ▲▲▲ END OF FINAL CORRECTED LOGIC ▲▲▲
    } catch (err) {
      console.error("Failed to fetch pelatihan:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network Error: Pastikan backend Laravel berjalan dan CORS dikonfigurasi dengan benar."
        );
      } else if (err.response) {
        setError(
          `Failed to load pelatihan data: ${err.response.status} - ${
            err.response.statusText || "Unknown Error"
          }`
        );
        console.error("API Response Error:", err.response.data);
      } else {
        setError("Failed to load pelatihan data.");
      }
      setDataPelatihan([]);
      setTotalPages(1);
      setTotalItems(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    appliedSearchQuery,
    statusFilter,
    postStatusFilter,
  ]);

  useEffect(() => {
    fetchPelatihanData();
  }, [fetchPelatihanData]);

  const handleViewDetail = (pelatihan) => {
    const formattedWaktuPengumpulan = pelatihan.waktu_pengumpulan
      ? pelatihan.waktu_pengumpulan.slice(0, 16)
      : "";

    setSelectedPelatihan({
      ...pelatihan,
      waktu_pengumpulan: formattedWaktuPengumpulan,
    });
    setEditedPelatihan({
      ...pelatihan,
      waktu_pengumpulan: formattedWaktuPengumpulan,
    });
    setShowDetail(true);
    setIsEditing(false);
    setValidationErrors({});
    setSelectedEditImage(null);
    setEditImagePreview(null);
  };

  // =================================================================
  // ▼▼▼ FUNGSI handleViewPelamar YANG SUDAH DIPERBAIKI ▼▼▼
  // =================================================================
  const handleViewPelamar = async (pelatihan) => {
    setLoadingPelamar(true);
    setSelectedPelamarList([]);
    setSelectedPelatihanNama(pelatihan.nama);
    setSelectedPelatihanId(pelatihan.id);
    setShowPelamarModal(true);
    try {
      const response = await fetchData(
        `${apiEndpoints.daftarPelatihan}?pelatihan_id=${pelatihan.id}`
      );
      let fetchedPelamar = [];
      if (response && Array.isArray(response.data)) {
        fetchedPelamar = response.data;
      } else if (response?.data?.data) {
        fetchedPelamar = response.data.data;
      }

      // Add this console.log to see what the API is actually sending!
      console.log("Raw API response for pelamar:", fetchedPelamar);

      const mappedPelamar = fetchedPelamar.map((item) => {
        const namaPelamar =
          item.user?.name || item.peserta?.user?.name || "N/A";

        const documentApiUrl = `${
          import.meta.env.VITE_API_URL
        }/api/documents-view/`;

        const dokumen = {
          // Langsung gunakan path lengkap dari item.ktp, dll.
          ktp: item.ktp ? `${documentApiUrl}${item.ktp}` : null,
          kk: item.kk ? `${documentApiUrl}${item.kk}` : null,
          ijazah: item.ijazah ? `${documentApiUrl}${item.ijazah}` : null,
          foto: item.foto ? `${documentApiUrl}${item.foto}` : null,
        };

        return {
          id: item.id,
          nama: namaPelamar,
          email: item.user?.email || item.peserta?.user?.email || "N/A",
          telepon: item.peserta?.nomor_telp || "N/A",
          status: item.status,
          tanggalDaftar: item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID")
            : "N/A",
          dokumen: dokumen, // We now have an object with all doc URLs
          originalRegistration: item,
        };
      });
      setSelectedPelamarList(mappedPelamar);
    } catch (err) {
      console.error("Failed to fetch pelamar list:", err);
      showAlert("error", "Gagal Memuat Data", "Gagal memuat daftar pelamar.");
      setSelectedPelamarList([]);
    } finally {
      setLoadingPelamar(false);
    }
  };
  // =================================================================
  // ▲▲▲ AKHIR DARI FUNGSI YANG DIPERBAIKI ▲▲▲
  // =================================================================

  const handlePreviewDokumen = (pelamar) => {
    if (pelamar.dokumen_url) {
      // Check if the URL potentially indicates an image to open in image modal
      // This is a basic check, you might need more robust file type detection
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(pelamar.dokumen_url);

      if (isImage) {
        setModalImageSrc(pelamar.dokumen_url);
        setShowImageModal(true);
      } else {
        // Assume it's a PDF or other document type that can be embedded in an iframe
        setDocumentPreviewUrl(pelamar.dokumen_url);
        setDocumentOwnerName(pelamar.nama);
        setShowDocumentModal(true);
      }
    } else {
      showAlert(
        "info",
        "Tidak Ada Dokumen",
        "Pelamar ini tidak mengunggah dokumen pendaftaran."
      );
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedPelamar || !selectedPelatihanId || !newStatus) return;

    setSavingStatus(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("status", newStatus);

      const response = await updateData(
        apiEndpoints.daftarPelatihan,
        selectedPelamar.id,
        formData
      );

      if (response) {
        showAlert(
          "success",
          "Berhasil!",
          "Status pelamar berhasil diperbarui!"
        );
        // Re-fetch pelamar list for the current training to update status visually
        handleViewPelamar({
          id: selectedPelatihanId,
          nama: selectedPelatihanNama,
        });
        setShowStatusPopup(false);
        setSelectedPelamar(null);
        setNewStatus("");
        // Also refresh the main training data to update 'jumlah_peserta' if applicable
        fetchPelatihanData();
      } else {
        throw new Error("Respon API tidak valid.");
      }
    } catch (err) {
      console.error("Gagal memperbarui status pelamar:", err);
      showAlert(
        "error",
        "Gagal Memperbarui Status",
        `Gagal memperbarui status: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (pelatihanToDelete) => {
    showConfirm(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus pelatihan "${pelatihanToDelete.nama}" ini?`,
      async () => {
        setLoading(true);
        try {
          await deleteData(apiEndpoints.pelatihan, pelatihanToDelete.id);
          showAlert("success", "Berhasil!", "Pelatihan berhasil dihapus!");
          fetchPelatihanData();
          setShowDetail(false);
        } catch (err) {
          console.error("Failed to delete pelatihan:", err);
          showAlert(
            "error",
            "Gagal Menghapus",
            `Gagal menghapus pelatihan: ${
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
    const formattedWaktuPengumpulan = selectedPelatihan.waktu_pengumpulan
      ? selectedPelatihan.waktu_pengumpulan.slice(0, 16)
      : "";
    setEditedPelatihan({
      ...selectedPelatihan,
      waktu_pengumpulan: formattedWaktuPengumpulan,
    });
    setIsEditing(false);
    setValidationErrors({});
    setSelectedEditImage(null);
    setEditImagePreview(null);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setValidationErrors({});
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("nama_pelatihan", editedPelatihan.nama);
      formData.append("keterangan_pelatihan", editedPelatihan.keterangan);
      formData.append("kategori_id", editedPelatihan.kategori_id);
      formData.append("biaya", editedPelatihan.biaya);
      formData.append("jumlah_kuota", editedPelatihan.jumlah_kuota);
      const formattedTime =
        editedPelatihan.waktu_pengumpulan.replace("T", " ") + ":00";
      formData.append("waktu_pengumpulan", formattedTime);
      formData.append("mentor_id", editedPelatihan.mentor_id);
      formData.append("status_pelatihan", editedPelatihan.status);
      formData.append("post_status", editedPelatihan.postStatus);

      if (selectedEditImage) {
        formData.append("foto_pelatihan", selectedEditImage);
      }

      const response = await updateData(
        apiEndpoints.pelatihan,
        selectedPelatihan.id,
        formData
      );
      if (response) {
        showAlert("success", "Berhasil!", "Pelatihan berhasil diperbarui!");
        fetchPelatihanData();
        setShowDetail(false);
        setIsEditing(false);
        setSelectedEditImage(null);
        setEditImagePreview(null);
      } else {
        throw new Error("Respon update kosong atau tidak valid.");
      }
    } catch (err) {
      console.error("Failed to save pelatihan:", err);
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
    setEditedPelatihan((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (postStatusValue) => {
    setValidationErrors({});
    if (
      !form.nama_pelatihan ||
      !form.keterangan_pelatihan ||
      !form.kategori_id ||
      !form.biaya ||
      !form.jumlah_kuota ||
      !form.waktu_pengumpulan ||
      !form.mentor_id
    ) {
      showAlert(
        "warning",
        "Data Tidak Lengkap",
        "Mohon lengkapi semua field yang wajib diisi"
      );
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama_pelatihan", form.nama_pelatihan);
      formData.append("keterangan_pelatihan", form.keterangan_pelatihan);
      formData.append("kategori_id", form.kategori_id);
      formData.append("biaya", form.biaya);
      formData.append("jumlah_kuota", form.jumlah_kuota);
      const formattedTime = form.waktu_pengumpulan.replace("T", " ") + ":00";
      formData.append("waktu_pengumpulan", formattedTime);
      formData.append("mentor_id", form.mentor_id);
      formData.append("post_status", postStatusValue);

      if (selectedImage) {
        formData.append("foto_pelatihan", selectedImage);
      }

      const response = await createData(apiEndpoints.pelatihan, formData);
      if (response) {
        showAlert("success", "Berhasil!", "Pelatihan berhasil ditambahkan!");
        fetchPelatihanData();
        setShowForm(false);
        setForm({
          nama_pelatihan: "",
          keterangan_pelatihan: "",
          kategori_id: "",
          biaya: "",
          jumlah_kuota: "",
          waktu_pengumpulan: "",
          mentor_id: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        throw new Error("Respon API tidak valid.");
      }
    } catch (err) {
      console.error("Failed to add pelatihan:", err);
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
          `Gagal menambahkan pelatihan: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublishDraft = async (pelatihan) => {
    showConfirm(
      "Konfirmasi Publikasi",
      `Yakin ingin mempublikasikan pelatihan "${pelatihan.nama}"?`,
      async () => {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("_method", "PUT");
          formData.append("post_status", "Published");

          const response = await updateData(
            apiEndpoints.pelatihan,
            pelatihan.id,
            formData
          );
          if (response) {
            showAlert(
              "success",
              "Berhasil!",
              "Pelatihan berhasil dipublikasikan!"
            );
            fetchPelatihanData();
            if (selectedPelatihan && selectedPelatihan.id === pelatihan.id) {
              setSelectedPelatihan((prev) => ({
                ...prev,
                postStatus: "Published",
              }));
              setEditedPelatihan((prev) => ({
                ...prev,
                postStatus: "Published",
              }));
            }
          } else {
            throw new Error("Respon API tidak valid.");
          }
        } catch (err) {
          console.error("Failed to publish draft:", err);
          showAlert(
            "error",
            "Gagal Mempublikasi",
            `Gagal mempublikasikan pelatihan: ${
              err.response?.data?.message || err.message
            }`
          );
        } finally {
          setLoading(false);
        }
        hideConfirm();
      },
      "success"
    );
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

  const handlePostStatusFilterChange = (value) => {
    setPostStatusFilter(value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setStatusFilter("Semua");
    setPostStatusFilter("Semua");
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "diterima":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Diterima
          </span>
        );
      case "ditolak":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Ditolak
          </span>
        );
      case "ditinjau":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Ditinjau
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  const getTrainingStatusBadge = (status) => {
    switch (status) {
      case "Belum Dimulai":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Belum Dimulai
          </span>
        );
      case "Sedang berlangsung":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            Sedang berlangsung
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Selesai
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

  const getPostStatusBadge = (postStatus) => {
    switch (postStatus) {
      case "Published":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Published
          </span>
        );
      case "Draft":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {postStatus}
          </span>
        );
    }
  };

  const handleChangeStatus = (pelamar) => {
    setSelectedPelamar(pelamar);
    setNewStatus(pelamar.status);
    setShowStatusPopup(true);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
        <Typography variant="h2" className="mt-4 text-gray-700">
          Memuat data pelatihan...
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
        <Button onClick={fetchPelatihanData} variant="primary" className="mt-4">
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
          <h1 className="text-2xl font-bold">Kelola Pelatihan</h1>
        </div>

        {/* Filter Section - Semua filter + search + button dempet */}
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
              <option value="Belum Dimulai">Belum Dimulai</option>
              <option value="Sedang berlangsung">Sedang berlangsung</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {/* Filter Post */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              Filter Post:
            </label>
            <select
              value={postStatusFilter}
              onChange={(e) => handlePostStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="Semua">Semua</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama pelatihan..."
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
          {(appliedSearchQuery ||
            statusFilter !== "Semua" ||
            postStatusFilter !== "Semua") && (
            <button
              onClick={handleResetFilter}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200"
            >
              Reset Filter
            </button>
          )}

          {/* Button Tambah */}
          <button
            onClick={() => {
              setShowForm(true);
              setForm({
                nama_pelatihan: "",
                keterangan_pelatihan: "",
                kategori_id: "",
                biaya: "",
                jumlah_kuota: "",
                waktu_pengumpulan: "",
                mentor_id: "",
              });
              setValidationErrors({});
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg rounded transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus size={12} /> Tambah
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Gambar</th>
                <th className="px-4 py-2">Nama Pelatihan</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Instruktur</th>
                <th className="px-4 py-2">Kuota/Terisi</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Post Status</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataPelatihan.length > 0 ? (
                dataPelatihan.map((pelatihan, idx) => (
                  <tr
                    key={pelatihan.id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-2">
                      {pelatihan.foto_pelatihan ? (
                        <div className="relative group">
                          <img
                            src={pelatihan.foto_pelatihan}
                            alt={pelatihan.nama}
                            className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              openImageModal(pelatihan.foto_pelatihan)
                            }
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaEye className="text-white text-sm" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <FaImage className="text-gray-400 text-lg" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{pelatihan.nama}</td>
                    <td className="px-4 py-2">{pelatihan.kategori}</td>
                    <td className="px-4 py-2">{pelatihan.instruktur}</td>
                    <td className="px-4 py-2">{`${pelatihan.jumlah_peserta}/${pelatihan.jumlah_kuota}`}</td>
                    <td className="px-4 py-2">
                      {getTrainingStatusBadge(pelatihan.status)}
                    </td>
                    <td className="px-4 py-2">
                      {getPostStatusBadge(pelatihan.postStatus)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(pelatihan)}
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                          title="Lihat Detail Pelatihan"
                        >
                          <FaSearch />
                        </button>
                        <button
                          onClick={() => handleViewPelamar(pelatihan)}
                          className="text-gray-600 hover:text-purple-500 transition-colors"
                          title="Lihat Pelamar"
                        >
                          <FaUserFriends />
                        </button>
                        {pelatihan.postStatus === "Draft" && (
                          <button
                            onClick={() => handlePublishDraft(pelatihan)}
                            className="text-gray-600 hover:text-green-500 transition-colors"
                            title="Publish Draft"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaExclamationCircle className="text-3xl mb-2 text-gray-400" />
                      <p className="text-sm">
                        {appliedSearchQuery ||
                        statusFilter !== "Semua" ||
                        postStatusFilter !== "Semua"
                          ? "Tidak ada pelatihan yang sesuai dengan pencarian atau filter"
                          : "Belum ada data pelatihan"}
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
                (currentPage - 1) * itemsPerPage + dataPelatihan.length
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

        {/* Form Tambah Pelatihan */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">Tambah Pelatihan</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto pr-1">
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="image_upload">Gambar Pelatihan</Label>
                    <div className="mt-1">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={removeImagePreview}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
                          <p className="text-sm text-gray-500 mb-2">
                            Klik untuk upload gambar
                          </p>
                          <input
                            type="file"
                            id="image_upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="image_upload"
                            className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Pilih Gambar
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Format: JPG, JPEG, PNG, GIF. Maksimal 5MB.
                      </p>
                      {validationErrors.foto_pelatihan && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.foto_pelatihan[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nama_pelatihan">Nama Pelatihan</Label>
                    <InputText
                      type="text"
                      id="nama_pelatihan"
                      name="nama_pelatihan"
                      value={form.nama_pelatihan}
                      onChange={(e) =>
                        setForm({ ...form, nama_pelatihan: e.target.value })
                      }
                      required
                    />
                    {validationErrors.nama_pelatihan && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.nama_pelatihan[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="keterangan_pelatihan">
                      Keterangan Pelatihan
                    </Label>
                    <textarea
                      id="keterangan_pelatihan"
                      name="keterangan_pelatihan"
                      value={form.keterangan_pelatihan}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          keterangan_pelatihan: e.target.value,
                        })
                      }
                      className="w-full p-1 border rounded mt-0.5 text-xs"
                      rows="2"
                      required
                    />
                    {validationErrors.keterangan_pelatihan && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.keterangan_pelatihan[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="kategori_id">Kategori</Label>
                    {loadingKategoriOptions ? (
                      <p className="text-gray-500 text-xs mt-1">
                        Memuat kategori...
                      </p>
                    ) : kategoriOptionsError ? (
                      <p className="text-red-500 text-xs mt-1">
                        {kategoriOptionsError}
                      </p>
                    ) : (
                      <select
                        id="kategori_id"
                        name="kategori_id"
                        value={form.kategori_id}
                        onChange={(e) =>
                          setForm({ ...form, kategori_id: e.target.value })
                        }
                        className="w-full p-1 border rounded mt-0.5 text-xs"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map((kategori) => (
                          <option key={kategori.value} value={kategori.value}>
                            {kategori.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {validationErrors.kategori_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.kategori_id[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="biaya">Biaya</Label>
                    <InputText
                      type="text"
                      id="biaya"
                      name="biaya"
                      value={form.biaya}
                      onChange={(e) =>
                        setForm({ ...form, biaya: e.target.value })
                      }
                      required
                      placeholder="Contoh: Rp. 2.500.000"
                    />
                    {validationErrors.biaya && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.biaya[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="jumlah_kuota">Jumlah Kuota</Label>
                    <InputText
                      type="number"
                      id="jumlah_kuota"
                      name="jumlah_kuota"
                      value={form.jumlah_kuota}
                      onChange={(e) =>
                        setForm({ ...form, jumlah_kuota: e.target.value })
                      }
                      required
                      min="1"
                    />
                    {validationErrors.jumlah_kuota && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.jumlah_kuota[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="waktu_pengumpulan">
                      Waktu Pengumpulan Berkas
                    </Label>
                    <InputText
                      type="datetime-local"
                      id="waktu_pengumpulan"
                      name="waktu_pengumpulan"
                      value={form.waktu_pengumpulan}
                      onChange={(e) =>
                        setForm({ ...form, waktu_pengumpulan: e.target.value })
                      }
                      required
                    />
                    {validationErrors.waktu_pengumpulan && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.waktu_pengumpulan[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="mentor_id">Mentor</Label>
                    {loadingMentorOptions ? (
                      <p className="text-gray-500 text-xs mt-1">
                        Memuat mentor...
                      </p>
                    ) : mentorOptionsError ? (
                      <p className="text-red-500 text-xs mt-1">
                        {mentorOptionsError}
                      </p>
                    ) : (
                      <select
                        id="mentor_id"
                        name="mentor_id"
                        value={form.mentor_id}
                        onChange={(e) =>
                          setForm({ ...form, mentor_id: e.target.value })
                        }
                        className="w-full p-1 border rounded mt-0.5 text-xs"
                        required
                      >
                        <option value="">Pilih Mentor</option>
                        {mentorOptions.map((mentor) => (
                          <option key={mentor.value} value={mentor.value}>
                            {mentor.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {validationErrors.mentor_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.mentor_id[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSubmit("Draft")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                >
                  Simpan sebagai Draft
                </button>
                <button
                  onClick={() => handleSubmit("Published")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                >
                  Posting
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && selectedPelatihan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">Detail Pelatihan</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="space-y-2 mb-3 max-h-80 overflow-y-auto pr-1">
                <div>
                  <Label>Gambar Pelatihan</Label>
                  {isEditing ? (
                    <div className="mt-1">
                      {editImagePreview ? (
                        <div className="relative">
                          <img
                            src={editImagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={removeEditImagePreview}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ) : selectedPelatihan.foto_pelatihan ? (
                        <div className="relative">
                          <img
                            src={selectedPelatihan.foto_pelatihan}
                            alt={selectedPelatihan.nama}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <div className="mt-2">
                            <input
                              type="file"
                              id="edit_image_upload"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="edit_image_upload"
                              className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              Ganti Gambar
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
                          <p className="text-sm text-gray-500 mb-2">
                            Klik untuk upload gambar
                          </p>
                          <input
                            type="file"
                            id="edit_image_upload"
                            accept="image/*"
                            onChange={handleEditImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="edit_image_upload"
                            className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Pilih Gambar
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Format: JPG, JPEG, PNG, GIF. Maksimal 5MB.
                      </p>
                      {validationErrors.foto_pelatihan && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.foto_pelatihan[0]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1">
                      {selectedPelatihan.foto_pelatihan ? (
                        <img
                          src={selectedPelatihan.foto_pelatihan}
                          alt={selectedPelatihan.nama}
                          className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            openImageModal(selectedPelatihan.foto_pelatihan)
                          }
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded border flex items-center justify-center">
                          <div className="text-center">
                            <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
                            <p className="text-sm text-gray-500">
                              Belum ada gambar
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Nama Pelatihan</Label>
                  {isEditing ? (
                    <InputText
                      type="text"
                      value={editedPelatihan.nama}
                      onChange={(e) =>
                        handleInputChange("nama", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.nama}
                    </p>
                  )}
                  {validationErrors.nama && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.nama[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Keterangan Pelatihan</Label>
                  {isEditing ? (
                    <textarea
                      value={editedPelatihan.keterangan}
                      onChange={(e) =>
                        handleInputChange("keterangan", e.target.value)
                      }
                      className="w-full p-1 border rounded mt-0.5 text-xs"
                      rows="2"
                    />
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.keterangan}
                    </p>
                  )}
                  {validationErrors.keterangan && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.keterangan[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Kategori</Label>
                  {isEditing ? (
                    loadingKategoriOptions ? (
                      <p className="text-gray-500 text-xs mt-1">
                        Memuat kategori...
                      </p>
                    ) : kategoriOptionsError ? (
                      <p className="text-red-500 text-xs mt-1">
                        {kategoriOptionsError}
                      </p>
                    ) : (
                      <select
                        value={editedPelatihan.kategori_id}
                        onChange={(e) =>
                          handleInputChange("kategori_id", e.target.value)
                        }
                        className="w-full p-1 border rounded mt-0.5 text-xs"
                      >
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map((kategori) => (
                          <option key={kategori.value} value={kategori.value}>
                            {kategori.label}
                          </option>
                        ))}
                      </select>
                    )
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.kategori}
                    </p>
                  )}
                  {validationErrors.kategori_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.kategori_id[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Biaya</Label>
                  {isEditing ? (
                    <InputText
                      type="text"
                      value={editedPelatihan.biaya}
                      onChange={(e) =>
                        handleInputChange("biaya", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.biaya}
                    </p>
                  )}
                  {validationErrors.biaya && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.biaya[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Jumlah Kuota</Label>
                  {isEditing ? (
                    <InputText
                      type="number"
                      value={editedPelatihan.jumlah_kuota}
                      onChange={(e) =>
                        handleInputChange("jumlah_kuota", e.target.value)
                      }
                      min="1"
                    />
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.jumlah_kuota}
                    </p>
                  )}
                  {validationErrors.jumlah_kuota && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.jumlah_kuota[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Jumlah Peserta Terdaftar</Label>
                  <p className="font-medium text-sm">
                    {selectedPelatihan.jumlah_peserta}
                  </p>
                </div>
                <div>
                  <Label>Waktu Pengumpulan Berkas</Label>
                  {isEditing ? (
                    <InputText
                      type="datetime-local"
                      value={editedPelatihan.waktu_pengumpulan}
                      onChange={(e) =>
                        handleInputChange("waktu_pengumpulan", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.waktu_pengumpulan}
                    </p>
                  )}
                  {validationErrors.waktu_pengumpulan && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.waktu_pengumpulan[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Mentor</Label>
                  {isEditing ? (
                    loadingMentorOptions ? (
                      <p className="text-gray-500 text-xs mt-1">
                        Memuat mentor...
                      </p>
                    ) : mentorOptionsError ? (
                      <p className="text-red-500 text-xs mt-1">
                        {mentorOptionsError}
                      </p>
                    ) : (
                      <select
                        value={editedPelatihan.mentor_id}
                        onChange={(e) =>
                          handleInputChange("mentor_id", e.target.value)
                        }
                        className="w-full p-1 border rounded mt-0.5 text-xs"
                      >
                        <option value="">Pilih Mentor</option>
                        {mentorOptions.map((mentor) => (
                          <option key={mentor.value} value={mentor.value}>
                            {mentor.label}
                          </option>
                        ))}
                      </select>
                    )
                  ) : (
                    <p className="font-medium text-sm">
                      {selectedPelatihan.instruktur}
                    </p>
                  )}
                  {validationErrors.mentor_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.mentor_id[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Status Pelatihan</Label>
                  {isEditing ? (
                    <select
                      value={editedPelatihan.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full p-1 border rounded mt-0.5 text-xs"
                    >
                      <option value="Belum Dimulai">Belum Dimulai</option>
                      <option value="Sedang berlangsung">
                        Sedang berlangsung
                      </option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  ) : (
                    <div className="mt-0.5">
                      {getTrainingStatusBadge(selectedPelatihan.status)}
                    </div>
                  )}
                  {validationErrors.status && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.status[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Post Status</Label>
                  {isEditing ? (
                    <select
                      value={editedPelatihan.postStatus}
                      onChange={(e) =>
                        handleInputChange("postStatus", e.target.value)
                      }
                      className="w-full p-1 border rounded mt-0.5 text-xs"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  ) : (
                    <div className="mt-0.5">
                      {getPostStatusBadge(selectedPelatihan.postStatus)}
                    </div>
                  )}
                  {validationErrors.postStatus && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.postStatus[0]}
                    </p>
                  )}
                </div>
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
                    >
                      <FaSave size={12} /> Simpan
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelete(selectedPelatihan)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 text-xs"
                    >
                      <FaTrashAlt size={12} /> Hapus
                    </button>
                    {selectedPelatihan.postStatus === "Draft" && (
                      <button
                        onClick={() => handlePublishDraft(selectedPelatihan)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 text-xs"
                      >
                        <FaCheck size={12} /> Publish
                      </button>
                    )}
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 text-xs"
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setShowDetail(false)}
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

        {/* Modal Gambar */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[9999]">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              >
                <FaTimes size={20} />
              </button>
              <img
                src={modalImageSrc}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Modal Daftar Pelamar */}
        {showPelamarModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ zIndex: 9000 }}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-3 w-full max-w-5xl mx-auto flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex justify-between items-center mb-2 p-2 border-b">
                <h3 className="text-lg font-semibold">
                  Daftar Pelamar - {selectedPelatihanNama}
                </h3>
                <button
                  onClick={() => setShowPelamarModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {loadingPelamar ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto" />
                  <p className="text-gray-500 mt-2">Memuat daftar pelamar...</p>
                </div>
              ) : selectedPelamarList.length > 0 ? (
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-12">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Telepon
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Tanggal Daftar
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPelamarList.map((pelamar, idx) => (
                        <tr key={pelamar.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {pelamar.nama}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {pelamar.email}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {pelamar.telepon}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {pelamar.tanggalDaftar}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {getStatusBadge(pelamar.status)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                onClick={() => {
                                  setCurrentPelamarDocs(pelamar.dokumen); // Set the docs for the modal
                                  setDocumentListModalOpen(true); // Open the modal
                                }}
                                className={`transition-colors ${
                                  // Check if at least one document URL exists
                                  Object.values(pelamar.dokumen).some(
                                    (doc) => doc
                                  )
                                    ? "text-blue-500 hover:text-blue-700"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                                title={
                                  Object.values(pelamar.dokumen).some(
                                    (doc) => doc
                                  )
                                    ? "Lihat Dokumen"
                                    : "Dokumen tidak tersedia"
                                }
                                disabled={
                                  !Object.values(pelamar.dokumen).some(
                                    (doc) => doc
                                  )
                                }
                              >
                                <FaEye size={16} />
                              </button>
                              <button
                                onClick={() => handleChangeStatus(pelamar)}
                                className="text-yellow-500 hover:text-yellow-700 transition-colors"
                                title="Ubah Status"
                              >
                                <FaEdit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaExclamationCircle className="mx-auto text-gray-400 text-3xl mb-3" />
                  <p className="text-gray-500">
                    Belum ada pelamar untuk pelatihan ini
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-auto pt-3 border-t">
                <button
                  onClick={() => setShowPelamarModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1.5 rounded text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal untuk Preview Dokumen */}
        {showDocumentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Preview Dokumen:{" "}
                  <span className="font-normal">{documentOwnerName}</span>
                </h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FaTimes size={22} />
                </button>
              </div>
              <div className="flex-grow p-2 bg-gray-200">
                <iframe
                  src={documentPreviewUrl}
                  className="w-full h-full border-2 border-gray-300 rounded"
                  title={`Preview Dokumen ${documentOwnerName}`}
                >
                  <p>
                    Browser Anda tidak mendukung pratinjau PDF. Anda bisa{" "}
                    <a
                      href={documentPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      mengunduhnya di sini
                    </a>
                    .
                  </p>
                </iframe>
              </div>
            </div>
          </div>
        )}

        {/* Popup Status Pelamar */}
        {showStatusPopup && selectedPelamar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Ubah Status Pelamar</h3>
                <button
                  onClick={() => setShowStatusPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nama Pelamar:</p>
                  <p className="font-medium text-base">
                    {selectedPelamar.nama}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status Saat Ini:</p>
                  <div className="mb-2">
                    {getStatusBadge(selectedPelamar.status)}
                  </div>
                </div>

                <div>
                  <Label htmlFor="newStatus">Pilih Status Baru:</Label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ditinjau">Ditinjau</option>
                    <option value="diterima">Diterima</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Keterangan:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>
                      • <span className="font-medium">Ditinjau:</span> Status
                      default, sedang dalam proses review
                    </li>
                    <li>
                      • <span className="font-medium">Diterima:</span> Pelamar
                      diterima untuk mengikuti pelatihan
                    </li>
                    <li>
                      • <span className="font-medium">Ditolak:</span> Pelamar
                      tidak memenuhi syarat pelatihan
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowStatusPopup(false)}
                  className="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm inline-flex items-center gap-1 transition-colors"
                  disabled={savingStatus}
                >
                  {savingStatus ? (
                    <>
                      <FaSpinner size={12} className="animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaCheck size={12} /> Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {isDocumentListModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  Dokumen Pelamar
                </h3>
                <button
                  onClick={() => setDocumentListModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {/* KTP - Changed from <a> to <button> */}
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700">Foto KTP</span>
                  {currentPelamarDocs.ktp ? (
                    <button
                      onClick={() => handleViewDocument(currentPelamarDocs.ktp)}
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Lihat
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Tidak Ada</span>
                  )}
                </div>

                {/* KK - Changed from <a> to <button> */}
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Kartu Keluarga (KK)
                  </span>
                  {currentPelamarDocs.kk ? (
                    <button
                      onClick={() => handleViewDocument(currentPelamarDocs.kk)}
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Lihat
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Tidak Ada</span>
                  )}
                </div>

                {/* Ijazah - Changed from <a> to <button> */}
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700">Ijazah</span>
                  {currentPelamarDocs.ijazah ? (
                    <button
                      onClick={() =>
                        handleViewDocument(currentPelamarDocs.ijazah)
                      }
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Lihat
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Tidak Ada</span>
                  )}
                </div>

                {/* Foto - Changed from <a> to <button> */}
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700">Pas Foto</span>
                  {currentPelamarDocs.foto ? (
                    <button
                      onClick={() =>
                        handleViewDocument(currentPelamarDocs.foto)
                      }
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Lihat
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Tidak Ada</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setDocumentListModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPelatihanPage;
