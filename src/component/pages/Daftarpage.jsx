import React, { useState, useEffect } from "react";
import axios from "axios"; // Tidak perlu axios jika sudah ada api.js
import InputWithLabel from "../Elements/Input/index";
import Button from "../Elements/Button/index";
import { useParams, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../services/api"; 

// Modal Component
const Modal = ({ isOpen, onClose, onConfirm, title, message, type = "confirm" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          {type === "confirm" && (
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          )}
          {type === "success" && (
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {type === "error" && (
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          {type === "info" && (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>
        
        <div className="flex justify-end space-x-3">
          {type === "confirm" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ya, Lanjutkan
              </button>
            </>
          )}
          {(type === "success" || type === "error" || type === "info") && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DaftarPage = () => {
  const { id: pelatihanId } = useParams();
  const navigate = useNavigate();

  // Initial form data state
  const initialFormData = {
    nama: "",
    noTelp: "",
    email: "",
    nik: "",
    pendidikan: "", // Ini akan menjadi pendidikan_id
    alamat: "",
    jenisKelamin: "", // Tambahkan jenis kelamin
    tanggalLahir: "", // Tambahkan tanggal lahir
    ktp: null,
    kk: null,
    ijazah: null,
    photo: null, // Ini untuk pas foto
    pelatihan_id: pelatihanId,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPelatihan, setLoadingPelatihan] = useState(true);
  const [namaPelatihan, setNamaPelatihan] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    onConfirm: null
  });

  // State untuk error validasi
  const [nikError, setNikError] = useState(null);
  const [noTelpError, setNoTelpError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [pendidikanError, setPendidikanError] = useState(null);
  const [alamatError, setAlamatError] = useState(null);
  const [namaError, setNamaError] = useState(null);
  const [jenisKelaminError, setJenisKelaminError] = useState(null); // Error untuk jenis kelamin
  const [tanggalLahirError, setTanggalLahirError] = useState(null); // Error untuk tanggal lahir
  const [ktpError, setKtpError] = useState(null);
  const [kkError, setKkError] = useState(null);
  const [ijazahError, setIjazahError] = useState(null);
  const [photoError, setPhotoError] = useState(null); // Error untuk pas foto

  const [pendidikanOptions, setPendidikanOptions] = useState([]); // Untuk dropdown pendidikan

  // Function to reset all form data and errors
  const resetForm = () => {
    setFormData({...initialFormData, pelatihan_id: pelatihanId});
    
    // Reset all errors
    setNikError(null);
    setNoTelpError(null);
    setEmailError(null);
    setPendidikanError(null);
    setAlamatError(null);
    setNamaError(null);
    setJenisKelaminError(null);
    setTanggalLahirError(null);
    setKtpError(null);
    setKkError(null);
    setIjazahError(null);
    setPhotoError(null);
    setError(null);

    // Reset file inputs manually
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
  };

  // Modal helper functions
  const showModal = (type, title, message, onConfirm = null) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  // --- Fungsi Validasi ---
  const validateNik = (nik) => {
    const nikRegex = /^[0-9]{16}$/;
    if (!nik) {
      setNikError("NIK tidak boleh kosong.");
      return false;
    }
    if (nik.length < 16) {
      setNikError("NIK minimal 16 karakter.");
      return false;
    }
    if (nik.length > 16) {
      setNikError("NIK maksimal 16 karakter.");
      return false;
    }
    if (!nikRegex.test(nik)) {
      setNikError("NIK harus 16 digit angka.");
      return false;
    }
    setNikError(null);
    return true;
  };

  const validateNoTelp = (noTelp) => {
    const phoneRegex = /^[0-9]+$/;
    if (!noTelp) { setNoTelpError("No. Telepon tidak boleh kosong."); return false; }
    if (!phoneRegex.test(noTelp)) { setNoTelpError("No. Telepon hanya boleh angka."); return false; }
    if (noTelp.length < 8 || noTelp.length > 15) { setNoTelpError("No. Telepon harus 8-15 digit."); return false; }
    setNoTelpError(null); return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { setEmailError("Email tidak boleh kosong."); return false; }
    if (!emailRegex.test(email)) { setEmailError("Format email tidak valid."); return false; }
    setEmailError(null); return true;
  };

  const validatePendidikan = (pendidikan) => {
    if (!pendidikan || pendidikan === "") { setPendidikanError("Pendidikan tidak boleh kosong."); return false; }
    setPendidikanError(null); return true;
  };

  const validateAlamat = (alamat) => {
    if (!alamat.trim()) { setAlamatError("Alamat tidak boleh kosong."); return false; }
    setAlamatError(null); return true;
  };

  const validateNama = (nama) => {
    if (!nama.trim()) { setNamaError("Nama tidak boleh kosong."); return false; }
    setNamaError(null); return true;
  };

  const validateJenisKelamin = (jenisKelamin) => {
    if (!jenisKelamin || jenisKelamin === "") { setJenisKelaminError("Jenis Kelamin tidak boleh kosong."); return false; }
    setJenisKelaminError(null); return true;
  };

  const validateTanggalLahir = (tanggalLahir) => {
    if (!tanggalLahir) { setTanggalLahirError("Tanggal Lahir tidak boleh kosong."); return false; }
    setTanggalLahirError(null); return true;
  };

  // PERBAIKAN: Validasi file hanya untuk PDF dan batas 5MB
  const validateFile = (file, setErrorFunc, fieldName) => {
    if (!file) { 
      setErrorFunc(`${fieldName} tidak boleh kosong.`); 
      return false; 
    }
    
    // Hanya menerima PDF
    if (file.type !== 'application/pdf') { 
      setErrorFunc(`Format file ${fieldName} tidak valid (harus PDF)`); 
      return false; 
    }
    
    // Batas ukuran 5MB (bukan 2MB)
    if (file.size > 5 * 1024 * 1024) { 
      setErrorFunc(`Ukuran file ${fieldName} melebihi batas (maksimal 5MB)`); 
      return false; 
    }
    
    setErrorFunc(null); 
    return true;
  };

  // Validasi khusus untuk file yang rusak/tidak dapat dibaca
  const validateFileIntegrity = (file, setErrorFunc, fieldName) => {
    return new Promise((resolve) => {
      if (!file) {
        setErrorFunc(`${fieldName} tidak boleh kosong.`);
        resolve(false);
        return;
      }

      // Cek ekstensi file
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.pdf')) {
        setErrorFunc(`Format file ${fieldName} tidak valid (harus PDF)`);
        resolve(false);
        return;
      }

      // Cek MIME type
      if (file.type !== 'application/pdf') {
        setErrorFunc(`File yang di upload tidak sesuai`);
        resolve(false);
        return;
      }

      // Cek ukuran file
      if (file.size > 5 * 1024 * 1024) {
        setErrorFunc(`Ukuran file ${fieldName} melebihi batas (maksimal 5MB)`);
        resolve(false);
        return;
      }

      // Cek jika file kosong atau rusak
      if (file.size === 0) {
        setErrorFunc(`File ${fieldName} rusak atau tidak dapat dibaca`);
        resolve(false);
        return;
      }

      // Coba baca header PDF untuk memastikan file valid
      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4));
        const header = String.fromCharCode.apply(null, uint8Array);
        
        if (header !== '%PDF') {
          setErrorFunc(`File ${fieldName} rusak atau tidak dapat dibaca`);
          resolve(false);
        } else {
          setErrorFunc(null);
          resolve(true);
        }
      };
      
      reader.onerror = function() {
        setErrorFunc(`Gagal mengunggah file`);
        resolve(false);
      };
      
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };
  // --- Akhir Fungsi Validasi ---

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoadingProfile(true);
      const storedToken = localStorage.getItem("jwt");
      
      if (storedToken) {
        setIsLoggedIn(true);
        setAuthToken(storedToken);
        try {
          // Mengambil profil user DAN relasi peserta serta pendidikan
          const response = await api.get("/user");
          // console.log("API /user response (DaftarPage):", response.data); // Log response untuk debugging
          if (response.data && response.data.user) {
            const user = response.data.user;
            const peserta = response.data.user.peserta;

            setFormData(prev => ({
              ...prev,
              nama: user.name || "",
              email: user.email || "",
              noTelp: peserta?.nomor_telp || "",
              nik: peserta?.nik_peserta || "",
              pendidikan: peserta?.pendidikan_id || "", // Gunakan pendidikan_id
              alamat: peserta?.alamat_peserta || "",
              jenisKelamin: peserta?.jenis_kelamin || "", // Set jenis kelamin
              tanggalLahir: peserta?.tanggal_lahir || "", // Set tanggal lahir
            }));

            // Validasi awal untuk field yang terisi otomatis
            validateNama(user.name || "");
            validateEmail(user.email || "");
            if (peserta) { // Hanya validasi jika peserta ada
              validateNoTelp(peserta.nomor_telp || "");
              validateNik(peserta.nik_peserta || "");
              validatePendidikan(peserta.pendidikan_id || "");
              validateAlamat(peserta.alamat_peserta || "");
              validateJenisKelamin(peserta.jenis_kelamin || "");
              validateTanggalLahir(peserta.tanggal_lahir || "");
            }

            // Show info modal for logged in users
            showModal("info", "Informasi", 
              `Selamat datang, ${user.name}!\n\nData pribadi Anda telah terisi otomatis berdasarkan profil yang tersimpan. Silakan periksa dan lengkapi informasi yang masih kosong, kemudian unggah dokumen yang diperlukan.`);
            
          } else {
            console.warn("User data tidak lengkap dari API /user atau profil peserta tidak ditemukan.");
            // Jika user tidak punya profil peserta, form akan kosong
          }
        } catch (err) {
          console.error("Gagal memuat profil user:", err);
          // Jika terjadi error (misal token expired), form akan kosong
          showModal("error", "Error", "Gagal memuat data profil. Silakan periksa koneksi internet Anda atau login ulang.");
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setIsLoggedIn(false);
        setLoadingProfile(false);
        console.log("Tidak ada token, pengguna perlu mengisi manual.");
        
        // Show info modal for non-logged in users
        showModal("info", "Perhatian", 
          "Anda belum login ke sistem.\n\nSilakan isi semua data secara manual dan lengkapi dokumen yang diperlukan. Pastikan semua informasi yang Anda masukkan sudah benar.");
      }
    };

    const fetchNamaPelatihan = async () => {
      if (!pelatihanId) {
        console.warn("ID pelatihan tidak ditemukan di URL DaftarPage.");
        setLoadingPelatihan(false);
        showModal("error", "Error", "ID Pelatihan tidak ditemukan. Silakan kembali ke halaman daftar pelatihan.");
        return;
      }
      try {
        setLoadingPelatihan(true);
        const response = await api.get(`/pelatihan/${pelatihanId}`);
        // console.log("Respons API Detail Pelatihan (di DaftarPage):", response);

        if (response.data && response.data.data && response.data.data.nama_pelatihan) {
          setNamaPelatihan(response.data.data.nama_pelatihan);
        } else {
          setNamaPelatihan("Nama Pelatihan Tidak Ditemukan");
          console.warn("Response API detail pelatihan tidak memiliki nama_pelatihan di response.data.data:", response);
          showModal("error", "Error", "Data pelatihan tidak dapat dimuat dengan lengkap.");
        }
      } catch (err) {
        console.error("Gagal memuat nama pelatihan:", err);
        setNamaPelatihan("Gagal Memuat Nama Pelatihan");
        showModal("error", "Error", "Gagal memuat informasi pelatihan. Silakan coba lagi atau hubungi administrator.");
      } finally {
        setLoadingPelatihan(false);
      }
    };

    const fetchPendidikanOptions = async () => {
      try {
        const response = await api.get("/pendidikan"); // Asumsi ada endpoint /pendidikan
        if (response.data && Array.isArray(response.data.data)) {
          setPendidikanOptions(response.data.data.map(p => ({ value: p.id, label: p.nama_pendidikan })));
        } else if (response.data && Array.isArray(response.data)) {
          setPendidikanOptions(response.data.map(p => ({ value: p.id, label: p.nama_pendidikan })));
        } else {
          console.warn("Unexpected data format for pendidikan options:", response);
          showModal("error", "Error", "Gagal memuat data pendidikan. Beberapa fitur mungkin tidak berfungsi dengan baik.");
        }
      } catch (err) {
        console.error("Failed to fetch pendidikan options:", err);
        showModal("error", "Error", "Gagal memuat opsi pendidikan. Silakan refresh halaman atau hubungi administrator.");
      }
    };

    loadUserProfile();
    fetchNamaPelatihan();
    fetchPendidikanOptions(); // Panggil fetch pendidikan
  }, [pelatihanId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nama") validateNama(value);
    else if (name === "noTelp") validateNoTelp(value);
    else if (name === "email") validateEmail(value);
    else if (name === "nik") validateNik(value);
    else if (name === "pendidikan") validatePendidikan(value);
    else if (name === "alamat") validateAlamat(value);
    else if (name === "jenisKelamin") validateJenisKelamin(value); // Validasi jenis kelamin
    else if (name === "tanggalLahir") validateTanggalLahir(value); // Validasi tanggal lahir
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));

    // Show info about file upload
    // if (file) {
    //   showModal("info", "File Upload", 
    //     `File "${file.name}" berhasil dipilih.\n\nUkuran: ${(file.size / 1024 / 1024).toFixed(2)} MB\nTipe: ${file.type}`);
    // }

    // Gunakan validasi file yang diperbaiki
    if (name === "ktp") {
      const isValid = await validateFileIntegrity(file, setKtpError, "KTP");
      if (!isValid && file) {
        showModal("error", "File KTP Error", `File KTP yang Anda pilih tidak valid. ${ktpError}`);
      }
    } else if (name === "kk") {
      const isValid = await validateFileIntegrity(file, setKkError, "KK");
      if (!isValid && file) {
        showModal("error", "File KK Error", `File KK yang Anda pilih tidak valid. ${kkError}`);
      }
    } else if (name === "ijazah") {
      const isValid = await validateFileIntegrity(file, setIjazahError, "Ijazah");
      if (!isValid && file) {
        showModal("error", "File Ijazah Error", `File Ijazah yang Anda pilih tidak valid. ${ijazahError}`);
      }
    } else if (name === "photo") {
      const isValid = await validateFileIntegrity(file, setPhotoError, "Pas Foto");
      if (!isValid && file) {
        showModal("error", "File Pas Foto Error", `File Pas Foto yang Anda pilih tidak valid. ${photoError}`);
      }
    }
  };

  const processPendaftaran = async () => {
    setError(null);

    // --- Validasi Semua Field ---
    const isNamaValid = validateNama(formData.nama);
    const isNoTelpValid = validateNoTelp(formData.noTelp);
    const isEmailValid = validateEmail(formData.email);
    const isNikValid = validateNik(formData.nik);
    const isPendidikanValid = validatePendidikan(formData.pendidikan);
    const isAlamatValid = validateAlamat(formData.alamat);
    const isJenisKelaminValid = validateJenisKelamin(formData.jenisKelamin);
    const isTanggalLahirValid = validateTanggalLahir(formData.tanggalLahir);
    
    // Validasi file dengan integrity check
    const isKtpValid = await validateFileIntegrity(formData.ktp, setKtpError, "KTP");
    const isKkValid = await validateFileIntegrity(formData.kk, setKkError, "KK");
    const isIjazahValid = await validateFileIntegrity(formData.ijazah, setIjazahError, "Ijazah");
    const isPhotoValid = await validateFileIntegrity(formData.photo, setPhotoError, "Pas Foto");

    // if (!isNamaValid || !isNoTelpValid || !isEmailValid || !isNikValid || !isPendidikanValid || !isAlamatValid ||
    //     !isJenisKelaminValid || !isTanggalLahirValid ||
    //     !isKtpValid || !isKkValid || !isIjazahValid || !isPhotoValid) {
      
    //   showModal("error", "Validasi Gagal", "Mohon lengkapi semua data dan perbaiki kesalahan validasi sebelum melanjutkan pendaftaran.");
    //   return;
    // }
    // --- Akhir Validasi ---

    const form = new FormData();
    form.append('pelatihan_id', formData.pelatihan_id);

    form.append('name', formData.nama); // 'name' untuk user
    form.append('email', formData.email); // 'email' untuk user
    form.append('nomor_telp', formData.noTelp); // untuk peserta
    form.append('nik', formData.nik); // untuk peserta
    form.append('pendidikan_id', formData.pendidikan); // untuk peserta
    form.append('alamat_peserta', formData.alamat); // untuk peserta
    form.append('jenis_kelamin', formData.jenisKelamin); // Tambahkan jenis kelamin untuk peserta
    form.append('tanggal_lahir', formData.tanggalLahir); // Tambahkan tanggal lahir untuk peserta

    if (formData.ktp) form.append('ktp', formData.ktp);
    if (formData.kk) form.append('kk', formData.kk);
    if (formData.ijazah) form.append('ijazah', formData.ijazah);
    if (formData.photo) form.append('foto', formData.photo); // Field 'foto' di backend untuk pas foto

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("handleSubmit: Token JWT tidak ditemukan di localStorage!");
        showModal("error", "Error Autentikasi", "Anda belum login atau sesi kadaluarsa. Silakan login kembali untuk melanjutkan pendaftaran.");
        return;
      }
      setAuthToken(token); // Atur token untuk request ini

      const response = await api.post("/daftar-pelatihan", form, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      });

      // Reset form setelah berhasil mendaftar
      resetForm();

      showModal("success", "Pendaftaran Berhasil!", 
        `Selamat! Pendaftaran Anda untuk pelatihan "${namaPelatihan}" telah berhasil disubmit.\n\nStatus: Menunggu tinjauan admin.\n\nForm telah direset dan siap untuk pendaftaran berikutnya.`,
      );

    } catch (error) {
      console.error("Gagal mendaftar:", error);
      let errorMessage = "Terjadi kesalahan saat mendaftar.";
      if (error.response && error.response.data && error.response.data.errors) {
        // Error validasi dari Laravel
        errorMessage = "Validasi gagal:\n";
        for (const key in error.response.data.errors) {
          // Sesuaikan key error dengan nama field di frontend
          const fieldName = {
              'pelatihan_id': 'Pelatihan', 'nik': 'NIK', 'ktp': 'KTP', 'kk': 'KK',
              'ijazah': 'Ijazah', 'foto': 'Pas Foto', 'name': 'Nama', 'email': 'Email',
              'nomor_telp': 'No. Telepon', 'pendidikan_id': 'Pendidikan', 'alamat_peserta': 'Alamat',
              'jenis_kelamin': 'Jenis Kelamin', 'tanggal_lahir': 'Tanggal Lahir'
          }[key] || key; // Gunakan key asli jika tidak ada mapping
          errorMessage += `- ${fieldName}: ${error.response.data.errors[key].join(', ')}\n`;
        }
      } else if (error.response && error.response.data && error.response.data.message) {
        // Pesan error umum dari Laravel (misal kuota penuh, sudah terdaftar)
        errorMessage = error.response.data.message;
      }
      
      showModal("error", "Pendaftaran Gagal", errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Hanya tampilkan konfirmasi jika user belum login
    if (!isLoggedIn) {
      showModal("confirm", "Konfirmasi Pendaftaran", 
        `Apakah Anda yakin ingin mendaftar pelatihan "${namaPelatihan}"?\n\nPastikan semua data yang Anda masukkan sudah benar karena data ini akan digunakan untuk proses seleksi.`,
        processPendaftaran
      );
    } else {
      // Langsung proses jika sudah login
      await processPendaftaran();
    }
  };

  if (loadingProfile || loadingPelatihan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Formulir Pendaftaran Pelatihan
          </h2>

          {pelatihanId && namaPelatihan && (
            <p className="text-center text-lg font-medium text-blue-700 mb-4">
              Mendaftar untuk: <span className="font-semibold">{namaPelatihan}</span>
            </p>
          )}
          {pelatihanId && !namaPelatihan && !loadingPelatihan && (
              <p className="text-center text-lg font-medium text-red-700 mb-4">
                  Nama Pelatihan tidak dapat dimuat.
              </p>
          )}
          
          {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-4 text-sm whitespace-pre-wrap">
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Baris Pertama */}
              <InputWithLabel
                label="NIK"
                type="text"
                name="nik"
                placeholder="Masukkan NIK (16 digit)"
                value={formData.nik}
                onChange={handleChange}
                error={nikError}
              />
              <InputWithLabel
                label="No. Telepon"
                type="text"
                name="noTelp"
                placeholder="Masukkan No. Telepon"
                value={formData.noTelp}
                onChange={handleChange}
                error={noTelpError}
              />
              <InputWithLabel
                label="Email"
                type="email"
                name="email"
                placeholder="Masukkan Email"
                value={formData.email}
                onChange={handleChange}
                error={emailError}
              />
              
              {/* Baris Kedua */}
              <InputWithLabel
                label="Nama Lengkap"
                type="text"
                name="nama"
                placeholder="Masukkan Nama Lengkap"
                value={formData.nama}
                onChange={handleChange}
                error={namaError}
              />
              <InputWithLabel
                label="Tanggal Lahir"
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                error={tanggalLahirError}
              />
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                <textarea
                  name="alamat"
                  placeholder="Masukkan Alamat Lengkap"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-vertical ${alamatError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {alamatError && <p className="mt-1 text-sm text-red-600">{alamatError}</p>}
              </div>
              
              {/* Baris Ketiga */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                <select
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${jenisKelaminError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                {jenisKelaminError && <p className="mt-1 text-sm text-red-600">{jenisKelaminError}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Pendidikan Terakhir</label>
                <select
                  name="pendidikan"
                  value={formData.pendidikan}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${pendidikanError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                >
                  <option value="">Pilih Pendidikan</option>
                  {pendidikanOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {pendidikanError && <p className="mt-1 text-sm text-red-600">{pendidikanError}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Unggah KTP <span className="text-gray-500 text-sm">(PDF, maksimal 5MB)</span></label>
                <input
                  type="file"
                  name="ktp"
                  onChange={handleFileChange}
                  className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${ktpError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                  accept=".pdf"
                />
                {ktpError && <p className="mt-1 text-sm text-red-600">{ktpError}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Unggah KK <span className="text-gray-500 text-sm">(PDF, maksimal 5MB)</span></label>
                <input
                  type="file"
                  name="kk"
                  onChange={handleFileChange}
                  className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${kkError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                  accept=".pdf"
                />
                {kkError && <p className="mt-1 text-sm text-red-600">{kkError}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Unggah Ijazah Terakhir <span className="text-gray-500 text-sm">(PDF, maksimal 5MB)</span></label>
                <input
                  type="file"
                  name="ijazah"
                  onChange={handleFileChange}
                  className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${ijazahError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                  accept=".pdf"
                />
                {ijazahError && <p className="mt-1 text-sm text-red-600">{ijazahError}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Unggah Pas Foto <span className="text-gray-500 text-sm">(PDF, maksimal 5MB)</span></label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${photoError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                  accept=".pdf"
                />
                {photoError && <p className="mt-1 text-sm text-red-600">{photoError}</p>}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button type="submit" size="md" variant="primary" style={{ width: "385px", height: "49px" }}>
                Daftar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
};

export default DaftarPage;