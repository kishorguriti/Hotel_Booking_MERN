import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { assetsIcons } from "../../common/utility";
import { useTranslation } from "react-i18next";
import "./style.css";

export default function SimpleDialogDemo({ setShowTooltip }) {
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));
  const userLanguage = localStorage.getItem("userLanguage");
  const navigatesTo = useNavigate();
  const [language, setLanguage] = useState(userLanguage ? userLanguage : null);

  const { t, i18n } = useTranslation();

  const handleChange = (event) => {
    setLanguage(event.target.value);
    localStorage.removeItem("i18nextLng");
    localStorage.removeItem("userLanguage");

    localStorage.setItem("i18nextLng", event.target.value);
    localStorage.setItem("userLanguage", event.target.value);

    window.location.reload();
  };

  const loggingOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("isshowTourGuide");

    navigatesTo("/Booking.com");
    setShowTooltip(false);
  };

  return (
    <Box
      className="card_style"
      onMouseLeave={() => setShowTooltip(false)}
      sx={{
        display: "flex ",
        flexDirection: "column",
        gap: 1,
        p: "0px",
      }}
    >
      <Box
        className="profie_card_list_item mt-2"
        onClick={() =>
          navigatesTo(`/Booking.com/user/${loginUser.username}/profile`)
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={assetsIcons.user_Icon} sx={{ width: 16, height: 16 }} />
          <Typography>{t("Profile")}</Typography>
        </Box>
      </Box>
      <Box
        className="profie_card_list_item"
        onClick={() =>
          navigatesTo(`/Booking.com/user/${loginUser.username}/profile`)
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={assetsIcons.manage_accoutns}
            sx={{ width: 16, height: 16 }}
          />
          <Typography>{t("Manage account")}</Typography>
        </Box>
      </Box>
      <Box
        className="profie_card_list_item"
        onClick={() =>
          navigatesTo(
            `/Booking.com/user/${loginUser.username}/profile/bookings`
          )
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={assetsIcons.bookingsIcons}
            sx={{ width: 16, height: 16 }}
          />
          <Typography>{t("Bookings & Trips")}</Typography>
        </Box>
      </Box>
      <Box className="profie_card_list_item">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={assetsIcons.reviewsIcon}
            sx={{ width: 16, height: 16 }}
          />
          <Typography>{t("Reviews")}</Typography>
        </Box>
      </Box>
      <Box className="profie_card_list_item">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={assetsIcons.settings} sx={{ width: 16, height: 16 }} />
          <Typography>{t("Settings")}</Typography>
        </Box>
      </Box>
      <Box className="profie_card_list_item">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={assetsIcons.language} sx={{ width: 18, height: 18 }} />

          <InputLabel id="demo-select-small-label" sx={{ fontSize: "12px" }}>
            {t("language")}
          </InputLabel>
          <Select
            sx={{ fontSize: "12px", height: "30px", minWidth: "80px" }}
            id="demo-select-small"
            value={language}
            label="Language"
            onChange={handleChange}
            defaultValue={userLanguage}
          >
            <MenuItem
              sx={{ fontSize: "12px" }}
              value={"en"}
              disabled={language === "en"}
            >
              {t("English")}
            </MenuItem>
            <MenuItem
              sx={{ fontSize: "12px" }}
              value={"te"}
              disabled={language === "te"}
            >
              {t("తెలుగు")}
            </MenuItem>
          </Select>
        </Box>
      </Box>
      <Box className="profie_card_list_item mb-2" onClick={loggingOut}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={assetsIcons.logout} sx={{ width: 16, height: 16 }} />
          <Typography>{t("Sign out")}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
