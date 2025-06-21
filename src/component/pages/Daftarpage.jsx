// src/components/Fragments/DaftarPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // Tidak perlu axios jika sudah ada api.js
import InputWithLabel from "../Elements/Input/index";
import Button from "../Elements/Button/index";
import { useParams, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../services/api"; // Sesuaikan path

const DaftarPage = () => {
  const { id: pelatihanId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPelatihan, setLoadingPelatihan] = useState(true);
  const [namaPelatihan, setNamaPelatihan] = useState("");
  const [error, setError] = useState(null);

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

  // --- Fungsi Validasi ---
  const validateNik = (nik) => {
    const nikRegex = /^[0-9]{16}$/;
    if (!nik) { setNikError("NIK tidak boleh kosong."); return false; }
    if (!nikRegex.test(nik)) { setNikError("NIK harus 16 digit angka."); return false; }
    setNikError(null); return true;
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
    // Anda bisa tambahkan validasi format tanggal lebih lanjut jika diperlukan
    setTanggalLahirError(null); return true;
  };

  const validateFile = (file, setErrorFunc, fieldName) => {
    if (!file) { setErrorFunc(`${fieldName} tidak boleh kosong.`); return false; }
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) { setErrorFunc(`Format ${fieldName} tidak valid (JPG, PNG, PDF).`); return false; }
    if (file.size > 2 * 1024 * 1024) { setErrorFunc(`${fieldName} maksimal 2MB.`); return false; }
    setErrorFunc(null); return true;
  };
  // --- Akhir Fungsi Validasi ---

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoadingProfile(true);
      const storedToken = localStorage.getItem("jwt");
      if (storedToken) {
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
          } else {
            console.warn("User data tidak lengkap dari API /user atau profil peserta tidak ditemukan.");
            // Jika user tidak punya profil peserta, form akan kosong
          }
        } catch (err) {
          console.error("Gagal memuat profil user:", err);
          // Jika terjadi error (misal token expired), form akan kosong
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
        console.log("Tidak ada token, pengguna perlu mengisi manual.");
      }
    };

    const fetchNamaPelatihan = async () => {
      if (!pelatihanId) {
        console.warn("ID pelatihan tidak ditemukan di URL DaftarPage.");
        setLoadingPelatihan(false);
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
        }
      } catch (err) {
        console.error("Gagal memuat nama pelatihan:", err);
        setNamaPelatihan("Gagal Memuat Nama Pelatihan");
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
        }
      } catch (err) {
        console.error("Failed to fetch pendidikan options:", err);
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));

    if (name === "ktp") validateFile(file, setKtpError, "KTP");
    else if (name === "kk") validateFile(file, setKkError, "KK");
    else if (name === "ijazah") validateFile(file, setIjazahError, "Ijazah");
    else if (name === "photo") validateFile(file, setPhotoError, "Pas Foto"); // Ubah fieldName menjadi Pas Foto
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Validasi Semua Field ---
    const isNamaValid = validateNama(formData.nama);
    const isNoTelpValid = validateNoTelp(formData.noTelp);
    const isEmailValid = validateEmail(formData.email);
    const isNikValid = validateNik(formData.nik);
    const isPendidikanValid = validatePendidikan(formData.pendidikan);
    const isAlamatValid = validateAlamat(formData.alamat);
    const isJenisKelaminValid = validateJenisKelamin(formData.jenisKelamin); // Validasi jenis kelamin
    const isTanggalLahirValid = validateTanggalLahir(formData.tanggalLahir); // Validasi tanggal lahir
    const isKtpValid = validateFile(formData.ktp, setKtpError, "KTP");
    const isKkValid = validateFile(formData.kk, setKkError, "KK");
    const isIjazahValid = validateFile(formData.ijazah, setIjazahError, "Ijazah");
    const isPhotoValid = validateFile(formData.photo, setPhotoError, "Pas Foto");

    if (!isNamaValid || !isNoTelpValid || !isEmailValid || !isNikValid || !isPendidikanValid || !isAlamatValid ||
        !isJenisKelaminValid || !isTanggalLahirValid || // Tambahkan validasi jenis kelamin & tanggal lahir
        !isKtpValid || !isKkValid || !isIjazahValid || !isPhotoValid) {
      setError("Mohon lengkapi semua data dan perbaiki kesalahan validasi.");
      return;
    }
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
      // console.log("handleSubmit: Token JWT yang akan digunakan:", token); // Debugging
      if (!token) {
        console.error("handleSubmit: Token JWT tidak ditemukan di localStorage!");
        setError("Anda belum login atau sesi kadaluarsa. Silakan login kembali.");
        return;
      }
      setAuthToken(token); // Atur token untuk request ini

      const response = await api.post("/daftar-pelatihan", form, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      });

      alert("Pendaftaran berhasil! Menunggu tinjauan admin.");
      navigate("/profil"); // Arahkan ke halaman profil setelah daftar berhasil
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
      setError(errorMessage);
    }
  };

  if (loadingProfile || loadingPelatihan) {
    return <div className="text-center mt-10 text-gray-600">Memuat data...</div>;
  }

  return (
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
            <InputWithLabel
              label="NIK"
              type="text"
              name="nik"
              placeholder="Masukkan NIK (16 digit)"
              value={formData.nik}
              onChange={handleChange}
              error={nikError}
            />
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
            <InputWithLabel
              label="Alamat Lengkap"
              type="text"
              name="alamat"
              placeholder="Masukkan Alamat Lengkap"
              value={formData.alamat}
              onChange={handleChange}
              error={alamatError}
            />
            {/* --- PERBAIKAN DI SINI: Tambahkan Jenis Kelamin dan Tanggal Lahir --- */}
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
            <InputWithLabel
              label="Tanggal Lahir"
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              error={tanggalLahirError}
            />
            {/* --- Akhir Perbaikan Jenis Kelamin dan Tanggal Lahir --- */}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Unggah KTP <span className="text-gray-500 text-sm">(JPG, PNG, atau PDF, maks 2MB)</span></label>
              <input
                type="file"
                name="ktp"
                onChange={handleFileChange}
                className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${ktpError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              {ktpError && <p className="mt-1 text-sm text-red-600">{ktpError}</p>}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Unggah KK <span className="text-gray-500 text-sm">(JPG, PNG, atau PDF, maks 2MB)</span></label>
              <input
                type="file"
                name="kk"
                onChange={handleFileChange}
                className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${kkError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              {kkError && <p className="mt-1 text-sm text-red-600">{kkError}</p>}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Unggah Ijazah Terakhir <span className="text-gray-500 text-sm">(JPG, PNG, atau PDF, maks 2MB)</span></label>
              <input
                type="file"
                name="ijazah"
                onChange={handleFileChange}
                className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${ijazahError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              {ijazahError && <p className="mt-1 text-sm text-red-600">{ijazahError}</p>}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Unggah Pas Foto <span className="text-gray-500 text-sm">(JPG, PNG, atau PDF, maks 2MB)</span></label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                className={`w-full border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${photoError ? 'border-red-500 file:bg-red-100 file:text-red-700' : 'border-gray-300 file:bg-blue-100 file:text-blue-700'} hover:file:bg-blue-200`}
                accept=".jpg,.jpeg,.png,.pdf"
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
  );
};

export default DaftarPage;