// src/layouts/UserLayout.jsx
import React, { useContext } from "react";
import NavbarComponent from "../Fragments/NavbarComponent";
import FooterComponent from "../Fragments/Footercomponent";
import { Outlet } from "react-router-dom";
import { SessionTimeoutProvider } from "../Layouts/Contexts/SessionTimeoutProvider";
import { AuthContext } from "../Layouts/Contexts/AuthContext";

export default function UserLayout() {
  const { isLoggedIn } = useContext(AuthContext);

  const layoutContent = (
    <div>
      <NavbarComponent />
      <Outlet /> {/* Halaman akan dirender di sini */}
      <FooterComponent />
    </div>
  );

  if (isLoggedIn) {
    return (
      <SessionTimeoutProvider timeoutInMinutes={15}>
        {layoutContent}
      </SessionTimeoutProvider>
    );
  }

  return layoutContent;
}