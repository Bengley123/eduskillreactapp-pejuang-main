import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const SocialIcons = () => (
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
);

export default SocialIcons;
