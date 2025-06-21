import React from "react";
import InputText from "../Elements/Input/Input";
import Button from "../Elements/Button/index";
import Typography from "../Elements/AdminSource/Typhography";
import Icon from "../Elements/AdminSource/Icon";
import FileUpload from "../Moleculs/AdminSource/FileUpload";

const TrainingForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    nama: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    deadlinePendaftaran: '',
    deskripsi: '',
    instruktur: '',
    kapasitas: '',
    lokasi: '',
    biaya: '',
    foto: null,
    ...initialData
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleSubmit = () => {
    if (formData.nama && formData.tanggalMulai && formData.tanggalSelesai && formData.deadlinePendaftaran) {
      onSubmit(formData);
      setFormData({
        nama: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        deadlinePendaftaran: '',
        deskripsi: '',
        instruktur: '',
        kapasitas: '',
        lokasi: '',
        biaya: '',
        foto: null
      });
    } else {
      alert('Mohon lengkapi semua field yang wajib diisi');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3">{initialData ? 'Edit Pelatihan' : 'Tambah Pelatihan'}</Typography>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Icon icon={FaTimes} size="md" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto pr-2">
          <div className="space-y-3">
            <InputText
              label="Nama Pelatihan *"
              value={formData.nama}
              onChange={(e) => handleInputChange('nama', e.target.value)}
              placeholder="Masukkan nama pelatihan"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <InputText
                label="Tanggal Mulai *"
                type="date"
                value={formData.tanggalMulai}
                onChange={(e) => handleInputChange('tanggalMulai', e.target.value)}
              />
              <InputText
                label="Tanggal Selesai *"
                type="date"
                value={formData.tanggalSelesai}
                onChange={(e) => handleInputChange('tanggalSelesai', e.target.value)}
              />
            </div>

            <InputText
              label="Deadline Pendaftaran *"
              type="date"
              value={formData.deadlinePendaftaran}
              onChange={(e) => handleInputChange('deadlinePendaftaran', e.target.value)}
            />
            
            <FileUpload
              label="Foto Pelatihan"
              onFileChange={handleFileChange}
              accept="image/*"
              currentFile={formData.foto}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <InputText
                label="Kapasitas"
                value={formData.kapasitas}
                onChange={(e) => handleInputChange('kapasitas', e.target.value)}
                placeholder="30 peserta"
              />
              <InputText
                label="Biaya"
                value={formData.biaya}
                onChange={(e) => handleInputChange('biaya', e.target.value)}
                placeholder="Rp. 2,500,000"
              />
            </div>
            
            <InputText
              label="Instruktur"
              value={formData.instruktur}
              onChange={(e) => handleInputChange('instruktur', e.target.value)}
              placeholder="Nama instruktur"
            />
            
            <InputText
              label="Lokasi"
              value={formData.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Lokasi pelatihan"
            />
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Deskripsi pelatihan"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
};