import React, { useContext } from "react";
import NavbarComponent from "../Fragments/NavbarComponent";
import FooterComponent from "../Fragments/Footercomponent";
import { Outlet } from "react-router-dom";
import { SessionTimeoutProvider } from "../Layouts/Contexts/SessionTimeoutProvider";
import { AuthContext } from "../Layouts/Contexts/AuthContext";

export default function UserLayout() {
  const { isLoggedIn } = useContext(AuthContext);

  const layoutContent = (
    <div className="flex flex-col min-h-screen">
      <NavbarComponent />
      <main className="flex-grow">
        <Outlet /> {/* Halaman akan dirender di sini */}
      </main>
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