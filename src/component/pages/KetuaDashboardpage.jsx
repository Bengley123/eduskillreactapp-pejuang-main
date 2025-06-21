import React, { useState } from 'react';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaSearch, 
  FaBell,
  FaUserCircle,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

// Data untuk mockup
const slideshowData = [
  { id: 1, title: 'Slide 1', image: 'slide1.jpg', status: 'Aktif' },
  { id: 2, title: 'Slide 2', image: 'slide2.jpg', status: 'Aktif' },
  { id: 3, title: 'Slide 3', image: 'slide3.jpg', status: 'Tidak Aktif' },
];

const pelatihanData = [
  { id: 1, nama: 'Penjahitan Ekspor', tanggal: '15 Juni 2025', instruktur: 'Budi Santoso' },
  { id: 2, nama: 'Desain Fashion', tanggal: '1 Juli 2025', instruktur: 'Sinta Wijaya' },
  { id: 3, nama: 'Manajemen Produksi', tanggal: '10 Juli 2025', instruktur: 'Denny Pratama' },
];

const pesertaData = [
  { id: 1, nama: 'Budi Belus', pelatihan: 'Penjahitan Ekspor', status: 'Ditinjau' },
  { id: 2, nama: 'David Dagu', pelatihan: 'Penjahitan Ekspor', status: 'Ditolak' },
  { id: 3, nama: 'Ujang Kijang', pelatihan: 'Penjahitan Ekspor', status: 'Diterima' },
];

const produkData = [
  { id: 1, nama: 'Penjahitan profesional', harga: '$13 USD', penjualan: '12,000' },
  { id: 2, nama: 'Kursus desain fashion', harga: '$29 USD', penjualan: '8,500' },
];

// Komponen Dashboard utama (yang beradaptasi dengan sidebar)
const KetuaDashboardPage = ({ isSidebarOpen }) => {
  // Render konten berdasarkan path URL
  const renderContent = () => {
    const path = window.location.pathname;
    
    if (path.includes('admindashboard')) {
      return <DashboardContent />;
    } else if (path.includes('adkonten')) {
      return <KontenContent />;
    } else if (path.includes('adpelatihan')) {
      return <PelatihanContent />;
    } else if (path.includes('adpeserta')) {
      return <PesertaContent />;
    } else if (path.includes('adpengaturan')) {
      return <PengaturanContent />;
    } else if (path.includes('adlaporan')) {
      return <LaporanContent />; 
    } else {
      return <DashboardContent />;
    }
  };

  return (
    <div className={`flex-1 flex flex-col overflow-hidden bg-gray-100 transition-all duration-300`}>
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <FaSearch />
            </span>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <button className="relative p-1 text-gray-500 hover:text-gray-700">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full shadow">
              <button className="text-gray-700 hover:text-gray-900 font-medium">
                Profile
              </button>
            </div>
          </div>
        </div> */}
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

// Komponen statistik untuk dashboard utama
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex flex-col items-start justify-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <div className="flex items-center justify-between w-full mt-2">
        <p className="text-3xl font-bold">{value}</p>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

// Komponen halaman dashboard utama
const DashboardContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Ketua</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Jumlah Peserta" 
          value="40" 
          icon={<FaUsers className="text-blue-500 text-xl" />} 
        />
        <StatCard 
          title="Jumlah Pendaftar" 
          value="40" 
          icon={<FaUsers className="text-blue-500 text-xl" />} 
        />
        <StatCard 
          title="Total Pelatihan" 
          value="15" 
          icon={<FaChalkboardTeacher className="text-blue-500 text-xl" />} 
        />
        <StatCard 
          title="Jumlah Alumni" 
          value="20" 
          icon={<FaUsers className="text-blue-500 text-xl" />} 
        />
        {/* <StatCard 
          title="Pendapatan Bulan Ini" 
          value="Rp 24,5 Juta" 
          icon={<span className="text-blue-500 text-xl">Rp</span>} 
        /> */}
        {/* <StatCard 
          title="Pengunjung Website" 
          value="1,542" 
          icon={<FaUserCircle className="text-blue-500 text-xl" />} 
        /> */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Peserta Pendaftar</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelatihan</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pesertaData.map((peserta) => (
                  <tr key={peserta.id}>
                    <td className="px-4 py-2">{peserta.nama}</td>
                    <td className="px-4 py-2">{peserta.pelatihan}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        peserta.status === 'Diterima' ? 'bg-green-100 text-green-800' : 
                        peserta.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {peserta.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Pelatihan Yang Sedang Dibuka</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelatihan</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instruktur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pelatihanData.map((pelatihan) => (
                  <tr key={pelatihan.id}>
                    <td className="px-4 py-2">{pelatihan.nama}</td>
                    <td className="px-4 py-2">{pelatihan.tanggal}</td>
                    <td className="px-4 py-2">{pelatihan.instruktur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen tabel untuk konten yang berbeda
const SimpleTable = ({ title, columns, data, actions }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus size={14} /> Tambah
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, idx) => (
                <th 
                  key={idx} 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
              {actions && <th className="px-4 py-2 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {Object.keys(row).filter(key => key !== 'id').map((key, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2">
                    {row[key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 text-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                      <FaTrash />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Halaman Slideshow (untuk /adkonten)
const SlideshowContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Slideshow</h2>
      <SimpleTable 
        title="Daftar Slideshow" 
        columns={['Judul', 'Nama File', 'Status']} 
        data={slideshowData}
        actions={true} 
      />
    </div>
  );
};

// Halaman Konten (untuk /adkonten)
const KontenContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Kelola Informasi</h2>
      <SimpleTable 
        title="Daftar Produk" 
        columns={['Nama Produk', 'Harga', 'Penjualan']} 
        data={produkData}
        actions={true} 
      />
      <SlideshowContent />
    </div>
  );
};

// Halaman Pelatihan (untuk /adpelatihan)
const PelatihanContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Pelatihan</h2>
      <SimpleTable 
        title="Daftar Pelatihan" 
        columns={['Nama Pelatihan', 'Tanggal Mulai', 'Instruktur']} 
        data={pelatihanData}
        actions={true} 
      />
    </div>
  );
};

// Halaman Peserta (untuk /adpeserta)
const PesertaContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Peserta</h2>
      <SimpleTable 
        title="Daftar Peserta" 
        columns={['Nama', 'Pelatihan', 'Status']} 
        data={pesertaData}
        actions={true} 
      />
    </div>
  );
};

// Halaman Pengaturan
const PengaturanContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Pengaturan</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Pengaturan Website</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Website</label>
              <input 
                type="text" 
                defaultValue="Bina Essa Training Center" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Kontak</label>
              <input 
                type="email" 
                defaultValue="info@binaessa.com" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea 
              defaultValue="Jl. Pajajaran No. 123, Bandung, Jawa Barat" 
              rows="2" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Halaman Laporan
const LaporanContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Laporan</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Laporan Bulanan</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Total Pendaftaran</h4>
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-xs text-gray-500">Bulan Mei 2025</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Total Pemasukan</h4>
              <p className="text-2xl font-bold text-green-600">Rp 42,8 Juta</p>
              <p className="text-xs text-gray-500">Bulan Mei 2025</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Total Pelatihan Aktif</h4>
              <p className="text-2xl font-bold text-purple-600">8</p>
              <p className="text-xs text-gray-500">Bulan Mei 2025</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Cetak Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetuaDashboardPage;