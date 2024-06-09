import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";

const SideNav = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="booking">
      <div className="side_nav">
        <div className="list_item" onClick={() => navigate("")}>
          {t("Profile")}
        </div>
        <div
          className="list_item"
          onClick={() => navigate("bookings?status=completed")}
        >
          {t("Bookings & Trips")}
        </div>
        <div className="list_item" onClick={() => navigate("MyFavourite")}>
          {t("Favourite")}
        </div>
        <div className="list_item" onClick={() => navigate("Analytics")}>
          {t("Analytics")}
        </div>
      </div>
      <div className="out_let">
        <Outlet />
      </div>
    </div>
  );
};

export default SideNav;
