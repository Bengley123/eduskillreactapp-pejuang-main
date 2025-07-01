import React, { useState, useEffect } from "react";
import InputWithLabel from "../Elements/Input/index";
import Button from "../Elements/Button/index";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

import api, { fetchData, updateData } from "../../services/api";
import { setAuthToken } from "../../services/api";

const EditProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nomor_telp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nomorTelpError, setNomorTelpError] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [pesertaId, setPesertaId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

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

  const handleSave = async () => {
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const nomorTelpErr = validateNomorTelp(formData.nomor_telp);

    // Set state error untuk ditampilkan di UI
    setNameError(nameErr);
    setEmailError(emailErr);
    setNomorTelpError(nomorTelpErr);

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

      const response = await api.post(`/peserta/${pesertaId}`, updatePayload);
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
      const response = await api.post("http://localhost:8000/api/email/resend");
      setNotification({ message: response.data.message, type: "success" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim link verifikasi.";
      setNotification({ message: errorMessage, type: "error" });
    } finally {
      setSendingLink(false);
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
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 h-10 px-4" // Added h-10 px-4
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
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
