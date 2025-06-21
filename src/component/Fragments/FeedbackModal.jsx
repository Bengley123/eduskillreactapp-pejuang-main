import React from "react";
import Button from "../Elements/Button/index";

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  feedback,
  setFeedback,
  workplace,
  setWorkplace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Beri Feedback Pelatihan</h2>

        {/* Input Tempat Kerja */}
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-3"
          placeholder="Masukkan Tempat Kerja Anda (Opsional)"
          value={workplace}
          onChange={(e) => setWorkplace(e.target.value)}
        />

        {/* Textarea Feedback */}
        <textarea
          rows="5"
          className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
          placeholder="Tulis feedback Anda di sini..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {/* Tombol */}
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" size="sm" onClick={onSubmit}>
            Kirim Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
