import React from "react";

const NavLink = ({ href, children }) => (
  <a href={href} className="text-white hover:underline">
    {children}
  </a>
);

export default NavLink;
