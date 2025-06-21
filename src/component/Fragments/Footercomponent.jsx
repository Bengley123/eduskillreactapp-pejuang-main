import React from "react";
import ContactInfo from "../Elements/FootWeb/ContactInfo";
import ResourcesLinks from "../Elements/FootWeb/ResourceLink";
import SocialIcons from "../Elements/FootWeb/SocialIcons";

const FooterComponent = () => {
  return (
    <footer className="bg-[#305CDE] py-3 shadow text-white px-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <ContactInfo />
        <ResourcesLinks />
        <SocialIcons />
      </div>
      {/* <div className="text-center text-sm text-gray-400 mt-6">© 2025 BINA ESSA. All rights reserved.</div> */}
    </footer>
  );
};

export default FooterComponent;
