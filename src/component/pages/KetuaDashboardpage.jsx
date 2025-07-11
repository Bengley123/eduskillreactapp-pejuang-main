import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import Typography from '../Elements/AdminSource/Typhography';
import StatsGrid from '../Fragments/StatsgridAdmin';
import DataTable from '../Fragments/DataTableAdmin';
import { fetchData, setAuthToken } from '../../services/api';
import { apiEndpoints } from '../../services/api';

const KetuaDashboardPage = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [adminNotes, setAdminNotes] = useState('Catatan laporan dari admin akan muncul di sini...');
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

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Tidak ada token autentikasi. Silakan login kembali.');
        navigate('/login');
        return;
      }

      setAuthToken(token);

      let daftarPelatihanData = [];
      let pesertaData = [];
      let pelatihanData = [];
      let feedbackData = [];

      try {
        const daftarPelatihanResponse = await fetchData(apiEndpoints.daftarPelatihan);
        daftarPelatihanData = daftarPelatihanResponse?.data || [];
      } catch (err) {
        console.warn('Failed to fetch daftar pelatihan:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      try {
        const pesertaResponse = await fetchData(apiEndpoints.peserta);
        pesertaData = pesertaResponse?.data || [];
      } catch (err) {
        console.warn('Failed to fetch peserta:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      try {
        const pelatihanResponse = await fetchData(apiEndpoints.pelatihan);
        pelatihanData = pelatihanResponse?.data?.data || pelatihanResponse?.data || [];
      } catch (err) {
        console.warn('Failed to fetch pelatihan:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      try {
        const feedbackResponse = await fetchData(apiEndpoints.feedback);
        feedbackData = feedbackResponse?.data || [];
      } catch (err) {
        console.warn('Failed to fetch feedback:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Silakan login kembali.');
          navigate('/login');
          return;
        }
      }

      const jumlahPendaftar = Array.isArray(daftarPelatihanData) ? daftarPelatihanData.length : 0;
      const jumlahPeserta = Array.isArray(pesertaData) ? pesertaData.length : 0;
      const totalPelatihan = Array.isArray(pelatihanData) ? pelatihanData.length : 0;

      const alumniFromFeedback = Array.isArray(feedbackData) 
        ? feedbackData.filter(feedback => feedback.peserta_id || feedback.peserta)
        : [];

      setDashboardStats({
        jumlahPendaftar,
        jumlahPeserta,
        totalPelatihan,
        jumlahAlumni: alumniFromFeedback.length,
      });

      const processedPelatihanData = Array.isArray(pelatihanData) 
        ? pelatihanData.map(pelatihan => {
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 p-4 shadow-md flex justify-end items-center relative">
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center gap-2 text-white hover:text-gray-200"
          >
            <FaUserCircle className="text-2xl" />
          </button>
          {showLogout && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="mr-2" /> Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Typography variant="h2" className="mb-6">
          Dashboard Ketua
        </Typography>

        <StatsGrid stats={stats} loading={loading} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Catatan Laporan dari Admin</h3>
          <textarea
            value={adminNotes}
            readOnly
            placeholder="Masukkan catatan laporan dari admin..."
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        </div>
      </main>
    </div>
  );
};

export default KetuaDashboardPage;