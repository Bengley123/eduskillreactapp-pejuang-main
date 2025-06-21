import React from "react";
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";
import logo from "../../../assets/binna-essa.png";

const LogoSection = () => (
  <Link to="/" className="flex space-x-3 h-[80px]">
    <LogoImage src={logo} alt="Logo Bina Essa" />
    <LogoText />
  </Link>
);

export default LogoSection;
