import React, { useState, useEffect, useCallback } from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import PaginatedDataTable from '../Fragments/PaginationDataTable';
import DetailModal from '../Fragments/DetailModal';
import { FaSearch } from 'react-icons/fa';
import { fetchData, updateData, deleteData, apiEndpoints } from '../../services/api.js';

const PesertaPage = () => {
  // Dummy Data
  const dummyPendidikanOptions = [
    { value: '1', label: 'SD/Sederajat' },
    { value: '2', label: 'SMP/Sederajat' },
    { value: '3', label: 'SMA/SMK/Sederajat' },
    { value: '4', label: 'D3/Diploma' },
    { value: '5', label: 'S1/Sarjana' },
    { value: '6', label: 'S2/Magister' },
    { value: '7', label: 'S3/Doktor' }
  ];

  const dummyPesertaData = [
    {
      id: 1,
      nama: 'Ahmad Budiman',
      email: 'ahmad.budiman@email.com',
      telepon: '08123456789',
      alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
      nik_peserta: '3171234567890001',
      jenis_kelamin: 'Laki-laki',
      tanggal_lahir: '1990-05-15',
      status_kerja: 'bekerja',
      pendidikan_id: '5',
      nama_pendidikan: 'S1/Sarjana',
      foto_peserta: 'https://via.placeholder.com/150x150/0066cc/ffffff?text=Ahmad',
      pelatihan: 'Web Development Fullstack',
      status_pendaftaran: 'diterima',
      tanggalDaftar: '15 Januari 2024',
      ktp_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      kk_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pas_photo_file: 'https://via.placeholder.com/300x400/0066cc/ffffff?text=Pas+Photo+Ahmad',
      ijazah_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      original_user_id: 1,
      original_user_name: 'Ahmad Budiman',
      original_user_email: 'ahmad.budiman@email.com'
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      telepon: '08234567890',
      alamat: 'Jl. Sudirman No. 456, Bandung',
      nik_peserta: '3273456789012345',
      jenis_kelamin: 'Perempuan',
      tanggal_lahir: '1995-08-20',
      status_kerja: 'kuliah',
      pendidikan_id: '3',
      nama_pendidikan: 'SMA/SMK/Sederajat',
      foto_peserta: 'https://via.placeholder.com/150x150/ff6b9d/ffffff?text=Siti',
      pelatihan: 'Digital Marketing',
      status_pendaftaran: 'diterima',
      tanggalDaftar: '20 Januari 2024',
      ktp_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      kk_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pas_photo_file: 'https://via.placeholder.com/300x400/ff6b9d/ffffff?text=Pas+Photo+Siti',
      ijazah_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      original_user_id: 2,
      original_user_name: 'Siti Nurhaliza',
      original_user_email: 'siti.nurhaliza@email.com'
    },
    {
      id: 3,
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      telepon: '08345678901',
      alamat: 'Jl. Gatot Subroto No. 789, Surabaya',
      nik_peserta: '3578901234567890',
      jenis_kelamin: 'Laki-laki',
      tanggal_lahir: '1988-12-10',
      status_kerja: 'wirausaha',
      pendidikan_id: '4',
      nama_pendidikan: 'D3/Diploma',
      foto_peserta: 'https://via.placeholder.com/150x150/4ecdc4/ffffff?text=Budi',
      pelatihan: 'Data Analytics',
      status_pendaftaran: 'diterima',
      tanggalDaftar: '25 Januari 2024',
      ktp_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      kk_file: null, // Tidak ada file KK
      pas_photo_file: 'https://via.placeholder.com/300x400/4ecdc4/ffffff?text=Pas+Photo+Budi',
      ijazah_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      original_user_id: 3,
      original_user_name: 'Budi Santoso',
      original_user_email: 'budi.santoso@email.com'
    },
    {
      id: 4,
      nama: 'Maya Sari',
      email: 'maya.sari@email.com',
      telepon: '08456789012',
      alamat: 'Jl. Diponegoro No. 321, Yogyakarta',
      nik_peserta: '3401234567890123',
      jenis_kelamin: 'Perempuan',
      tanggal_lahir: '1992-03-25',
      status_kerja: 'belum_bekerja',
      pendidikan_id: '5',
      nama_pendidikan: 'S1/Sarjana',
      foto_peserta: null, // Tidak ada foto
      pelatihan: 'UI/UX Design',
      status_pendaftaran: 'diterima',
      tanggalDaftar: '30 Januari 2024',
      ktp_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      kk_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pas_photo_file: 'https://via.placeholder.com/300x400/ffd93d/ffffff?text=Pas+Photo+Maya',
      ijazah_file: null, // Tidak ada ijazah
      original_user_id: 4,
      original_user_name: 'Maya Sari',
      original_user_email: 'maya.sari@email.com'
    },
    {
      id: 5,
      nama: 'Rizki Pratama',
      email: 'rizki.pratama@email.com',
      telepon: '08567890123',
      alamat: 'Jl. Ahmad Yani No. 654, Medan',
      nik_peserta: '1271098765432109',
      jenis_kelamin: 'Laki-laki',
      tanggal_lahir: '1993-07-08',
      status_kerja: 'bekerja',
      pendidikan_id: '6',
      nama_pendidikan: 'S2/Magister',
      foto_peserta: 'https://via.placeholder.com/150x150/6c5ce7/ffffff?text=Rizki',
      pelatihan: 'Mobile App Development',
      status_pendaftaran: 'diterima',
      tanggalDaftar: '5 Februari 2024',
      ktp_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      kk_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pas_photo_file: 'https://via.placeholder.com/300x400/6c5ce7/ffffff?text=Pas+Photo+Rizki',
      ijazah_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      original_user_id: 5,
      original_user_name: 'Rizki Pratama',
      original_user_email: 'rizki.pratama@email.com'
    }
  ];

  // States
  const [dataPeserta, setDataPeserta] = useState(dummyPesertaData); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(dummyPesertaData.length);
  
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [editedPeserta, setEditedPeserta] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedEditFiles, setSelectedEditFiles] = useState({});
  const [pendidikanOptions, setPendidikanOptions] = useState(dummyPendidikanOptions);
  
  const itemsPerPage = 10;

  // Simulate data fetching
  useEffect(() => {
    setTotalPages(Math.ceil(dummyPesertaData.length / itemsPerPage));
    setTotalItems(dummyPesertaData.length);
  }, []);

  const filteredDataDisplay = dataPeserta.filter(peserta => {
    const matchesSearch = (searchTerm === '' || (peserta.nama || '').toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const columns = [
    { key: 'index', header: 'No', render: (value, row, index) => (currentPage - 1) * itemsPerPage + index + 1 },
    { key: 'nama', header: 'Nama' },
    { key: 'pelatihan', header: 'Pelatihan' },
    { key: 'tanggalDaftar', header: 'Tanggal Diterima' }
  ];

  const modalFields = [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', backendKey: 'name' },
    { key: 'email', label: 'Email', type: 'email', backendKey: 'email' },
    { key: 'telepon', label: 'Nomor Telepon', type: 'text', backendKey: 'nomor_telp' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', backendKey: 'alamat_peserta' },
    { key: 'nik_peserta', label: 'NIK Peserta', type: 'text', backendKey: 'nik_peserta' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', backendKey: 'jenis_kelamin',
      options: [{ value: 'Laki-laki', label: 'Laki-laki' }, { value: 'Perempuan', label: 'Perempuan' }] },
    { key: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', backendKey: 'tanggal_lahir' },
    { key: 'status_kerja', label: 'Status Kerja', type: 'select', backendKey: 'status_kerja',
      options: [
        { value: 'bekerja', label: 'Bekerja' }, { value: 'belum_bekerja', label: 'Belum Bekerja' },
        { value: 'kuliah', label: 'Kuliah' }, { value: 'wirausaha', label: 'Wirausaha' },
        { value: 'tidak_diketahui', label: 'Tidak Diketahui' }
      ] },
    { key: 'pendidikan_id', label: 'Pendidikan', type: 'select', backendKey: 'pendidikan_id',
      options: pendidikanOptions,
      renderDisplay: (value) => {
        const opt = pendidikanOptions.find(opt => opt.value === value);
        return opt ? opt.label : 'N/A';
      }},
    { key: 'foto_peserta', label: 'Foto Profil Peserta', type: 'file', accept: 'image/*', backendKey: 'foto_peserta' },
    { key: 'pelatihan', label: 'Pelatihan Diikuti', type: 'text', readonly: true },
    { key: 'tanggalDaftar', label: 'Tanggal Diterima', type: 'text', readonly: true }
  ];

  const documentFields = [
    { key: 'ktp_file', label: 'KTP', type: 'document', backendKey: 'ktp', urlPrefix: 'documents/daftar_pelatihan' },
    { key: 'kk_file', label: 'Kartu Keluarga', type: 'document', backendKey: 'kk', urlPrefix: 'documents/daftar_pelatihan' },
    { key: 'pas_photo_file', label: 'Pas Photo Pendaftaran', type: 'document', backendKey: 'foto', urlPrefix: 'documents/daftar_pelatihan' },
    { key: 'ijazah_file', label: 'Ijazah Terakhir', type: 'document', backendKey: 'ijazah', urlPrefix: 'documents/daftar_pelatihan' }
  ];

  const handleViewDetail = (peserta) => {
    setSelectedPeserta(peserta);
    setEditedPeserta({ ...peserta });
    setSelectedEditFiles({}); 
    setShowDetail(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedPeserta({ ...selectedPeserta });
    setIsEditing(false);
    setSelectedEditFiles({});
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update data in state
      const updatedData = dataPeserta.map(item => 
        item.id === selectedPeserta.id ? { ...editedPeserta } : item
      );
      setDataPeserta(updatedData);
      
      alert('Data peserta berhasil diperbarui!');
      setShowDetail(false);
      setIsEditing(false);
      setSelectedEditFiles({});
      setLoading(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus peserta ${selectedPeserta.nama} ini? Semua data terkait juga akan dihapus.`)) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const updatedData = dataPeserta.filter(item => item.id !== selectedPeserta.id);
        setDataPeserta(updatedData);
        setTotalItems(updatedData.length);
        setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
        
        alert('Peserta berhasil dihapus!');
        setShowDetail(false);
        setLoading(false);
      }, 1000);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedPeserta(prev => ({...prev, [field]: value}));
  };

  const handleEditFileChange = (fieldKey, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedEditFiles(prev => ({...prev, [fieldKey]: file}));
      setEditedPeserta(prev => ({...prev, [fieldKey]: URL.createObjectURL(file)}));
    } else {
        setSelectedEditFiles(prev => {
            const newState = { ...prev };
            delete newState[fieldKey];
            return newState;
        });
        setEditedPeserta(prev => ({...prev, [fieldKey]: null}));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowAction = (row) => {
    handleViewDetail(row);
  };

  if (loading) {
    return (
      <div>
        <Typography variant="h2" className="mb-6">
          Peserta
        </Typography>
        <div className="text-center text-gray-500 py-8">Memuat data peserta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Typography variant="h2" className="mb-6">
          Peserta
        </Typography>
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h2" className="mb-6">
        Demo Peserta Page
      </Typography>

      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">🎯 Demo Features:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Tabel Peserta</strong> dengan data dummy lengkap</li>
          <li>• <strong>DetailModal</strong> dengan tab Informasi + Dokumen</li>
          <li>• <strong>Download ZIP</strong> untuk semua dokumen peserta</li>
          <li>• <strong>Individual download/view</strong> untuk setiap dokumen</li>
          <li>• <strong>Edit & Delete</strong> functionality (simulated)</li>
        </ul>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center justify-end">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama peserta..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 p-2 rounded w-60"
          />
        </div>
      </div>

      <PaginatedDataTable
        title="Daftar Peserta"
        columns={columns}
        data={filteredDataDisplay} 
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        totalItems={totalItems} 
        totalPages={totalPages} 
        hasActions={true}
        onRowAction={handleRowAction}
        actionIcon={FaSearch}
      />

      {/* Modal Detail/Edit Peserta */}
      <DetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detail Peserta"
        data={selectedPeserta}
        isEditing={isEditing}
        editedData={editedPeserta}
        onEdit={handleEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDelete}
        onInputChange={handleInputChange}
        onFileChange={handleEditFileChange}
        fields={modalFields}
        documentFields={documentFields}
        showDocuments={true}
      />
    </div>
  );
};

export default PesertaPage;