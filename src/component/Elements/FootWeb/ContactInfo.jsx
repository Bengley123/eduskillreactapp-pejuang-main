import React, { useState, useEffect } from "react"; // Import useState dan useEffect
import { FaEnvelope, FaPhone, FaWhatsapp, FaInstagram, FaSpinner, FaExclamationCircle, FaLocationArrow } from "react-icons/fa"; // Tambahkan ikon loading/error
import IconText from "./IconText";
import { fetchData } from '../../../services/api'; // Pastikan fetchData diimport

const ContactInfo = () => {
  const [contactData, setContactData] = useState(null); // State untuk menyimpan data kontak
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { 
    const getContactData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Asumsi endpoint untuk informasi kontak adalah '/informasi-kontak'
        // Endpoint index() di backend mengembalikan satu record utama
        const response = await fetchData('/informasi-kontak'); // Mengambil data dari backend

        if (response && response.data) { // Cek apakah response.data ada
          setContactData(response.data); // Set data kontak
        } else if (response && response.message) { // Handle jika tidak ada data tapi ada pesan
            setError(response.message);
        }
        else {
          setError('Data kontak tidak ditemukan atau format tidak valid.');
          setContactData(null); // Pastikan data kosong jika ada masalah
        }
      } catch (err) {
        console.error("Gagal memuat informasi kontak:", err);
        if (err.response && err.response.status === 404) {
            setError("Informasi kontak belum diatur di sistem.");
        } else if (err.code === 'ERR_NETWORK') {
            setError("Kesalahan jaringan. Pastikan koneksi Anda aktif.");
        } else {
            setError("Gagal memuat informasi kontak. Silakan coba lagi.");
        }
        setContactData(null);
      } finally {
        setLoading(false);
      }
    };

    getContactData();
  }, []); // Efek ini hanya berjalan sekali saat komponen dimuat

  if (loading) {
    return (
      <div className="text-center py-4">
        <FaSpinner className="animate-spin text-xl text-gray-500 mx-auto" />
        <p className="text-gray-500 text-sm mt-2">Memuat kontak...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <FaExclamationCircle className="text-xl mx-auto mb-1" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!contactData) { // Jika tidak ada data setelah loading dan tidak ada error spesifik
    return (
        <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Informasi kontak tidak tersedia.</p>
        </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">BINA ESSA</h3>
      <ul className="space-y-1">
        {/* Menggunakan data dari state */}
        {contactData.email && <IconText icon={FaEnvelope} text={contactData.email} />}
        {contactData.telepon && <IconText icon={FaPhone} text={contactData.telepon} />}
        {contactData.whatsapp && <IconText icon={FaWhatsapp} text={contactData.whatsapp} />}
        {contactData.instagram && <IconText icon={FaInstagram} text={`@${contactData.instagram}`} />}
        {contactData.alamat && <IconText icon={FaLocationArrow} text={contactData.alamat} />}
      </ul>
    </div>
  );
};

export default ContactInfo;