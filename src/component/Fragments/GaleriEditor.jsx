import React, { useState } from "react";
import { FaPlus, FaUpload, FaTimes } from "react-icons/fa";

const GaleriEditor = () => {
  const [galeri, setGaleri] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleAdd = () => {
    if (!selectedFile) return alert("Pilih gambar terlebih dahulu");
    const newItem = {
      id: galeri.length + 1,
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
    };
    setGaleri([...galeri, newItem]);
    setSelectedFile(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Kelola Galeri</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
        >
          <FaPlus /> Tambah Gambar
        </button>
      </div>

      {showForm && (
        <div className="mb-4 border border-dashed border-gray-300 p-4 rounded">
          <label className="block text-sm mb-2">Pilih Gambar</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedFile(null);
              }}
              className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {galeri.map((item) => (
          <div key={item.id} className="border rounded overflow-hidden">
            <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
            <div className="p-2 text-center text-sm">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriEditor;
