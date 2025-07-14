import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Typography from "../Elements/AdminSource/Typhography";
import StatsGrid from "../Fragments/StatsgridAdmin";
import DataTable from "../Fragments/DataTableAdmin";
import api, { fetchData, setAuthToken } from '../../services/api';
import { apiEndpoints } from "../../services/api";

const KetuaDashboardPage = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [adminNotes, setAdminNotes] = useState(
    "Catatan laporan dari admin akan muncul di sini..."
  );
  const [dashboardStats, setDashboardStats] = useState({
    jumlahPendaftar: 0,
    jumlahPeserta: 0,
    totalPelatihan: 0,
    jumlahAlumni: 0,
  });
  const [pelatihanData, setPelatihanData] = useState([]);
  const [tempatKerjaData, setTempatKerjaData] = useState([]);
  const [laporanAdminData, setLaporanAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewDocument = async (endpoint) => {
    if (!endpoint) {
        console.error("Endpoint dokumen tidak valid.");
        return;
    }
    try {
        // 'api.get' akan secara otomatis menggabungkan baseURL dengan endpoint ini
        // dan menyertakan header otentikasi.
        const response = await api.get(endpoint, {
            responseType: 'blob',
        });

        const fileURL = URL.createObjectURL(response.data);
        window.open(fileURL, '_blank');

    } catch (err) {
        console.error('Gagal melihat dokumen:', err);
        if (err.response?.status === 401) {
            setError('Sesi Anda telah berakhir. Silakan login kembali.');
            navigate('/login');
        } else {
            setError('Gagal memuat dokumen.');
        }
    }
};


  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        navigate("/login");
        return;
      }
      setAuthToken(token);

      // Lakukan SATU panggilan ke endpoint baru yang aman
      const response = await fetchData("/ketuadashboard");

      if (response) {
        // Atur statistik dari response
        setDashboardStats(response.stats);

        // Proses dan atur data untuk tabel-tabel
        const processedPelatihan = response.tables.pelatihan.map((p) => {
          let formattedDeadline = "N/A";
          // Cek jika ada tanggalnya
          if (p.waktu_pengumpulan) {
            // Opsi untuk format tanggal dan waktu
            const options = {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            };
            // Buat objek Date dan format ke dalam Bahasa Indonesia
            formattedDeadline = new Date(p.waktu_pengumpulan).toLocaleString(
              "id-ID",
              options
            );
          }

          return {
            id: p.id,
            nama: p.nama_pelatihan || "N/A",
            kategori: p.kategori ? p.kategori.nama_kategori : "N/A",
            status: p.status_pelatihan || "Belum Dimulai",
            waktuPengumpulan: formattedDeadline, // <-- Gunakan tanggal yang sudah diformat
          };
        });

        const processedTempatKerja = response.tables.tempatKerja.map((f) => ({
          id: f.id,
          nama: f.peserta?.user?.name || "Alumni",
          tempatKerja: f.tempat_kerja || "Belum Mengisi",
        }));

        const processedLaporanAdmin = response.tables.laporanAdmin.map(l => {
            // Buat hanya endpoint-nya saja
            const endpoint = l.laporan_file 
                ? `/documents-view/${l.laporan_file}` 
                : null;

            return {
                id: l.id,
                adminName: l.admin?.user?.name || 'N/A',
                laporanDeskripsi: l.laporan_deskripsi,
                createdAt: new Date(l.created_at).toLocaleDateString('id-ID'),
                // Ubah onClick untuk mengirim hanya endpoint
                laporanFile: endpoint
                    ? (
                        <button 
                            onClick={() => handleViewDocument(endpoint)} 
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Lihat File
                        </button>
                    )
                    : 'Tidak ada file'
            };
        });

        setPelatihanData(processedPelatihan);
        setTempatKerjaData(processedTempatKerja);
        setLaporanAdminData(processedLaporanAdmin);
      }
    } catch (err) {
      console.error("Gagal mengambil data dasbor ketua:", err);
      setError("Gagal memuat data dasbor. Periksa koneksi Anda.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
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
    {
      title: "Jumlah Pendaftar",
      value: dashboardStats.jumlahPendaftar,
      icon: FaUsers,
      iconColor: "blue-500",
    },
    {
      title: "Jumlah Peserta",
      value: dashboardStats.jumlahPeserta,
      icon: FaUsers,
      iconColor: "green-500",
    },
    {
      title: "Total Pelatihan",
      value: dashboardStats.totalPelatihan,
      icon: FaChalkboardTeacher,
      iconColor: "purple-500",
    },
    {
      title: "Jumlah Alumni",
      value: dashboardStats.jumlahAlumni,
      icon: FaUsers,
      iconColor: "orange-500",
    },
  ];

  const pelatihanColumns = [
    { key: "nama", header: "Nama Pelatihan" },
    { key: "kategori", header: "Kategori" },
    { key: "waktuPengumpulan", header: "Deadline Berkas" },
    {
      key: "status",
      header: "Status",
      render: (status) => getTrainingStatusBadge(status),
    },
  ];

  const tempatKerjaColumns = [
    { key: "nama", header: "Nama Alumni" },
    { key: "tempatKerja", header: "Tempat Bekerja" },
  ];

  const laporanAdminColumns = [
    { key: "adminName", header: "Nama Admin" },
    { key: "laporanDeskripsi", header: "Deskripsi Laporan" },
    { key: "laporanFile", header: "File Laporan" },
    { key: "createdAt", header: "Tanggal Dibuat" },
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

          <DataTable
            title="Laporan Admin"
            columns={laporanAdminColumns}
            data={laporanAdminData}
            loading={loading}
            className="lg:col-span-2"
          />
        </div>
      </main>
    </div>
  );
};

export default KetuaDashboardPage;
