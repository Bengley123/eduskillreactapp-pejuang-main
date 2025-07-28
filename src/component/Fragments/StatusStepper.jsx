// StatusStepper.jsx
import React from "react";
import Button from "../Elements/Button/index";

const StatusStepper = ({
  steps,
  currentStep,
  statusString,
  trainingStatus,
  onFeedback,
}) => {
  const isRejected = statusString === "Ditolak";
  const lolosSeleksiIndex = steps.indexOf("Lolos Seleksi");
  const unggahPersyaratanIndex = steps.indexOf("Unggah Persyaratan");
  const pelaksanaanPelatihanIndex = steps.indexOf("Pelaksanaan Pelatihan");
  const feedbackPelatihanIndex = steps.indexOf("Feedback Pelatihan"); // Dapatkan indeks "Feedback Pelatihan"
  const selesaiPelatihanIndex = steps.indexOf("Selesai Pelatihan"); // Dapatkan indeks "Selesai Pelatihan"

  return (
    <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Status Lamaran
      </h3>
      <ol className="relative border-l-2 border-gray-300 ml-4">
        {steps.map((step, index) => {
          let isStepCompleted = false;
          let isStepRejected = false;
          let showLolosMessage = false;
          let showRejectedMessage = false;

          if (isRejected) {
            if (index === unggahPersyaratanIndex) {
              isStepCompleted = true;
            } else if (index === lolosSeleksiIndex) {
              isStepRejected = true;
              showRejectedMessage = true;
            }
          } else {
            // Logika dasar berdasarkan currentStep (status pendaftaran peserta)
            isStepCompleted = index <= currentStep;

            // LOGIKA UNTUK "Pelaksanaan Pelatihan"
            if (index === pelaksanaanPelatihanIndex) {
              // Jika peserta sudah lolos seleksi
              // DAN status pelatihan adalah 'Sedang berlangsung' atau 'Selesai'
              if (
                currentStep >= lolosSeleksiIndex &&
                (trainingStatus === "Sedang berlangsung" ||
                  trainingStatus === "Selesai")
              ) {
                isStepCompleted = true;
              }
            }

            // LOGIKA UNTUK "Feedback Pelatihan"
            if (index === feedbackPelatihanIndex) {
              // Jika peserta sudah lolos seleksi (atau sudah melewati Pelaksanaan Pelatihan secara logis)
              // DAN status pelatihan adalah 'Selesai'
              // ATAU status pendaftaran peserta adalah 'menunggu_feedback'
              if (
                currentStep >= lolosSeleksiIndex &&
                trainingStatus === "Selesai"
              ) {
                isStepCompleted = true;
              }
            }

            // LOGIKA UNTUK "Selesai Pelatihan"
            if (index === selesaiPelatihanIndex) {
              // Jika peserta sudah lolos seleksi (atau sudah melewati Feedback Pelatihan secara logis)
              // DAN status pelatihan adalah 'Selesai'
              // ATAU status pendaftaran peserta adalah 'selesai'
              if (
                currentStep >= lolosSeleksiIndex &&
                trainingStatus === "Selesai"
              ) {
                isStepCompleted = true;
              }
            }

            // Pastikan langkah-langkah sebelumnya juga dianggap selesai jika langkah yang lebih jauh sudah selesai
            // Ini penting agar jalur hijau berlanjut dengan benar
            if (
              index > 0 &&
              isStepCompleted &&
              !steps[index - 1].isStepCompleted
            ) {
              // Jika langkah saat ini selesai, pastikan langkah sebelumnya juga selesai
              // Ini mungkin tidak perlu jika `currentStep` selalu progresif,
              // tetapi bisa membantu jika ada lompatan status.
              // Namun, dengan `index <= currentStep` di awal, ini sudah tercakup.
              // Jadi, lebih baik fokus pada kondisi spesifik per langkah.
            }

            // Tampilkan pesan lolos jika ini langkah "Lolos Seleksi" dan sudah selesai
            if (
              index === lolosSeleksiIndex &&
              currentStep >= lolosSeleksiIndex
            ) {
              showLolosMessage = true;
            }
          }

          const circleColor = isStepRejected
            ? "bg-red-600"
            : isStepCompleted
            ? "bg-green-600"
            : "bg-gray-300";

          const textColor = isStepRejected
            ? "text-red-600 font-semibold"
            : isStepCompleted
            ? "text-green-700 font-semibold"
            : "text-gray-500";

          return (
            <li key={index} className="mb-10 ml-6 relative">
              <span
                className={`absolute flex items-center justify-center w-4 h-4 rounded-full 
                  -left-5 top-1 ${circleColor}`}
              />
              <p className={textColor}>{step}</p>

              {showLolosMessage && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  Selamat kamu lolos pada tahap seleksi di pelatihan ini!
                </p>
              )}

              {showRejectedMessage && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  Maaf kamu belum diterima di pelatihan ini!
                </p>
              )}

              {/* Tombol Feedback hanya muncul jika:
                  1. Ini adalah langkah "Feedback Pelatihan"
                  2. Status bukan ditolak
                  3. Pelatihan sudah selesai (trainingStatus === 'Selesai')
                     ATAU status pendaftaran peserta adalah 'menunggu_feedback'
              */}
              {step === "Feedback Pelatihan" &&
                !isRejected &&
                (trainingStatus === "Selesai" ||
                  currentStep === feedbackPelatihanIndex) && (
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
    </div>
  );
};

export default StatusStepper;