import React from "react";
import MyNavbar from "../components/MyNavbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <MyNavbar />
      <Outlet />
    </>
  );
}

export default Layout;
