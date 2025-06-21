import React from 'react';
import Button from '../Elements/Button/index';
import FileUpload from '../Moleculs/AdminSource/FileUpload';
import { StatusDisplay } from '../Moleculs/AdminSource/StatusDisplay';
import { FaSearch } from 'react-icons/fa';

export const TableSection = ({ title, data, setData }) => {
  const handleDelete = (filename) => {
    const newData = data.filter(item => item.filename !== filename);
    setData(newData);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button onClick={() => alert('Tambah data')}>Tambah</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Nama File</th>
              <th className="px-4 py-2">Ditampilkan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{item.filename}</td>
                <td className="px-4 py-2"><StatusDisplay shown={item.shown} /></td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 mr-2"><FaSearch /></button>
                  <button onClick={() => handleDelete(item.filename)} className="text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};