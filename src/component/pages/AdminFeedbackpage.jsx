import React, { useState, useEffect, useCallback } from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import PaginatedDataTable from '../Fragments/PaginationDataTable';
import DetailModal from '../Fragments/DetailModal';
import { FaSearch } from 'react-icons/fa';
import { fetchData, updateData, deleteData, apiEndpoints } from '../../services/api.js';

const FeedbackPage = () => {
  const [dataFeedback, setDataFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState(null);
  const [editedFeedbackItem, setEditedFeedbackItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const itemsPerPage = 5;

  const statusColors = {
    'Ditinjau': 'text-yellow-500 font-semibold',
    'Ditampilkan': 'text-green-600 font-semibold',
    'Tidak Ditampilkan': 'text-red-600 font-semibold',
  };

  // Callback untuk mengambil data feedback dari API
  const fetchFeedbackData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchData(apiEndpoints.feedback);
      
      let fetchedItems = [];
      // Kontroler feedback mengembalikan objek pagination langsung, dengan data di 'data.data'
      if (response && response.data && Array.isArray(response.data.data)) {
        fetchedItems = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        // Fallback jika suatu saat API tidak lagi menggunakan pagination (misal hanya mengembalikan array)
        fetchedItems = response.data;
      } else {
        console.warn('Unexpected data format for feedback:', response);
        fetchedItems = [];
      }

      // Memetakan data dari API ke format yang diharapkan oleh frontend
      const mappedData = fetchedItems.map(item => ({
        id: item.id,
        // Pastikan akses ke nested properties aman dengan optional chaining (?)
        nama: item.peserta?.user?.name || 'N/A',
        email: item.peserta?.user?.email || 'N/A',
        pesan: item.comment || '', // 'comment' adalah field feedback
        tanggalFeedback: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { // Format tanggal
            year: 'numeric', month: 'long', day: 'numeric'
        }) : 'N/A',
        // --- PERBAIKAN PENTING DI SINI: Pastikan status valid atau default ke 'Ditinjau' ---
        // Ini akan memastikan nilai 'status' selalu salah satu dari yang diharapkan
        status: ['Ditinjau', 'Ditampilkan', 'Tidak Ditampilkan'].includes(item.status) ? item.status : 'Ditinjau',
        // Simpan created_at dan updated_at asli dari API untuk detail modal jika diperlukan
        created_at: item.created_at,
        updated_at: item.updated_at,
        tempat_kerja: item.tempat_kerja || '', // Tambahkan ini jika Anda menampilkan tempat_kerja
      }));
      setDataFeedback(mappedData);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network Error: Pastikan backend Laravel berjalan dan CORS dikonfigurasi dengan benar.');
      } else if (err.response) {
        setError(`Failed to load feedback data: ${err.response.status} - ${err.response.statusText}`);
        console.error("API Response Error:", err.response.data);
      } else {
        setError("Failed to load feedback data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Panggil fetchFeedbackData saat komponen mount
  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  const columns = [
    {
      key: 'index',
      header: 'No',
      render: (value, row, index) => (currentPage - 1) * itemsPerPage + index + 1
    },
    { key: 'nama', header: 'Nama' },
    {
      key: 'pesan',
      header: 'Feedback',
      render: (pesan) => (
        <div className='max-w-xs truncate' title={pesan}>{pesan}</div>
      )
    },
    { key: 'tanggalFeedback', header: 'Tanggal Feedback' },
    {
      key: 'status',
      header: 'Status',
      render: (status) => (
        // --- PERBAIKAN DI SINI: Pastikan statusColors memiliki fallback ---
        <span className={statusColors[status] || 'text-gray-500'}>
          {status}
        </span>
      )
    },
  ];

  const modalFields = [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', readonly: true },
    { key: 'email', label: 'Email', type: 'email', readonly: true },
    { key: 'tanggalFeedback', label: 'Tanggal Feedback', type: 'text', readonly: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Ditinjau', label: 'Ditinjau' },
        { value: 'Ditampilkan', label: 'Ditampilkan' },
        { value: 'Tidak Ditampilkan', label: 'Tidak Ditampilkan' },
      ],
      // Ini adalah kunci: tidak ada `readonly: true` di sini untuk field 'status'
      // Sehingga DetailModal akan merendernya sebagai input yang bisa diedit
    },
    {
      key: 'pesan',
      label: 'Pesan Feedback',
      type: 'textarea',
      readonly: true, // Pesan feedback tidak boleh diubah admin
    },
    { key: 'tempat_kerja', label: 'Tempat Kerja', type: 'text', readonly: true }
  ];

  const handleViewDetail = (item) => {
    setSelectedFeedbackItem(item);
    setEditedFeedbackItem({...item}); // Kloning item untuk diedit
    setShowDetail(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedFeedbackItem({...selectedFeedbackItem}); // Kembali ke data asli
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    // Validasi tambahan di frontend sebelum mengirim ke backend
    if (!editedFeedbackItem.status || !['Ditinjau', 'Ditampilkan', 'Tidak Ditampilkan'].includes(editedFeedbackItem.status)) {
        alert("Please select a valid status (Ditinjau, Ditampilkan, or Tidak Ditampilkan).");
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        _method: 'PUT',
        status: editedFeedbackItem.status, // Hanya kirim field status yang diubah
        // Anda bisa menambahkan 'comment' atau 'tempat_kerja' jika ingin admin juga bisa mengeditnya
        // comment: editedFeedbackItem.pesan,
        // tempat_kerja: editedFeedbackItem.tempat_kerja,
      };
      
      await updateData(apiEndpoints.feedback, selectedFeedbackItem.id, payload);
      
      // Setelah berhasil update, panggil ulang fetch data untuk refresh tabel
      await fetchFeedbackData();

      alert('Feedback updated successfully!');
      setShowDetail(false);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update feedback:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join('; ');
        setError(`Failed to update feedback. Errors: ${errorMessages}`);
      } else if (err.response) {
        setError(`Failed to update feedback: ${err.response.status} - ${err.response.statusText}`);
      } else {
        setError(`Failed to update feedback: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setLoading(true);
      setError(null);
      try {
        await deleteData(apiEndpoints.feedback, selectedFeedbackItem.id);
        
        // Setelah berhasil delete, panggil ulang fetch data untuk refresh tabel
        await fetchFeedbackData();

        alert('Feedback deleted successfully!');
        setShowDetail(false);
      } catch (err) {
        console.error("Failed to delete feedback:", err);
        if (err.response) {
            setError(`Failed to delete feedback: ${err.response.status} - ${err.response.statusText}`);
        } else {
            setError(`Failed to delete feedback: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedFeedbackItem(prev => ({...prev, [field]: value})); // Pastikan ini tidak mengubah data asli di `selectedFeedbackItem`
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowAction = (row) => {
    handleViewDetail(row);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = dataFeedback.filter(item =>
    (item.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterStatus === '' || item.status === filterStatus)
  );

  if (loading) {
    return (
      <div>
        <Typography variant="h2" className="mb-6">
          Kelola Feedback
        </Typography>
        <div className="text-center text-gray-500 py-8">Memuat data feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Typography variant="h2" className="mb-6">
          Kelola Feedback
        </Typography>
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h2" className="mb-6">
        Kelola Feedback
      </Typography>

      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <select
            className="px-2 py-2 border rounded-md w-full sm:w-52"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="">Semua Status</option>
            <option value="Ditinjau">Ditinjau</option>
            <option value="Ditampilkan">Ditampilkan</option>
            <option value="Tidak Ditampilkan">Tidak Ditampilkan</option>
          </select>
          <input
            type="text"
            placeholder="Cari nama peserta..."
            className="px-3 py-2 border rounded-md w-full sm:w-60"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <PaginatedDataTable
        title=""
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        hasActions={true}
        onRowAction={handleRowAction}
        actionIcon={FaSearch}
      />

      <DetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detail Feedback"
        data={selectedFeedbackItem}
        isEditing={isEditing}
        editedData={editedFeedbackItem}
        onEdit={handleEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDelete}
        onInputChange={handleInputChange}
        fields={modalFields}
      />
    </div>
  );
};

export default FeedbackPage;