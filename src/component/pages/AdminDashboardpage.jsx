import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../Elements/AdminSource/Typhography';
import StatsGrid from '../Fragments/StatsgridAdmin';
import DataTable from '../Fragments/DataTableAdmin';
import Badge from '../Elements/AdminSource/Badge';
import { FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import { fetchData, setAuthToken } from '../../services/api';
import { apiEndpoints } from '../../services/api';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    jumlahPendaftar: 0,
    jumlahPeserta: 0,
    totalPelatihan: 0,
    jumlahAlumni: 0,
  });
  const [pelatihanData, setPelatihanData] = useState([]);
  const [tempatKerjaData, setTempatKerjaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buat fetchDashboardData sebagai function biasa, bukan useCallback dulu
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check and set auth token
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Tidak ada token autentikasi. Silakan login kembali.');
        navigate('/login');
        return;
      }
      
      setAuthToken(token);
      console.log('Fetching dashboard data with token...');

      // Initialize variables to store all data
      let daftarPelatihanData = [];
      let pesertaData = [];
      let pelatihanData = [];
      let feedbackData = [];

      // Fetch all data with proper error handling for each endpoint
      try {
        console.log('Fetching daftar pelatihan...');
        const daftarPelatihanResponse = await fetchData(apiEndpoints.daftarPelatihan);
        daftarPelatihanData = daftarPelatihanResponse?.data || [];
        console.log('Daftar Pelatihan Response:', daftarPelatihanResponse);
      } catch (err) {
        console.warn('Failed to fetch daftar pelatihan:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      try {
        console.log('Fetching peserta...');
        const pesertaResponse = await fetchData(apiEndpoints.peserta);
        pesertaData = pesertaResponse?.data || [];
        console.log('Peserta Response:', pesertaResponse);
      } catch (err) {
        console.warn('Failed to fetch peserta:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      try {
        console.log('Fetching pelatihan...');
        const pelatihanResponse = await fetchData(apiEndpoints.pelatihan);
        pelatihanData = pelatihanResponse?.data?.data || pelatihanResponse?.data || [];
        console.log('Pelatihan Response:', pelatihanResponse);
      } catch (err) {
        console.warn('Failed to fetch pelatihan:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      try {
        console.log('Fetching feedback...');
        const feedbackResponse = await fetchData(apiEndpoints.feedback);
        feedbackData = feedbackResponse?.data || [];
        console.log('Feedback Response:', feedbackResponse);
      } catch (err) {
        console.warn('Failed to fetch feedback:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      // Calculate statistics
      const jumlahPendaftar = Array.isArray(daftarPelatihanData) ? daftarPelatihanData.length : 0;
      const jumlahPeserta = Array.isArray(pesertaData) ? pesertaData.length : 0;
      const totalPelatihan = Array.isArray(pelatihanData) ? pelatihanData.length : 0;

      // Calculate alumni based on feedback data
      const alumniFromFeedback = Array.isArray(feedbackData) 
        ? feedbackData.filter(feedback => feedback.peserta_id || feedback.peserta)
        : [];
      
      console.log('=== DEBUG ALUMNI CALCULATION ===');
      console.log('Total Peserta:', pesertaData.length);
      console.log('Total Feedback:', feedbackData.length);
      console.log('Alumni from feedback count:', alumniFromFeedback.length);
      console.log('====================================');

      // Set statistics
      setDashboardStats({
        jumlahPendaftar,
        jumlahPeserta,
        totalPelatihan,
        jumlahAlumni: alumniFromFeedback.length,
      });

      // Process Pelatihan Data
      const processedPelatihanData = Array.isArray(pelatihanData) 
        ? pelatihanData.map(pelatihan => {
            // Handle kategori yang mungkin berupa object
            let kategoriName = 'N/A';
            if (pelatihan.kategori) {
              if (typeof pelatihan.kategori === 'object') {
                kategoriName = pelatihan.kategori.nama_kategori || pelatihan.kategori.nama || 'N/A';
              } else {
                kategoriName = pelatihan.kategori;
              }
            } else if (pelatihan.nama_kategori) {
              kategoriName = pelatihan.nama_kategori;
            }

            return {
              id: pelatihan.id || pelatihan.id_pelatihan || 'N/A',
              nama: pelatihan.nama || pelatihan.nama_pelatihan || 'N/A',
              waktuPengumpulan: pelatihan.deadline_berkas || pelatihan.waktu_pengumpulan || pelatihan.batas_berkas || pelatihan.deadline || 'N/A',
              kategori: kategoriName,
              status: pelatihan.status_pelatihan || pelatihan.status || 'Belum Dimulai'
            };
          })
        : [];

      setPelatihanData(processedPelatihanData);

      // Process Alumni Workplace Data
      const alumniWorkplaceData = [];
      
      if (Array.isArray(alumniFromFeedback) && alumniFromFeedback.length > 0) {
        alumniFromFeedback.forEach((feedback, index) => {
          const tempatKerja = feedback.tempat_kerja || 'Belum Mengisi Tempat Kerja';
          let namaAlumni = `Alumni ${index + 1}`;
          
          if (feedback.peserta && typeof feedback.peserta === 'object') {
            if (feedback.peserta.user && feedback.peserta.user.name) {
              namaAlumni = feedback.peserta.user.name;
            } else if (feedback.peserta.nama) {
              namaAlumni = feedback.peserta.nama;
            } else if (feedback.peserta.nama_peserta) {
              namaAlumni = feedback.peserta.nama_peserta;
            }
          } else if (feedback.peserta_id && Array.isArray(pesertaData)) {
            const peserta = pesertaData.find(p => 
              p.id === feedback.peserta_id || 
              p.id_peserta === feedback.peserta_id
            );
            
            if (peserta) {
              namaAlumni = peserta.nama || peserta.nama_peserta || peserta.name || `Alumni ${index + 1}`;
            }
          }

          alumniWorkplaceData.push({
            id: index + 1,
            nama: namaAlumni,
            tempatKerja: tempatKerja
          });
        });
      }

      setTempatKerjaData(alumniWorkplaceData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Silakan login kembali.');
        navigate('/login');
      } else {
        setError('Gagal memuat data. Periksa koneksi atau hubungi admin.');
      }
      setDashboardStats({
        jumlahPendaftar: 0,
        jumlahPeserta: 0,
        totalPelatihan: 0,
        jumlahAlumni: 0,
      });
      setPelatihanData([]);
      setTempatKerjaData([]);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect untuk initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // UseEffect untuk auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrainingStatusBadge = (status) => {
    switch (status) {
      case "Belum Dimulai":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Belum Dimulai
          </span>
        );
      case "Sedang berlangsung":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            Sedang berlangsung
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  const stats = [
    { title: 'Jumlah Pendaftar', value: dashboardStats.jumlahPendaftar, icon: FaUsers, iconColor: 'blue-500' },
    { title: 'Jumlah Peserta', value: dashboardStats.jumlahPeserta, icon: FaUsers, iconColor: 'green-500' },
    { title: 'Total Pelatihan', value: dashboardStats.totalPelatihan, icon: FaChalkboardTeacher, iconColor: 'purple-500' },
    { title: 'Jumlah Alumni', value: dashboardStats.jumlahAlumni, icon: FaUsers, iconColor: 'orange-500' },
  ];

  const pelatihanColumns = [
    { key: 'nama', header: 'Nama Pelatihan' },
    { key: 'kategori', header: 'Kategori' },
    { key: 'waktuPengumpulan', header: 'Deadline Berkas' },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => getTrainingStatusBadge(status)
    },
  ];

  const tempatKerjaColumns = [
    { key: 'nama', header: 'Nama Alumni' },
    { key: 'tempatKerja', header: 'Tempat Bekerja' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2">
          Dashboard Admin
        </Typography>
      </div>
      
      <StatsGrid stats={stats} loading={loading} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable 
          title="Pelatihan Yang Tersedia"
          columns={pelatihanColumns}
          data={pelatihanData}
          loading={loading}
          className="lg:col-span-2"
        />
        
        <DataTable 
          title="Tempat Bekerja Alumni (Yang Telah Memberikan Feedback)"
          columns={tempatKerjaColumns}
          data={tempatKerjaData}
          loading={loading}
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;