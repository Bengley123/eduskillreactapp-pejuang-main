// src/services/api.js atau src/utils/api.js
// File ini berisi semua konfigurasi Axios dan fungsi utilitas API.

import axios from "axios";

// URL dasar untuk API Laravel Anda. Sesuaikan jika berbeda.
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Log URL dasar untuk debugging.
console.log("API Base URL:", API_BASE_URL);

// Membuat instance Axios dengan konfigurasi dasar.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // HAPUS ATAU KOMENTARI BARIS INI KARENA AKAN DITIMPA OTOMATIS OLEH FormData
    // 'Content-Type': 'application/json',
    Accept: "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
    console.log("Authentication token removed from API instance.");
  }
};

/**
 * Mengambil data dari endpoint API.
 * @param {string} endpoint - Endpoint API relatif (misalnya '/lkp-profiles' atau '/lkp-profiles/1').
 * @returns {Promise<Object>} Data respons dari API.
 * @throws {Error} Jika terjadi kesalahan jaringan atau API.
 */
export const fetchData = async (endpoint) => {
  try {
    console.log("Mengirim GET ke:", endpoint); // DEBUG
    console.log("Headers GET:", api.defaults.headers.common); // DEBUG
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching data from ${endpoint}:`,
      error.message === "Network Error"
        ? "Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar."
        : error
    );
    throw error;
  }
};

/**
 * Memperbarui data pada endpoint API tertentu.
 * @param {string} endpoint - Endpoint API dasar relatif (misalnya '/lkp-profiles').
 * @param {string|number} id - ID item yang akan diperbarui.
 * @param {Object} data - Data yang akan dikirim untuk pembaruan.
 * @returns {Promise<Object>} Data respons dari API.
 * @throws {Error} Jika terjadi kesalahan jaringan atau API.
 */
export const updateData = async (endpoint, id, data) => {
  try {
    const url = endpoint + "/" + id;
    console.log("Mengirim PUT ke:", url); // DEBUG
    console.log("Headers PUT:", api.defaults.headers.common); // DEBUG
    // Saat mengirim FormData, jangan override Content-Type secara manual.
    // Axios akan menanganinya dengan benar.
    const response = await api.post(url, data); // Menggunakan POST dengan _method: PUT untuk FormData
    return response.data;
  } catch (error) {
    console.error(
      `Error updating data at ${endpoint}/${id}:`,
      error.message === "Network Error"
        ? "Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar."
        : error
    );
    if (error.response && error.response.status === 401) {
      console.error(
        "AUTHENTICATION ERROR: Token might be missing or expired. Please log in again."
      );
    }
    throw error;
  }
};

/**
 * Membuat data baru pada endpoint API tertentu.
 * @param {string} endpoint - Endpoint API relatif (misalnya '/lkp-profiles').
 * @param {Object} data - Data yang akan dikirim untuk pembuatan.
 * @returns {Promise<Object>} Data respons dari API.
 * @throws {Error} Jika terjadi kesalahan jaringan atau API.
 */
export const createData = async (endpoint, data) => {
  try {
    console.log("Mengirim POST ke:", endpoint); // DEBUG
    console.log("Headers POST:", api.defaults.headers.common); // DEBUG
    // Saat mengirim FormData, jangan override Content-Type secara manual.
    // Axios akan menanganinya dengan benar.
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(
      `Error creating data at ${endpoint}:`,
      error.message === "Network Error"
        ? "Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar."
        : error
    );
    if (error.response && error.response.status === 401) {
      console.error(
        "AUTHENTICATION ERROR: Token might be missing or expired. Please log in again."
      );
    }
    throw error;
  }
};

/**
 * Menghapus data dari endpoint API tertentu.
 * @param {string} endpoint - Endpoint API dasar relatif (misalnya '/lkp-profiles').
 * @param {string|number} id - ID item yang akan dihapus.
 * @returns {Promise<Object>} Data respons dari API.
 * @throws {Error} Jika terjadi kesalahan jaringan atau API.
 */
export const deleteData = async (endpoint, id) => {
  try {
    const url = endpoint + "/" + id;
    console.log("Mengirim DELETE ke:", url); // DEBUG
    console.log("Headers DELETE:", api.defaults.headers.common); // DEBUG
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting data at ${endpoint}/${id}:`,
      error.message === "Network Error"
        ? "Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar."
        : error
    );
    if (error.response && error.response.status === 401) {
      console.error(
        "AUTHENTICATION ERROR: Token might be missing or expired. Please log in again."
      );
    }
    throw error;
  }
};

// Objek untuk menyimpan daftar semua endpoint API
export const apiEndpoints = {
  // Endpoints untuk Tentang Kami (Profile LKP, LPK, Yayasan)
  lkp: "/profile-lkp",
  lpk: "/profile-lpk",
  yayasan: "/profile-yayasan",

  slideshow: "/slideshow",
  banner: "/banner",
  berita: "/berita",
  informasiGaleri: "/informasi-galeri",
  feedback: "/feedback",

  pendidikan: "/pendidikan",
  peserta: "/peserta",

  visiMisi: "/informasi-lembaga",
  informasiKontak: "/informasi-kontak",

  daftarPelatihan: "/daftar-pelatihan",
  pelatihan: "/pelatihan",
  mentor: "/mentor",
};

export default api;
