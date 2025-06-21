import React from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import StatsGrid from '../Fragments/StatsgridAdmin';
import DataTable from '../Fragments/DataTableAdmin';
import Badge from '../Elements/AdminSource/Badge';
import { FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

// Mock data
const dashboardStats = [
  { title: 'Jumlah Pendaftar', value: '40', icon: FaUsers, iconColor: 'blue-500' },
  { title: 'Jumlah Peserta', value: '40', icon: FaUsers, iconColor: 'blue-500' },
  { title: 'Total Pelatihan', value: '15', icon: FaChalkboardTeacher, iconColor: 'blue-500' },
  { title: 'Jumlah Alumni', value: '20', icon: FaUsers, iconColor: 'blue-500' }
];

const pesertaColumns = [
  { key: 'nama', header: 'Nama' },
  { key: 'pelatihan', header: 'Pelatihan' },
  { 
    key: 'status', 
    header: 'Status',
    render: (status) => {
      const variant = status === 'Diterima' ? 'success' : 
                    status === 'Ditolak' ? 'danger' : 'warning';
      return <Badge variant={variant}>{status}</Badge>;
    }
  }
];

const pelatihanColumns = [
  { key: 'nama', header: 'Nama Pelatihan' },
  { key: 'tanggal', header: 'Tanggal Mulai' },
  { key: 'instruktur', header: 'Instruktur' }
];

const tempatKerjaColumns = [
  { key: 'nama', header: 'Nama Alumni' },
  { key: 'tempatkerja', header: 'Tempat Bekerja' }
];

const pesertaData = [
  { id: 1, nama: 'Budi Belus', pelatihan: 'Penjahitan Ekspor', status: 'Ditinjau' },
  { id: 2, nama: 'David Dagu', pelatihan: 'Penjahitan Ekspor', status: 'Ditolak' },
  { id: 3, nama: 'Ujang Kijang', pelatihan: 'Penjahitan Ekspor', status: 'Diterima' }
];

const pelatihanData = [
  { id: 1, nama: 'Penjahitan Ekspor', tanggal: '15 Juni 2025', instruktur: 'Budi Santoso' },
  { id: 2, nama: 'Desain Fashion', tanggal: '1 Juli 2025', instruktur: 'Sinta Wijaya' },
  { id: 3, nama: 'Manajemen Produksi', tanggal: '10 Juli 2025', instruktur: 'Denny Pratama' }
];

const tempatKerjaData = [
  { id: 1, nama: 'Irwan Padang', tempatkerja: 'RM Sederhana' },
  { id: 2, nama: 'Ucup Galon', tempatkerja: 'Danone' },
  { id: 3, nama: 'Rifki Finance', tempatkerja: 'Bank Mandiri' }
];

const AdminDashboardPage = () => {
  return (
    <div>
      <Typography variant="h2" className="mb-6">
        Dashboard Admin
      </Typography>
      
      <StatsGrid stats={dashboardStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <DataTable 
          title="Peserta Pendaftar"
          columns={pesertaColumns}
          data={pesertaData}
        /> */}
        
        <DataTable 
          title="Pelatihan Yang Sedang Dibuka"
          columns={pelatihanColumns}
          data={pelatihanData}
          className="lg:col-span-2"
        />
        
        <DataTable 
          title="Tempat Bekerja Alumni"
          columns={tempatKerjaColumns}
          data={tempatKerjaData}
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;