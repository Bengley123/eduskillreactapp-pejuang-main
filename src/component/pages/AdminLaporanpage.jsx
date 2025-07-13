import React, { useState, useEffect } from "react";
import FileUpload from "../Moleculs/AdminSource/FileUpload";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../services/api";

export default function UploadLaporanPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    peserta: "",
    lulusanKerja: "",
    pendaftar: "",
    pelatihanAktif: "",
    informasiLain: "",
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("jwt");

      if (!storedToken) {
        console.log(
          "UploadLaporanPage: Tidak ada token, mengarahkan ke login."
        );
        navigate("/login");
        return;
      }

      setAuthToken(storedToken);
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        navigate("/login");
        return;
      }

      const submitData = new FormData();
      submitData.append("peserta", formData.peserta);
      submitData.append("lulusanKerja", formData.lulusanKerja);
      submitData.append("pendaftar", formData.pendaftar);
      submitData.append("pelatihanAktif", formData.pelatihanAktif);
      submitData.append("laporan_deskripsi", formData.informasiLain);

      if (formData.file) {
        submitData.append("laporan_file", formData.file);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/my-laporan-admin`,
        {
          method: "POST",
          body: submitData,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type header when using FormData
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Laporan berhasil disubmit!");

        // Reset form
        setFormData({
          peserta: "",
          lulusanKerja: "",
          pendaftar: "",
          pelatihanAktif: "",
          informasiLain: "",
          file: null,
        });
      } else if (response.status === 401) {
        console.log("Token expired or invalid, redirecting to login");
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (response.status === 422) {
        const errorData = await response.json();
        console.log("Validation errors:", errorData);

        // Show validation errors to user
        if (errorData.errors) {
          let errorMessage = "Validation errors:\n";
          Object.keys(errorData.errors).forEach((key) => {
            errorMessage += `${key}: ${errorData.errors[key].join(", ")}\n`;
          });
          alert(errorMessage);
        } else {
          alert("Validation failed. Please check your input.");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        console.log("Error response:", errorData);
        throw new Error("Failed to submit laporan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Upload Laporan Perkembangan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Kolom Informasi Penting Lainnya */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Informasi Penting Lainnya
            </label>
            <textarea
              name="informasiLain"
              value={formData.informasiLain}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded resize-none"
              placeholder="Tuliskan informasi tambahan yang perlu dilaporkan"
            ></textarea>
          </div>

          {/* Upload File */}
          <FileUpload
            label="Upload Dokumen Pendukung"
            currentFile={formData.file?.name || null}
            onFileChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />

          {/* Tombol Submit */}
          <div className="text-right pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded transition ${
                isLoading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Mengirim..." : "Submit Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
