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

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));

    // Gunakan validasi file yang diperbaiki
    if (name === "ktp") {
      await validateFileIntegrity(file, setKtpError, "KTP");
    } else if (name === "kk") {
      await validateFileIntegrity(file, setKkError, "KK");
    } else if (name === "ijazah") {
      await validateFileIntegrity(file, setIjazahError, "Ijazah");
    } else if (name === "photo") {
      await validateFileIntegrity(file, setPhotoError, "Pas Foto");
    }
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
    const isJenisKelaminValid = validateJenisKelamin(formData.jenisKelamin);
    const isTanggalLahirValid = validateTanggalLahir(formData.tanggalLahir);
    
    // Validasi file dengan integrity check
    const isKtpValid = await validateFileIntegrity(formData.ktp, setKtpError, "KTP");
    const isKkValid = await validateFileIntegrity(formData.kk, setKkError, "KK");
    const isIjazahValid = await validateFileIntegrity(formData.ijazah, setIjazahError, "Ijazah");
    const isPhotoValid = await validateFileIntegrity(formData.photo, setPhotoError, "Pas Foto");

    if (!isNamaValid || !isNoTelpValid || !isEmailValid || !isNikValid || !isPendidikanValid || !isAlamatValid ||
        !isJenisKelaminValid || !isTanggalLahirValid ||
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
  );
};

export default DaftarPage;