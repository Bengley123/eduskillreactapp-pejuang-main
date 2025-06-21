import React from "react";
import Button from "../Elements/Button/index";

const StatusStepper = ({ steps, currentStep, statusString, onFeedback }) => {
  const isRejected = statusString === "Ditolak";
  const rejectionStepIndex = steps.indexOf("Lolos Seleksi");

  return (
    <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Status Lamaran</h3>
      <ol className="relative border-l-2 border-gray-300 ml-4">
        {steps.map((step, index) => {
          let isCompleted;

          // Penentuan step aktif
          if (isRejected) {
            isCompleted = index <= rejectionStepIndex;
          } else {
            isCompleted = index <= currentStep;
          }

          // Warna lingkaran step
          const circleColor = isRejected && index === rejectionStepIndex
            ? "bg-red-600"
            : isCompleted
            ? "bg-blue-600"
            : "bg-gray-300";

          // Warna teks step
          const textColor = isRejected && index === rejectionStepIndex
            ? "text-red-600 font-semibold"
            : isCompleted
            ? "text-blue-700 font-semibold"
            : "text-gray-500";

          return (
            <li key={index} className="mb-10 ml-6 relative">
              <span
                className={`absolute flex items-center justify-center w-4 h-4 rounded-full 
                  -left-5 top-1 ${circleColor}`}
              />
              <p className={textColor}>
                {step}
              </p>

              {/* Feedback tombol hanya ditampilkan jika belum ditolak dan sudah sampai step 4 */}
              {step === "Feedback Pelatihan" && !isRejected && currentStep >= 3 && (
                <div className="mt-2">
                  <Button variant="secondary" size="sm" onClick={onFeedback}>
                    Beri Feedback
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Pesan penolakan */}
      {isRejected && (
        <div className="mt-4 text-center text-red-600 font-semibold">
          Maaf kamu belum diterima di pelatihan ini!
        </div>
      )}
    </div>
  );
};

export default StatusStepper;
