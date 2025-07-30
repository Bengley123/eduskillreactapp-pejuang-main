import React from "react";
import ContactInfo from "../Elements/FootWeb/ContactInfo";
import SocialIcons from "../Elements/FootWeb/SocialIcons";

const FooterComponent = () => {
  return (
    <footer className="bg-[#305CDE] py-3 shadow text-white px-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <ContactInfo />
        <SocialIcons />
      </div>
    </footer>
  );
};

export default FooterComponent;