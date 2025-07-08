import React from "react";
import Button from "../Elements/Button/index";

const ProfileCard = ({ user, onEdit }) => {
  const displayName = user.name || user.username || "Pengguna";
  const displayEmail = user.email || "Tidak ada email";

  // Akses data spesifik dari relasi 'peserta' jika user.peserta ada
  const pesertaData = user.peserta;
  const displayNoTelp = pesertaData ? pesertaData.nomor_telp : "Tidak tersedia";

  return (
    <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{displayName}</h2>
          <p className="text-gray-600 text-sm">Email :{displayEmail}</p>
          <p className="text-gray-600 text-sm">No Hp: {displayNoTelp}</p>
        </div>
      </div>
      <Button variant="primary" size="lg" onClick={onEdit}>
        Edit Profil
      </Button>
    </div>
  );
};

export default ProfileCard;
