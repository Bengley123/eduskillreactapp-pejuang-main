// StatusStepper.jsx
import React from "react";
import Button from "../Elements/Button/index";

const StatusStepper = ({
  steps,
  currentStep,
  statusString,
  trainingStatus,
  onFeedback,
  hasFeedback = false,
  checkingFeedback = false,
}) => {
  const isRejected = statusString === "Ditolak";
  const lolosSeleksiIndex = steps.indexOf("Lolos Seleksi");
  const unggahPersyaratanIndex = steps.indexOf("Unggah Persyaratan");
  const pelaksanaanPelatihanIndex = steps.indexOf("Pelaksanaan Pelatihan");
  const feedbackPelatihanIndex = steps.indexOf("Feedback Pelatihan");
  const selesaiPelatihanIndex = steps.indexOf("Selesai Pelatihan");

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
              if (
                currentStep >= lolosSeleksiIndex &&
                trainingStatus === "Selesai"
              ) {
                isStepCompleted = true;
              }
            }

            // LOGIKA UNTUK "Selesai Pelatihan"
            if (index === selesaiPelatihanIndex) {
              if (
                currentStep >= lolosSeleksiIndex &&
                trainingStatus === "Selesai"
              ) {
                isStepCompleted = true;
              }
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

              {/* Feedback section */}
              {step === "Feedback Pelatihan" && (
                <div className="mt-2">
                  {!isRejected &&
                    (trainingStatus === "Selesai" ||
                      currentStep === feedbackPelatihanIndex) && (
                      <div>
                        {checkingFeedback ? (
                          // Loading state saat checking feedback
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">
                              Mengecek status feedback...
                            </span>
                          </div>
                        ) : hasFeedback ? (
                          // If peserta has ANY feedback, show completed message
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-green-700 text-sm font-medium">
                              ✅ Feedback sudah dikirim
                            </p>
                            <p className="text-green-600 text-xs mt-1">
                              Terima kasih atas feedback Anda.
                            </p>
                          </div>
                        ) : (
                          // If no feedback exists, show the button
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-blue-700 text-sm mb-2">
                              Berikan feedback Anda untuk pelatihan ini
                            </p>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={onFeedback}
                            >
                              Beri Feedback
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
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