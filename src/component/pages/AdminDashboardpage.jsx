import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../Elements/AdminSource/Typhography";
import StatsGrid from "../Fragments/StatsgridAdmin";
import DataTable from "../Fragments/DataTableAdmin";
import { FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { fetchData, setAuthToken } from "../../services/api";

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

  useEffect(() => {
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

        // Panggil SATU endpoint dasbor untuk admin
        const response = await fetchData("/admindashboard");

        if (response) {
          // Atur statistik dari response
          setDashboardStats(response.stats);

          // Proses dan atur data untuk tabel dari response
          const processedPelatihan = response.tables.pelatihan.map((p) => ({
            id: p.id,
            nama: p.nama_pelatihan || "N/A",
            kategori: p.kategori ? p.kategori.nama_kategori : "N/A",
            status: p.status_pelatihan || "Belum Dimulai",
            waktuPengumpulan: p.waktu_pengumpulan
              ? new Date(p.waktu_pengumpulan).toLocaleString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          }));

          const processedTempatKerja = response.tables.tempatKerja.map((f) => ({
            id: f.id,
            nama: f.peserta?.user?.name || "Alumni",
            tempatKerja: f.tempat_kerja || "Belum Mengisi",
          }));

          setPelatihanData(processedPelatihan);
          setTempatKerjaData(processedTempatKerja);
        }
      } catch (err) {
        console.error("Gagal mengambil data dasbor admin:", err);
        setError("Gagal memuat data dasbor. Periksa koneksi Anda.");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set interval untuk auto-refresh
    const interval = setInterval(fetchDashboardData, 30000); // Refresh setiap 30 detik
    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, [navigate]);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2">Dashboard Admin</Typography>
      </div>

      <StatsGrid stats={stats} loading={loading} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
