import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const AdminNotifikasiPage = () => {
  // State untuk data notifikasi
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Pendaftaran Dibuka",
      message: "Pendaftaran untuk program magang batch 2025 telah dibuka",
      recipient: "Semua Peserta",
      status: "Terkirim",
      scheduledDate: "2025-06-01",
      createdDate: "2025-05-30"
    },
    {
      id: 2,
      title: "Jadwal Interview",
      message: "Jadwal interview untuk calon peserta magang",
      recipient: "Calon Peserta",
      status: "Terjadwal",
      scheduledDate: "2025-06-05",
      createdDate: "2025-06-01"
    },
    {
      id: 3,
      title: "Pengumuman Hasil",
      message: "Pengumuman hasil seleksi peserta magang",
      recipient: "Calon Peserta",
      status: "Draft",
      scheduledDate: "2025-06-10",
      createdDate: "2025-06-02"
    },
    {
      id: 4,
      title: "Orientasi Peserta",
      message: "Jadwal orientasi untuk peserta magang yang diterima",
      recipient: "Peserta Diterima",
      status: "Terkirim",
      scheduledDate: "2025-06-15",
      createdDate: "2025-06-03"
    },
    {
      id: 5,
      title: "Update Sistem",
      message: "Pemeliharaan sistem akan dilakukan",
      recipient: "Semua Pengguna",
      status: "Draft",
      scheduledDate: "2025-06-20",
      createdDate: "2025-06-04"
    },
    {
      id: 6,
      title: "Pendaftaran Berhasil",
      message: "Kamu telah berhasil mendaftar pleatihan!",
      recipient: "Calon Peserta",
      status: "Draft",
      scheduledDate: "2025-06-20",
      createdDate: "2025-06-04"
    }
  ]);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient: 'Semua Peserta',
    scheduledDate: '',
    status: 'Draft'
  });

  // Filter data berdasarkan search term, status, dan tanggal
  useEffect(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.recipient.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Semua Status' || notification.status === statusFilter;
      
      const matchesDate = !dateFilter || notification.scheduledDate === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    setFilteredNotifications(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, notifications]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle form submission
  const handleSubmit = () => {
    if (!newNotification.title || !newNotification.message || !newNotification.scheduledDate) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }
    
    const newId = Math.max(...notifications.map(n => n.id)) + 1;
    const notification = {
      ...newNotification,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setNotifications([...notifications, notification]);
    setNewNotification({
      title: '',
      message: '',
      recipient: 'Semua Peserta',
      scheduledDate: '',
      status: 'Draft'
    });
    setIsModalOpen(false);
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case 'Terkirim':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'Terjadwal':
        return `${baseClasses} bg-blue-100 text-blue-600`;
      case 'Draft':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kelola Notifikasi</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <FaPlus size={16} />
            Tambah Notifikasi
          </button>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Terkirim">Terkirim</option>
              <option value="Terjadwal">Terjadwal</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
              placeholder="dd/mm/yyyy"
            />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded shadow">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">JUDUL & PESAN</div>
              <div className="col-span-2">PENERIMA</div>
              <div className="col-span-2">JADWAL KIRIM</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-2">TANGGAL DIBUAT</div>
              <div className="col-span-2">AKSI</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="text-lg">Tidak terdapat notifikasi</p>
                <p className="text-sm mt-2">Coba ubah filter atau tambahkan notifikasi baru</p>
              </div>
            ) : (
              currentItems.map((notification) => (
                <div key={notification.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {notification.recipient}
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {new Date(notification.scheduledDate).toLocaleDateString('id-ID')}
                    </div>
                    <div className="col-span-1">
                      <span className={getStatusBadge(notification.status)}>
                        {notification.status}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {new Date(notification.createdDate).toLocaleDateString('id-ID')}
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <FaEye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1">
                          <FaEdit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1">
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredNotifications.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredNotifications.length)} dari {filteredNotifications.length} data
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                  >
                    Prev
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-white bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal untuk Tambah Notifikasi */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Tambah Notifikasi Baru</h2>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Notifikasi
                  </label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penerima
                  </label>
                  <select
                    value={newNotification.recipient}
                    onChange={(e) => setNewNotification({...newNotification, recipient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="Semua Peserta">Semua Peserta</option>
                    <option value="Calon Peserta">Calon Peserta</option>
                    <option value="Peserta Diterima">Peserta Diterima</option>
                    <option value="Semua Pengguna">Semua Pengguna</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jadwal Kirim
                  </label>
                  <input
                    type="date"
                    value={newNotification.scheduledDate}
                    onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifikasiPage;