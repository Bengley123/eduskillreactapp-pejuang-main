import React, { useEffect, useState } from "react";
import LogoSection from "../Elements/NavWeb/LogoSection";
import NavMenu from "../Elements/NavWeb/NavMenu";
import NavButton from "../Elements/NavWeb/NavButton";

const NavbarComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <nav className="bg-[#305CDE] py-3 shadow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <LogoSection />
        <div className="flex items-center space-x-6">
          <NavMenu isLoggedIn={isLoggedIn} />
          <NavButton isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
