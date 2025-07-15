import React, { useState, useEffect } from "react";
import InputWithLabel from "../Elements/Input/index";
import Button from "../Elements/Button/index";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import api, { fetchData, updateData } from "../../services/api";
import { setAuthToken } from "../../services/api";

const EditProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nomor_telp: "",
  });

  // State untuk password
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirmation: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nomorTelpError, setNomorTelpError] = useState(null);

  // State untuk validasi password
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [pesertaId, setPesertaId] = useState(null);

  const [isVerified, setIsVerified] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [isPasswordFormValid, setIsPasswordFormValid] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email tidak boleh kosong.";
    }
    if (!emailRegex.test(email)) {
      return "Format email tidak valid.";
    }
    return null;
  };

  const validateNomorTelp = (nomorTelp) => {
    const cleanedNomorTelp = nomorTelp.replace(/[\s-]/g, "").trim();
    const phoneRegex = /^[0-9]+$/;

    if (!cleanedNomorTelp) {
      return "Nomor telepon tidak boleh kosong.";
    }
    if (!phoneRegex.test(cleanedNomorTelp)) {
      return "Nomor telepon hanya boleh mengandung angka.";
    }
    if (cleanedNomorTelp.length < 8 || cleanedNomorTelp.length > 15) {
      return "Nomor telepon harus antara 8 dan 15 digit.";
    }
    return null;
  };

  const validateName = (name) => {
    if (!name.trim()) {
      return "Nama tidak boleh kosong.";
    }
    return null;
  };

  const validateCurrentPassword = (password) => {
    if (!password) return "Password saat ini tidak boleh kosong.";
    return null; // Tambahkan logika validasi Anda di sini jika perlu
  };

  const validateNewPassword = (password) => {
    if (!password) return "Password baru tidak boleh kosong.";
    if (password.length < 8) return "Password baru minimal 8 karakter.";
    
    // Validasi kompleksitas password (opsional - sesuai dengan ketentuan password)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber)) {
      return "Password harus mengandung huruf besar, huruf kecil, dan angka.";
    }
    
    return null;
  };

  const validateConfirmPassword = (confirmPassword, newPassword) => {
    if (!confirmPassword) return "Konfirmasi password tidak boleh kosong.";
    if (confirmPassword !== newPassword)
      return "Konfirmasi password tidak cocok.";
    return null;
  };

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setError(null);
      const storedToken = localStorage.getItem("jwt");
      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        console.log("EditProfileForm: Tidak ada token, mengarahkan ke login.");
        navigate("/login");
        return;
      }

      setAuthToken(storedToken);

      try {
        let currentUserData = null;
        if (storedUser) {
          try {
            currentUserData = JSON.parse(storedUser);
            console.log(
              "EditProfileForm: Data pengguna dimuat dari localStorage:",
              currentUserData
            );
          } catch (e) {
            console.error("Gagal mengurai data pengguna dari localStorage:", e);
            setError("Data pengguna rusak di penyimpanan lokal.");
            localStorage.removeItem("user");
          }
        }

        if (!currentUserData) {
          console.log(
            "EditProfileForm: Data pengguna tidak ada di localStorage atau rusak, mencoba ambil dari API /user."
          );
          const response = await fetchData("/user");
          if (response && response.data) {
            currentUserData = response.data;
            localStorage.setItem("user", JSON.stringify(currentUserData));
            console.log(
              "EditProfileForm: Data pengguna dimuat dari API /user:",
              currentUserData
            );
          } else {
            setError("Gagal memuat data pengguna dari API.");
            navigate("/login");
            return;
          }
        }

        if (currentUserData) {
          const initialFormData = {
            name: currentUserData.name || "",
            email: currentUserData.email || "",
            nomor_telp: "",
          };

          if (currentUserData.peran === "peserta" && currentUserData.peserta) {
            setPesertaId(currentUserData.peserta.id);
            setIsVerified(!!currentUserData.email_verified_at); // Mengubah jadi true/false
            setOriginalEmail(currentUserData.email || "");
            initialFormData.nomor_telp =
              currentUserData.peserta.nomor_telp || "";
          } else {
            setError(
              "Profil ini hanya untuk peserta atau data peserta tidak lengkap."
            );
          }

          setFormData(initialFormData);

          setNameError(validateName(initialFormData.name));
          setEmailError(validateEmail(initialFormData.email));
          setNomorTelpError(validateNomorTelp(initialFormData.nomor_telp));
        } else {
          setError("Data pengguna tidak ditemukan.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Gagal mengambil data profil untuk edit:", err);
        setError("Gagal mengambil data profil. Silakan coba lagi.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  useEffect(() => {
    const checkFormValidity = () => {
      const nameErr = validateName(formData.name);
      const emailErr = validateEmail(formData.email);
      const nomorTelpErr = validateNomorTelp(formData.nomor_telp);

      const isValid = !nameErr && !emailErr && !nomorTelpErr;
      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData.name, formData.email, formData.nomor_telp]);

  useEffect(() => {
    const checkPasswordFormValidity = () => {
      if (!showPasswordSection) {
        setIsPasswordFormValid(false);
        return;
      }

      const currentErr = validateCurrentPassword(passwordData.current_password);
      const newErr = validateNewPassword(passwordData.new_password);
      const confirmErr = validateConfirmPassword(
        passwordData.new_password_confirmation,
        passwordData.new_password
      );

      // Update error states
      setCurrentPasswordError(currentErr);
      setNewPasswordError(newErr);
      setConfirmPasswordError(confirmErr);

      const isValid = !currentErr && !newErr && !confirmErr;
      setIsPasswordFormValid(isValid);
    };

    checkPasswordFormValidity();
  }, [
    passwordData.current_password,
    passwordData.new_password,
    passwordData.new_password_confirmation,
    showPasswordSection,
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: name === "foto_peserta" ? files[0] : value,
      };
      return updatedFormData;
    });

    if (name === "name") {
      setNameError(validateName(value));
    } else if (name === "email") {
      setEmailError(validateEmail(value));
    } else if (name === "nomor_telp") {
      setNomorTelpError(validateNomorTelp(value));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validasi setiap kali input password berubah
    if (name === "current_password") {
      const error = validateCurrentPassword(value);
      setCurrentPasswordError(error);
    } else if (name === "new_password") {
      const error = validateNewPassword(value);
      setNewPasswordError(error);
      // Re-validate confirmation password when new password changes
      if (passwordData.new_password_confirmation) {
        setConfirmPasswordError(
          validateConfirmPassword(passwordData.new_password_confirmation, value)
        );
      }
    } else if (name === "new_password_confirmation") {
      setConfirmPasswordError(
        validateConfirmPassword(value, passwordData.new_password)
      );
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const nomorTelpErr = validateNomorTelp(formData.nomor_telp);

    // Set state error untuk ditampilkan di UI
    setNameError(nameErr);
    setEmailError(emailErr);
    setNomorTelpError(nomorTelpErr);

    // Jika ada error, hentikan proses submit
    if (nameErr || emailErr || nomorTelpErr) {
        // Tambahkan notifikasi di sini
        setNotification({
            message: "Terdapat kesalahan pada input Anda. Mohon periksa kembali formulir.",
            type: "error"
        });
        // Gulir ke atas halaman untuk memastikan notifikasi terlihat
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setSaving(true);
    setError(null); // Reset error umum sebelum menyimpan

    if (!pesertaId) {
      setError("ID peserta tidak ditemukan. Tidak dapat menyimpan.");
      setSaving(false);
      return;
    }

    try {
      const updatePayload = new FormData();
      updatePayload.append("_method", "PUT");
      updatePayload.append("name", formData.name);
      updatePayload.append("email", formData.email);
      updatePayload.append("nomor_telp", formData.nomor_telp);

      const response = await api.post(`/profil-saya`, updatePayload);
      console.log("Data profil berhasil diperbarui:", response.data);

      const updatedUserData = response.data.data.user;
      const updatedPesertaData = response.data.data;

      const fullUpdatedUser = {
        ...updatedUserData,
        peserta: updatedPesertaData,
      };

      localStorage.setItem("user", JSON.stringify(fullUpdatedUser));
      console.log("localStorage user diperbarui dengan data terbaru.");

      alert("Profil berhasil diperbarui!");
      navigate("/profil");
    } catch (err) {
      console.error("Gagal menyimpan data profil:", err);
      let errorMessage = "Gagal menyimpan profil.";
      if (err.response && err.response.data && err.response.data.errors) {
        errorMessage += " Kesalahan validasi server: ";
        for (const key in err.response.data.errors) {
          errorMessage += `${err.response.data.errors[key].join(", ")} `;
        }
      } else {
        errorMessage += ` Pesan: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingLink(true);
    setNotification({ message: "", type: "" }); // Reset notifikasi sebelumnya
    setError(null); // Reset error umum

    try {
      // Panggil API untuk kirim ulang email verifikasi
      const response = await api.post("/resend");
      setNotification({ message: response.data.message, type: "success" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim link verifikasi.";
      setNotification({ message: errorMessage, type: "error" });
    } finally {
      setSendingLink(false);
    }
  };

  const handleChangePassword = async () => {
    // Validasi input sebelum submit
    const currentErr = validateCurrentPassword(passwordData.current_password);
    const newErr = validateNewPassword(passwordData.new_password);
    const confirmErr = validateConfirmPassword(
      passwordData.new_password_confirmation,
      passwordData.new_password
    );

    // Update state error
    setCurrentPasswordError(currentErr);
    setNewPasswordError(newErr);
    setConfirmPasswordError(confirmErr);

    // Jika ada error, hentikan proses submit
    if (currentErr || newErr || confirmErr) {
      return;
    }

    setSavingPassword(true);
    setPasswordError(null);

    try {
      const response = await api.put("/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      console.log("Password berhasil diubah:", response.data);
      alert("Password berhasil diubah!");

      // Reset form password
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setShowPasswordSection(false);
    } catch (err) {
      console.error("Gagal mengubah password:", err);
      let errorMessage = "Gagal mengubah password.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.errors
      ) {
        errorMessage += " Kesalahan validasi: ";
        for (const key in err.response.data.errors) {
          errorMessage += `${err.response.data.errors[key].join(", ")} `;
        }
      } else {
        errorMessage += ` Pesan: ${err.message}`;
      }
      setPasswordError(errorMessage);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Memuat form edit profil...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md w-full max-w-4xl p-8">
      <h2 className="text-center text-2xl text-dark-700 mb-6 font-semibold">
        Edit Profil
      </h2>
      {notification.message && (
        <div
          className={`p-3 rounded-md mb-4 text-sm text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-4 flex items-center text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Form Data Profil */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
            Informasi Profil
          </h3>

          <InputWithLabel
            label="Nama Lengkap"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={FaUser}
            disabled={saving}
            error={nameError}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-end gap-4">
              {/* Input field tetap sama */}
              <div className="flex-grow">
                <InputWithLabel
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={FaEnvelope}
                  disabled={saving || sendingLink} // Tambahkan disabled saat sendingLink
                  error={emailError}
                />
              </div>

              {/* Logika untuk menampilkan badge atau tombol */}
              <div className="flex-shrink-0">
                {isVerified && formData.email === originalEmail ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800 h-10">
                    Terverifikasi
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSendVerification}
                    disabled={sendingLink || saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 h-10 px-4"
                  >
                    {sendingLink ? "Mengirim..." : "Verify"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <InputWithLabel
            label="Nomor Telepon"
            type="tel"
            name="nomor_telp"
            value={formData.nomor_telp}
            onChange={handleChange}
            icon={FaPhone}
            disabled={saving}
            error={nomorTelpError}
          />

          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              onClick={() => navigate("/profil")}
              disabled={saving}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || !isFormValid}
            >
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </div>
        </div>

        {/* Section Ganti Password */}
        <div className="border-t pt-6">
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span>Ganti Password</span>
            {showPasswordSection ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {showPasswordSection && (
            <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
              {passwordError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm">
                  {passwordError}
                </div>
              )}

              <div className="relative">
                <InputWithLabel
                  label="Password Saat Ini"
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  icon={FaLock}
                  disabled={savingPassword}
                  error={currentPasswordError}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                </button>
                {currentPasswordError && (
                  <div className="text-red-500 text-sm mt-1">{currentPasswordError}</div>
                )}
              </div>

              <div className="relative">
                <InputWithLabel
                  label="Password Baru"
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  icon={FaLock}
                  disabled={savingPassword}
                  error={newPasswordError}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
                {/* Tambahkan tampilan pesan error yang jelas untuk password baru */}
                {newPasswordError && (
                  <div className="text-red-500 text-sm mt-1">{newPasswordError}</div>
                )}
              </div>

              <div className="relative">
                <InputWithLabel
                  label="Konfirmasi Password Baru"
                  type={showPasswords.confirmation ? "text" : "password"}
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  icon={FaLock}
                  disabled={savingPassword}
                  error={confirmPasswordError}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmation")}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirmation ? <FaEyeSlash /> : <FaEye />}
                </button>
                {confirmPasswordError && (
                  <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>
                )}
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <p className="font-medium mb-1">Ketentuan Password Baru:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimal 8 karakter</li>
                  <li>Mengandung huruf besar dan huruf kecil</li>
                  <li>Mengandung minimal 1 angka</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? "Mengubah Password..." : "Ubah Password"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;