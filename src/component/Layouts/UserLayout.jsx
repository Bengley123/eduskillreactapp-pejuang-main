// src/layouts/UserLayout.jsx
import React from 'react';
import NavbarComponent from "../Fragments/NavbarComponent";
import FooterComponent from '../Fragments/Footercomponent';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div>
      <NavbarComponent />
      <Outlet />
      <FooterComponent />
    </div>
  );
}
