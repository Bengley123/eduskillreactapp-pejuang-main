import React, { useState } from "react";
import FileUpload from "../Moleculs/AdminSource/FileUpload";

export default function UploadLaporanPage() {
  const [formData, setFormData] = useState({
    peserta: "",
    lulusanKerja: "",
    pendaftar: "",
    pelatihanAktif: "",
    informasiLain: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData((prev) => ({ ...prev, file: selectedFile.name }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Upload Laporan Perkembangan
        </h2>

        <form className="space-y-5">

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
            label="Upload Dokumen Pendukung (Opsional)"
            currentFile={formData.file}
            onFileChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />

          {/* Tombol Submit */}
          <div className="text-right pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
