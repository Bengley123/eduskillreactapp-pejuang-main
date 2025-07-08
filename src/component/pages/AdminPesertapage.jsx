import React, { useState, useEffect, useCallback } from 'react';
import Button from '../Elements/Button/index';
import Input from '../Elements/Input/InputSearch.jsx';
import Typography from '../Elements/AdminSource/Typhography';
import DetailModal from '../Fragments/DetailModal';
import { FaSearch, FaExclamationCircle, FaEdit, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import { fetchData, updateData, deleteData, apiEndpoints } from '../../services/api.js';

const PesertaPage = () => {
  const [dataPeserta, setDataPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // per_page yang dikirim ke backend

  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [editedPeserta, setEditedPeserta] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState(''); // Untuk input langsung oleh user
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(''); // Search term yang benar-benar akan digunakan untuk request API
                                                                  // Ini yang akan diubah saat tombol Cari diklik atau Enter

  const [selectedPelatihanId, setSelectedPelatihanId] = useState(''); 
  const [pelatihanOptions, setPelatihanOptions] = useState([]); 

  const [selectedEditFiles, setSelectedEditFiles] = useState({});
  const [pendidikanOptions, setPendidikanOptions] = useState([]);
  
  useEffect(() => {
    const fetchPendidikanOptions = async () => {
      try {
        const response = await fetchData(apiEndpoints.pendidikan);
        if (response && Array.isArray(response.data)) { 
          setPendidikanOptions(response.data.map(p => ({ value: p.id, label: p.nama_pendidikan })));
        } else if (response && response.data && Array.isArray(response.data.data)) { 
          setPendidikanOptions(response.data.data.map(p => ({ value: p.id, label: p.nama_pendidikan })));
        }
      } catch (err) {
        console.error("Failed to fetch pendidikan options:", err);
      }
    };
    fetchPendidikanOptions();
  }, []);

  useEffect(() => {
    const fetchPelatihanOptions = async () => {
      try {
        let allPelatihanItems = [];
        let nextPageUrl = `${apiEndpoints.pelatihan}`; 

        while (nextPageUrl) {
          const response = await fetchData(nextPageUrl);
          if (response && Array.isArray(response.data)) {
              allPelatihanItems = allPelatihanItems.concat(response.data);
              nextPageUrl = response.links?.next; 
          } else if (response && response.data && Array.isArray(response.data.data)) {
              allPelatihanItems = allPelatihanItems.concat(response.data.data);
              nextPageUrl = response.data.links?.next; 
          } else {
              nextPageUrl = null; 
          }
        }
        setPelatihanOptions(allPelatihanItems.map(p => ({ value: p.id, label: p.nama_pelatihan })));
      } catch (err) {
        console.error("Failed to fetch pelatihan options:", err);
      }
    };
    fetchPelatihanOptions();
  }, []);

  // --- FUNGSI PENGAMBILAN DATA (SERVER-SIDE PAGINATION) ---
  const fetchPesertaData = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      let url = `${apiEndpoints.peserta}?registration_status=diterima`; 
      url += `&page=${currentPage}`; 
      url += `&per_page=${itemsPerPage}`; 

      if (appliedSearchTerm) { 
        url += `&search=${encodeURIComponent(appliedSearchTerm)}`;
      }
      if (selectedPelatihanId) {
        url += `&pelatihan_id=${encodeURIComponent(selectedPelatihanId)}`;
      }

      console.log("Fetching Peserta Data (Server-Side) from URL:", url);
      const response = await fetchData(url);
      console.log("API Raw Response (Server-Side) for Peserta:", response);
      
      let fetchedRawItems = [];
      let currentTotal = 0;
      let currentLastPage = 1;
      let currentCurrentPage = 1;

      // Logika pemrosesan respons API (sesuai struktur respons Anda)
      if (response && Array.isArray(response.data)) {
          fetchedRawItems = response.data;
          currentTotal = response.total || response.data.length;
          currentLastPage = response.last_page || 1;
          currentCurrentPage = response.current_page || 1;
      } 
      else if (response && response.data && Array.isArray(response.data.data)) {
          fetchedRawItems = response.data.data;
          currentTotal = response.data.total || response.data.data.length;
          currentLastPage = response.data.last_page || 1;
          currentCurrentPage = response.data.current_page || 1;
      } else {
        console.warn('API response for peserta data is not in expected format:', response);
      }

      // --- Mapping data ke format frontend yang konsisten ---
      const mappedData = fetchedRawItems.map(item => {
        const allDaftarPelatihan = item.daftar_pelatihan || []; 
        const acceptedRegistrations = allDaftarPelatihan.filter(reg => reg.status?.toLowerCase() === 'diterima');
        
        const primaryAcceptedReg = acceptedRegistrations.length > 0 ? acceptedRegistrations[0] : null;

        const getFilenameFromPath = (fullPath) => fullPath ? fullPath.split('/').pop() : null;

        const ktpFilename = getFilenameFromPath(primaryAcceptedReg?.ktp);
        const kkFilename = getFilenameFromPath(primaryAcceptedReg?.kk);
        const pasPhotoFilename = getFilenameFromPath(primaryAcceptedReg?.foto);
        const ijazahFilename = getFilenameFromPath(primaryAcceptedReg?.ijazah);
        const fotoPesertaFilename = getFilenameFromPath(item.foto_peserta);

        const ktp_file_url = ktpFilename ? `http://localhost:8000/api/documents/${ktpFilename}` : null; // NEW URL
        const kk_file_url = kkFilename ? `http://localhost:8000/api/documents/${kkFilename}` : null; // NEW URL
        const pas_photo_file_url = pasPhotoFilename ? `http://localhost:8000/api/documents/${pasPhotoFilename}` : null; // NEW URL
        const ijazah_file_url = ijazahFilename ? `http://localhost:8000/api/documents/${ijazahFilename}` : null; // NEW URL
        const foto_peserta_url = fotoPesertaFilename ? `http://localhost:8000/api/profile-photos/${fotoPesertaFilename}` : null; // NEW URL (adjust if using a single /documents endpoint)

        return {
          id: item.id,
          nama: item.user?.name || 'N/A', // Ambil nama dari relasi user
          email: item.user?.email || 'N/A', // Ambil email dari relasi user
          telepon: item.nomor_telp || 'N/A',
          alamat: item.alamat_peserta || 'N/A',
          nik_peserta: item.nik_peserta || '',
          jenis_kelamin: item.jenis_kelamin || '',
          tanggal_lahir: item.tanggal_lahir || '',
          pendidikan_id: item.pendidikan_id || '',
          nama_pendidikan: item.pendidikan?.nama_pendidikan || 'N/A',
          foto_peserta: foto_peserta_url,

          daftar_pelatihan_diterima: acceptedRegistrations,
          
          ktp_file: ktp_file_url,
          kk_file: kk_file_url,
          pas_photo_file: pas_photo_file_url,
          ijazah_file: ijazah_file_url,
          
          original_user_id: item.user_id,
          original_user_name: item.user?.name || '',
          original_user_email: item.user?.email || '',
        };
      });
      // --- Akhir Mapping data ---

      setDataPeserta(mappedData);
      setTotalPages(currentLastPage);
      setCurrentPage(currentCurrentPage);
      setTotalItems(currentTotal);

    } catch (err) {
      console.error("Failed to fetch peserta:", err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network Error: Pastikan backend Laravel berjalan dan CORS dikonfigurasi dengan benar.');
      } else if (err.response) {
        setError(`Gagal memuat data peserta: ${err.response.status} - ${err.response.statusText}`);
      } else {
        setError("Gagal memuat data peserta.");
      }
      setDataPeserta([]);
      setTotalItems(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchTerm, selectedPelatihanId]); // Dependency diubah ke appliedSearchTerm

  // Efek ini akan terpicu saat currentPage, appliedSearchTerm, atau selectedPelatihanId berubah
  useEffect(() => {
    fetchPesertaData();
  }, [fetchPesertaData]);

  // --- Kolom Tabel ---
  const columns = [
    { key: 'index', header: 'No', render: (value, row, index) => (currentPage - 1) * itemsPerPage + index + 1 },
    { key: 'nama', header: 'Nama' },
    { key: 'email', header: 'Email' },
    { 
      key: 'pelatihan', 
      header: 'Pelatihan',
      render: (value, row) => {
          if (row.daftar_pelatihan_diterima && Array.isArray(row.daftar_pelatihan_diterima)) {
              if (row.daftar_pelatihan_diterima.length > 0) {
                  return row.daftar_pelatihan_diterima.map(reg => reg.pelatihan?.nama_pelatihan || 'N/A').join(', ');
              }
          }
          return 'N/A';
      }
    },
    { 
      key: 'tanggalDaftar', 
      header: 'Tanggal Diterima',
      render: (value, row) => {
          if (row.daftar_pelatihan_diterima && Array.isArray(row.daftar_pelatihan_diterima)) {
              const primaryAcceptedReg = row.daftar_pelatihan_diterima.find(reg => reg.status?.toLowerCase() === 'diterima');
              return primaryAcceptedReg ? new Date(primaryAcceptedReg.created_at).toLocaleDateString('id-ID') : 'N/A';
          }
          return 'N/A';
      }
    },
    { key: 'telepon', header: 'Telepon' },
  ];

  // --- Modal Fields ---
  const modalFields = [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', backendKey: 'name' },
    { key: 'email', label: 'Email', type: 'email', backendKey: 'email' },
    { key: 'telepon', label: 'Nomor Telepon', type: 'text', backendKey: 'nomor_telp' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', backendKey: 'alamat_peserta' },
    { key: 'nik_peserta', label: 'NIK Peserta', type: 'text', backendKey: 'nik_peserta' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', backendKey: 'jenis_kelamin',
      options: [{ value: 'Laki-laki', label: 'Laki-laki' }, { value: 'Perempuan', label: 'Perempuan' }] },
    { key: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', backendKey: 'tanggal_lahir' },
    { key: 'pendidikan_id', label: 'Pendidikan', type: 'select', backendKey: 'pendidikan_id',
      options: pendidikanOptions,
      renderDisplay: (value) => {
        const opt = pendidikanOptions.find(opt => opt.value === value);
        return opt ? opt.label : 'N/A';
      }},
    { key: 'foto_peserta', label: 'Foto Profil Peserta', type: 'file', accept: 'image/*', backendKey: 'foto_peserta' },
  ];

  const customModalContent = (data) => (
    <>
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">Pelatihan yang Diikuti (Diterima):</h4>
        {data.daftar_pelatihan_diterima && data.daftar_pelatihan_diterima.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-800">
            {data.daftar_pelatihan_diterima.map((reg, idx) => (
              <li key={idx}>
                {reg.pelatihan?.nama_pelatihan || 'Nama Pelatihan Tidak Diketahui'} (Diterima pada: {new Date(reg.created_at).toLocaleDateString('id-ID')})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Tidak ada pelatihan yang diikuti dengan status Diterima.</p>
        )}
      </div>
    </>
  );

  const documentFields = [
    { key: 'ktp_file', label: 'KTP', type: 'document', backendKey: 'ktp', urlPrefix: 'documents/daftar_pelatihan' },
    { key: 'kk_file', label: 'Kartu Keluarga', type: 'document', backendKey: 'kk', urlPrefix: 'documents/daftar_pelatihan' },
    { key: 'pas_photo_file', label: 'Pas Photo Pendaftaran', type: 'document', backendKey: 'foto', urlPrefix: 'documents/daftar_pelatihan' },
    { key: 'ijazah_file', label: 'Ijazah Terakhir', type: 'document', backendKey: 'ijazah', urlPrefix: 'documents/daftar_pelatihan' }
  ];

  const handleViewDetail = (peserta) => {
    setSelectedPeserta(peserta);
    setEditedPeserta({ 
        ...peserta, 
        daftar_pelatihan_diterima: peserta.daftar_pelatihan_diterima || [] 
    });
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
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT');

      modalFields.forEach(field => {
        if (field.backendKey === 'name') {
            formDataToSend.append('name', editedPeserta.nama); 
        } else if (field.backendKey === 'email') {
            formDataToSend.append('email', editedPeserta.email);
        } else if (editedPeserta[field.key] !== undefined && field.type !== 'file') {
            formDataToSend.append(field.backendKey, editedPeserta[field.key]);
        }
      });
      
      if (selectedEditFiles.foto_peserta) {
        formDataToSend.append('foto_peserta', selectedEditFiles.foto_peserta);
      } else if (editedPeserta.foto_peserta === null && selectedPeserta.foto_peserta) {
        formDataToSend.append('remove_foto_peserta', true);
      }

      const response = await updateData(apiEndpoints.peserta, selectedPeserta.id, formDataToSend);

      if (response) {
        await fetchPesertaData(); 
        alert('Data peserta berhasil diperbarui!');
        setShowDetail(false);
        setIsEditing(false);
        setSelectedEditFiles({});
      } else {
        throw new Error('Respons update kosong atau tidak valid.');
      }
    } catch (err) {
      console.error('Gagal memperbarui peserta:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join('; ');
        setError(`Validasi gagal: ${errorMessages}`);
      } else {
        setError(`Gagal memperbarui peserta: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus peserta ${selectedPeserta.nama} ini? Semua data terkait juga akan dihapus.`)) {
      setLoading(true);
      setError(null);
      try {
        await deleteData(apiEndpoints.peserta, selectedPeserta.id);
        await fetchPesertaData(); 
        alert('Peserta berhasil dihapus!');
        setShowDetail(false);
      } catch (err) {
        console.error('Gagal menghapus peserta:', err);
        setError(`Gagal menghapus peserta: ${err.message}`);
      } finally {
        setLoading(false);
      }
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
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleRowAction = (row) => {
    handleViewDetail(row);
  };

  const handlePelatihanFilterChange = (e) => {
    setSelectedPelatihanId(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
    fetchPesertaData(); // Trigger fetch data saat filter pelatihan berubah
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value); // Update input field value immediately
  };

  const handleSearchButtonClick = () => {
    setAppliedSearchTerm(searchTerm); // Set appliedSearchTerm dari searchTerm saat ini
    setCurrentPage(1); // Reset ke halaman 1 untuk pencarian baru
    // fetchPesertaData() akan terpicu oleh perubahan appliedSearchTerm di useEffect
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchButtonClick(); // Panggil fungsi klik tombol Cari
    }
  };


  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Typography variant="h2" className="mb-6">
          Peserta
        </Typography>
        <div className="text-center text-gray-500 py-8">Memuat data peserta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center text-red-500">
        <Typography variant="h2" className="mb-6">
          Terjadi Kesalahan
        </Typography>
        <p>{error}</p>
        <Button onClick={() => fetchPesertaData()} variant="primary" className="mt-4">Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h2" className="mb-6">
        Peserta
      </Typography>

      <div className="mb-4 flex flex-wrap gap-4 items-center justify-end">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Input Search Nama */}
          <input
            type="text"
            placeholder="Cari nama peserta..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            onKeyPress={handleSearchInputKeyPress} // Tambahkan ini
            className="border border-gray-300 p-2 rounded w-60"
          />
          {/* Tombol Cari */}
          <Button
            onClick={handleSearchButtonClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Cari
          </Button>
          {/* Dropdown Filter Pelatihan */}
          <select
            value={selectedPelatihanId}
            onChange={handlePelatihanFilterChange}
            className="border border-gray-300 p-2 rounded w-60"
          >
            <option value="">Semua Pelatihan</option>
            {pelatihanOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-2">{col.header}</th>
                ))}
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataPeserta.length > 0 ? (
                dataPeserta.map((peserta, idx) => (
                  <tr key={peserta.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-2">
                        {col.render ? col.render(peserta[col.key], peserta, idx) : peserta[col.key]}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                      <button 
                        onClick={() => handleViewDetail(peserta)}
                        className="text-gray-600 hover:text-blue-500 transition-colors"
                        title="Lihat Detail Peserta"
                      >
                        <FaSearch />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaExclamationCircle className="text-3xl mb-2 text-gray-400" />
                      <p className="text-sm">
                        Tidak ada peserta yang ditemukan sesuai filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, (currentPage - 1) * itemsPerPage + dataPeserta.length)} dari {totalItems} data
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handlePrevPage}
                className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 border rounded ${
                    currentPage === i + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
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
        customContent={customModalContent}
      />
    </div>
  );
};

export default PesertaPage;