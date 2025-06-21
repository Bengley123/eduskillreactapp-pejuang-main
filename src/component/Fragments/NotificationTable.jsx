// File: src/components/Organisms/AdminNotificationTable.jsx
import React, { useState } from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import Icon from '../Elements/AdminSource/Icon';
import Button from '../Elements/Button/index';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { StatusDisplay } from '../Moleculs/AdminSource/StatusDisplay';
import DetailModal from '../Fragments/DetailModal';

const AdminNotificationTable = ({ data, setData }) => {
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (item) => {
    setSelectedNotif(item);
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Yakin ingin menghapus notifikasi '${item.title}'?`)) {
      const newData = data.filter(notif => notif.id !== item.id);
      setData(newData);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h2">Kelola Notifikasi</Typography>
        <Button onClick={() => alert('Tambah Notifikasi')}>+ Tambah</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Judul</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2"><StatusDisplay shown={item.shown} /></td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Icon icon={FaEdit} color="blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon icon={FaTrash} color="red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Tidak terdapat notifikasi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedNotif && (
        <DetailModal onClose={() => setModalOpen(false)}>
          <div className="p-4">
            <Typography variant="h3">Edit Notifikasi</Typography>
            <p className="text-sm text-gray-600 mt-1 mb-4">Judul: {selectedNotif.title}</p>
            <Button onClick={() => alert('Edit logic di sini')} className="mr-2">Simpan Perubahan</Button>
            <Button variant="danger" onClick={() => handleDelete(selectedNotif)}>Hapus</Button>
          </div>
        </DetailModal>
      )}
    </div>
  );
};

export default AdminNotificationTable;
