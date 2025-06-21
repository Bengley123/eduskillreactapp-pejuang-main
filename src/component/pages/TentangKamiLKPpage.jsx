import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TentangKamiContent from "../Fragments/TentangKamiContent";
import logo from "../../assets/logo-tentang-kami.png";

export default function TentangkamiLKPPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/profile-lkp/1')
      .then(response => {
        setProfile(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Memuat data...</p>;
  if (!profile) return <p className="text-center">Data tidak ditemukan</p>;
 
  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16 px-4">
      <TentangKamiContent
        title={profile.nama_lkp}
        image={logo}
        alt="Logo LKP Bina ESSA"
        description={
          <span>{profile.deskripsi_lkp}</span>
        }
      />
    </div>
  );
}
