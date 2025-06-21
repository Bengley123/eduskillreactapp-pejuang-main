import React from "react";
import { FaEnvelope, FaPhone, FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import logo from '../assets/logo-bina-essa1.jpg';


const FooterComponent = () => {
  return (
    <footer className="bg-blue-500 text-dark py-10 px-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        {/* Logo dan Kontak */}
        <div>
          {/* <h3 className="text-xl font-bold mb-2">BINA ESSA</h3> */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo Bina Essa" className="h-12 bg-white rounded" />
              <div>
                <div className="text-xs leading-tight font-bold text-dark">LEMBAGA KURSUS DAN PELATIHAN</div>
                <div className="text-xl font-bold -mt-1 text-dark">BINA ESSA</div>
              </div>
            </div>
          <p className="text-white">Jl. Griya Pesona No.1.C, Gunungleutik, Kec. Ciparay,<br/>Kabupaten Bandung, Jawa Barat 40381
          </p><br/>
          <p className="text-lg font-semibold mb-2">Call Center</p>
          <ul className="text-sm space-y-1">
            <li><FaEnvelope className="inline mr-2" /> Email</li>
            <li><FaPhone className="inline mr-2" /> No.tel</li>
            <li><FaWhatsapp className="inline mr-2" /> No.wa</li>
            <li><FaInstagram className="inline mr-2" /> Insta</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Resources</h4>
          <ul className="text-sm space-y-1 text-white">
            <li>Publikasi</li>
            <li>Pelayanan Publik</li>
            <li>FAQ</li>
            <li>Hubungi Kami</li>
          </ul>
        </div>

        {/* Tetap Terhubung */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Tetap Terhubung</h4>
          <div className="flex space-x-3 text-xl">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaYoutube />
            <FaTiktok />
          </div>
        </div>
      </div>

      {/* <div className="text-center text-sm text-gray-400 mt-6">© 2025 BINA ESSA. All rights reserved.</div> */}
    </footer>
  );
};

export default FooterComponent;
