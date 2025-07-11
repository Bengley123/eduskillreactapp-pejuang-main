import React, { useState, useEffect } from "react";
import {
  createData,
  fetchData,
  apiEndpoints,
  setAuthToken,
} from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function LaporanAdminPage() {
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setAuthToken(token);
      // Fetch existing report to pre-fill the textarea
      const fetchMyReport = async () => {
        try {
          const response = await fetchData(apiEndpoints.myLaporan);
          if (response && response.laporan_deskripsi) {
            setDeskripsi(response.laporan_deskripsi);
          }
        } catch (err) {
          // It's okay if it fails (e.g., 404 Not Found), means no report exists yet.
          console.log("No existing report found, starting fresh.");
        }
      };
      fetchMyReport();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!deskripsi.trim()) {
      alert("Deskripsi laporan tidak boleh kosong.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        laporan_deskripsi: deskripsi,
      };

      // Using the new endpoint from api.js
      await createData(apiEndpoints.myLaporan, payload);

      alert("Laporan berhasil disimpan!");
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError(
        err.response?.data?.message ||
          "Gagal menyimpan laporan. Silakan coba lagi."
      );
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Buat atau Perbarui Laporan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="laporan_deskripsi"
              className="block font-medium text-gray-700 mb-1"
            >
              Deskripsi Laporan
            </label>
            <textarea
              id="laporan_deskripsi"
              name="laporan_deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tuliskan laporan perkembangan Anda di sini..."
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="text-right pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Submit Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}