import React, { useEffect } from "react"; // <--- Tambahkan useEffect di sini
import { Routes, Route } from "react-router-dom";

import UserLayout from "./component/Layouts/UserLayout";
import AdminLayout from "./component/Layouts/AdminLayout";
import KetuaLayout from "./component/Layouts/KetuaLayout";

import LoginPage from "./component/pages/Loginpage";
import RegisterPage from "./component/pages/Registerpage";
import LandingPage from "./component/pages/Landingpage";
import DaftarPage from "./component/pages/Daftarpage";
import DetailPelatihan from "./component/pages/DetailPelatihan";
import GaleriPage from "./component/pages/Galeripage";
import DetailBeritaPage from "./component/pages/DetailBeritapage";
import TentangKamiLPKPage from "./component/pages/TentangKamiLPKpage";
import TentangKamiLKPPage from "./component/pages/TentangKamiLKPpage";
import TentangKamiYayasanPage from "./component/pages/TentangKamiYayasanpage";
import LupaPasswordPage from "./component/pages/LupaPasswordpage";
import PelatihanLengkapPage from "./component/pages/PelatihanLengkappage";
import BeritaLengkapPage from "./component/pages/BeritaMorepage";

import KetuaDashboardPage from "./component/pages/KetuaDashboardpage";

import AdminPesertaPage from "./component/pages/AdminPesertapage";
import AdminKontenPage from "./component/pages/AdminKontenpage";
import AdminPelatihanPage from "./component/pages/AdminPelatihanpage";
import AdminLaporanPage from "./component/pages/AdminLaporanpage";
import AdminNotifikasiPage from "./component/pages/AdminNotifikasipage";
import AdminDashboardPage from "./component/pages/AdminDashboardpage";
import ProfilePage from "./component/pages/Profilepage";
import EditProfilePage from "./component/pages/EditProfilePage";
//import StatusPendaftaranPage from "./component/pages/StatusPendaftaranpage";
import FeedBackPage from "./component/pages/Feedbackpage";
import AdminFeedbackPage from "./component/pages/AdminFeedbackpage";

import { setAuthToken } from './services/api'; 


function App() {
  // --- BARU: Tambahkan useEffect untuk mengatur token saat aplikasi dimuat ---
  useEffect(() => {
    const token = localStorage.getItem('jwt'); // Ambil token dari localStorage
    if (token) {
      setAuthToken(token); // Set token ke Axios defaults
      console.log("Auth token successfully set from localStorage."); // Pesan debug
    } else {
      console.log("No auth token found in localStorage."); // Pesan debug jika tidak ada token
    }
  }, []); // Array dependensi kosong agar hook ini hanya berjalan sekali saat komponen di-mount

  return (
    <Routes>
      {/* Layout untuk User */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/daftar/:id" element={<DaftarPage />} />
        <Route path="/tentangkamiLPK" element={<TentangKamiLPKPage />} />
        <Route path="/tentangkamiLKP" element={<TentangKamiLKPPage />} />
        <Route path="/tentangkamiYayasan" element={<TentangKamiYayasanPage />} />
        <Route path="/pelatihan/:id" element={<DetailPelatihan />} />
        <Route path="/pelatihanlengkap" element={<PelatihanLengkapPage />} />
        <Route path="/berita/:id" element={<DetailBeritaPage />} />
        <Route path="/beritalengkap" element={<BeritaLengkapPage />} /> 
        {/* <Route path="/statusdaftar" element={<StatusPendaftaranPage />} /> */}
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/feedback" element={<FeedBackPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lupapassword" element={<LupaPasswordPage />} />
        <Route path="/regis" element={<RegisterPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/editprofil" element={<EditProfilePage />} />
      </Route>

      {/* Layout untuk Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admindashboard" element={<AdminDashboardPage />} />
        <Route path="/adpeserta" element={<AdminPesertaPage />} />
        <Route path="/adkonten" element={<AdminKontenPage />} />
        <Route path="/adpelatihan" element={<AdminPelatihanPage />} />
        <Route path="/adlaporan" element={<AdminLaporanPage />} />
        <Route path="/adfeedback" element={<AdminFeedbackPage />} />
        <Route path="/adnotif" element={<AdminNotifikasiPage />} />
      </Route>

      {/* Layout untuk Ketua */}
      <Route element={<KetuaLayout />}>
        <Route path="/ketuadashboard" element={<KetuaDashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;