// src/services/api.js atau src/utils/api.js
// File ini berisi semua konfigurasi Axios dan fungsi utilitas API.

import axios from 'axios';

// URL dasar untuk API Laravel Anda. Sesuaikan jika berbeda.
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Log URL dasar untuk debugging.
console.log('API Base URL:', API_BASE_URL);

// Membuat instance Axios dengan konfigurasi dasar.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Authentication token removed from API instance.');
  }
};

/**
 * Mengambil data dari endpoint API.
 */
export const fetchData = async (endpoint) => {
  try {
    console.log('Mengirim GET ke:', endpoint);
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.message === 'Network Error' ? 'Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar.' : error);
    throw error;
  }
};

/**
 * Memperbarui data pada endpoint API tertentu.
 */
export const updateData = async (endpoint, id, data) => {
  try {
    const url = endpoint + '/' + id;
    console.log('Mengirim PUT ke:', url);
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error.message === 'Network Error' ? 'Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar.' : error);
    if (error.response && error.response.status === 401) {
      console.error('AUTHENTICATION ERROR: Token might be missing or expired. Please log in again.');
    }
    throw error;
  }
};

/**
 * Membuat data baru pada endpoint API tertentu.
 */
export const createData = async (endpoint, data) => {
  try {
    console.log('Mengirim POST ke:', endpoint);
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${endpoint}:`, error.message === 'Network Error' ? 'Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar.' : error);
    if (error.response && error.response.status === 401) {
      console.error('AUTHENTICATION ERROR: Token might be missing or expired. Please log in again.');
    }
    throw error;
  }
};

/**
 * Menghapus data dari endpoint API tertentu.
 */
export const deleteData = async (endpoint, id) => {
  try {
    const url = endpoint + '/' + id;
    console.log('Mengirim DELETE ke:', url);
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error.message === 'Network Error' ? 'Network Error: Pastikan backend Laravel berjalan, URL API benar, dan CORS dikonfigurasi dengan benar.' : error);
    if (error.response && error.response.status === 401) {
      console.error('AUTHENTICATION ERROR: Token might be missing or expired. Please log in again.');
    }
    throw error;
  }
};

// ⭐ PASTIKAN EXPORT INI ADA - Fungsi khusus untuk notifikasi
export const notifikasiAPI = {
  // Untuk Peserta
  getMyNotifications: async (perPage = 10) => {
    try {
      const response = await api.get(`/notifikasi-saya?per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my notifications:', error);
      throw error;
    }
  },

  updateNotificationStatus: async (id, status) => {
    try {
      const response = await api.put(`/notifikasi-saya/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating notification status:', error);
      throw error;
    }
  },

  deleteMyNotification: async (id) => {
    try {
      const response = await api.delete(`/notifikasi-saya/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Untuk Admin
  sendAnnouncementToAll: async (data) => {
    try {
      const response = await api.post('/notifikasi-pengumuman', data);
      return response.data;
    } catch (error) {
      console.error('Error sending announcement:', error);
      throw error;
    }
  }
};

// Objek untuk menyimpan daftar semua endpoint API
export const apiEndpoints = {
  lkp: '/profile-lkp',
  lpk: '/profile-lpk',
  yayasan: '/profile-yayasan',
  slideshow: '/slideshow',
  banner: '/banner',
  berita: '/berita',
  informasiGaleri: '/informasi-galeri',
  feedback: '/feedback',
  pendidikan: '/pendidikan', 
  peserta: '/peserta', 
  visiMisi: '/informasi-lembaga',
  informasiKontak: '/informasi-kontak',
  daftarPelatihan:'/daftar-pelatihan',
  pelatihan: '/pelatihan',
  mentor: '/mentor',
  kategori: '/kategori-pelatihan',
  notifikasi: '/notifikasi-saya',
  notifikasiPengumuman: '/notifikasi-pengumuman'
};

export default api;