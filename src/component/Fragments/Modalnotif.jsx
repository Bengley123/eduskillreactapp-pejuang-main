// src/Organisms/Modal.js
import Button from '../Elements/Button/index';
import FormField from '../Moleculs/AdminSource/FormField';
import TextArea from '../Elements/AdminSource/TextArea';

const Modal = ({ isOpen, onClose, onSubmit, notification, setNotification }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Kirim Pengumuman</h2>
          <FormField
            label="Judul Pengumuman *"
            inputProps={<Input value={notification.judul} onChange={(e) => setNotification({ ...notification, judul: e.target.value })} placeholder="Masukkan judul pengumuman" />}
          />
          <FormField
            label="Pesan *"
            inputProps={<TextArea value={notification.pesan} onChange={(e) => setNotification({ ...notification, pesan: e.target.value })} rows={5} placeholder="Masukkan isi pengumuman" />}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={onClose} className="bg-gray-100 text-gray-700">Batal</Button>
            <Button onClick={onSubmit} className="bg-blue-500 text-white">Kirim</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
