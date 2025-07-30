// AdminLaporanPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../services/api";

export default function AdminLaporanPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    informasiLain: "",
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  const openModal = (title, message, type = "success") => setModal({ open: true, title, message, type });
  const closeModal = () => setModal({ open: false, title: "", message: "", type: "success" });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("jwt");
    if (!token) {
      openModal("Sesi berakhir", "Silakan login kembali.", "error");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("laporan_deskripsi", formData.informasiLain);
    if (formData.file) submitData.append("laporan_file", formData.file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/my-laporan-admin`,
        {
          method: "POST",
          body: submitData,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        openModal("Sukses", "Laporan berhasil disubmit!", "success");
        setFormData({ informasiLain: "", file: null });
      } else if (res.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else if (res.status === 422) {
        const err = await res.json();
        const msg = err.errors ? Object.values(err.errors).flat().join("\n") : "Input tidak valid.";
        openModal("Validasi gagal", msg, "error");
      } else {
        openModal("Gagal", "Terjadi kesalahan saat mengirim laporan.", "error");
      }
    } catch (err) {
      openModal("Error", "Gagal terhubung ke server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Laporan Perkembangan</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Informasi Penting Lainnya</label>
              <textarea
                name="informasiLain"
                value={formData.informasiLain}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded resize-none"
                placeholder="Tuliskan informasi tambahan yang perlu dilaporkan"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Upload Dokumen Pendukung</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="text-right pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded transition ${
                  isLoading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Mengirim..." : "Submit Laporan"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Pop-up */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className={`text-lg font-semibold mb-2 ${modal.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {modal.title}
            </h3>
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{modal.message}</p>
            <button
              onClick={() => {
                closeModal();
                if (modal.type === "error" && modal.title === "Sesi berakhir") navigate("/login");
              }}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}