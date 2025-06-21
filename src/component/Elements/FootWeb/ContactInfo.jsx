import React from "react";
import { FaEnvelope, FaPhone, FaWhatsapp, FaInstagram } from "react-icons/fa";
//import IconText from "../atoms/IconText";
import IconText from "./IconText";

const ContactInfo = () => (
  <div>
    <h3 className="text-xl font-bold mb-2">BINA ESSA</h3>
    <ul className="space-y-1">
      <IconText icon={FaEnvelope} text="binaessa@example.com" />
      <IconText icon={FaPhone} text="(021) 1234-5678" />
      <IconText icon={FaWhatsapp} text="0812-3456-7890" />
      <IconText icon={FaInstagram} text="@binaessa" />
    </ul>
  </div>
);

export default ContactInfo;
