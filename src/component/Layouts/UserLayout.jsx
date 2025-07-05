// src/layouts/UserLayout.jsx
import React from "react";
import NavbarComponent from "../Fragments/NavbarComponent";
import FooterComponent from "../Fragments/Footercomponent";
import { Outlet } from "react-router-dom";
import { SessionTimeoutProvider } from "../Layouts/Contexts/SessionTimeoutProvider";

export default function UserLayout() {
  const isLoggedIn = !!localStorage.getItem("jwt");

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
