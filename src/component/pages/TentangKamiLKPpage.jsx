import React, { useEffect, useState } from "react";
import axios from "axios";
import TentangKamiContent from "../Fragments/TentangKamiContent";

export default function TentangKamiLKPPage() {
  const [profile, setProfile] = useState(null);
  const [visiMisi, setVisiMisi] = useState({ visi: "", misi: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, visiMisiRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/profile-lkp"),
          axios.get("http://127.0.0.1:8000/api/informasi-lembaga"),
        ]);

        setProfile(profileRes.data.data);
        const vm = Array.isArray(visiMisiRes.data.data)
          ? visiMisiRes.data.data[0]
          : visiMisiRes.data.data;
        setVisiMisi({ visi: vm.visi || "", misi: vm.misi || "" });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center">Memuat data...</p>;
  if (!profile) return <p className="text-center">Data tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16 px-4">
      <TentangKamiContent
        title={profile.nama_lkp}
        image={profile.foto_lkp} // ← langsung dari API
        alt="Logo LKP Bina ESSA"
        description={
          <>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Visi</h3>
              <p className="mb-4 whitespace-pre-wrap">{visiMisi.visi}</p>
              <h3 className="text-xl font-bold mb-2">Misi</h3>
              <p className="whitespace-pre-wrap">{visiMisi.misi}</p>
            </div>
            <br></br>
            <p className="mb-4 whitespace-pre-wrap">{profile.deskripsi_lkp}</p>
          </>
        }
      />
    </div>
  );
}
