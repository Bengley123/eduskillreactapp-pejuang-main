import React, { useState } from 'react';
import InputText from '../Elements/Input/Input';
import FileUpload from '../Moleculs/AdminSource/FileUpload';
import Button from '../Elements/Button/index';

export const TentangKamiEditor = ({ data, setData, type }) => {
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleSave = () => {
    setData(editedData);
    setEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{type}</h2>
        <Button onClick={() => setEditing(!editing)}>
          {editing ? 'Batal' : 'Edit'}
        </Button>
      </div>

      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText label="Judul" value={editedData.title} onChange={(e) => handleChange('title', e.target.value)} />
          <FileUpload id="logo-upload" accept=".png,.jpg" selectedFile={null} onChange={() => {}} label="Pilih Logo" />
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Deskripsi</label>
            <textarea value={editedData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full border p-2 rounded" rows="5" />
          </div>
          <div className="md:col-span-2 text-right">
            <ButtonPrimary onClick={handleSave}>Simpan</ButtonPrimary>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold">{data.title}</p>
          <p className="text-sm text-gray-600 mt-2">{data.description}</p>
          <p className="text-sm text-gray-400 mt-1">Logo: {data.logoUrl}</p>
        </div>
      )}
    </div>
  );
};