import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CreateIcon from "@mui/icons-material/Create";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import notify from "../../components/ToastMessage";
import "./style.css";
import ApiMethods from "../../api/methods";

const User_Profile = ({ setActiveStep, activeStep, steps }) => {
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [editable, setEditable] = useState(false);
  const { t, i18n } = useTranslation();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [previoususerInfo, setPreviousUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
  

    let result = await ApiMethods.get("users", {}, {}, loginUser._id);

    const { username, email, password } = result.data;

    setPreviousUserInfo((prev) => ({ ...prev, ...result.data })); //from backend info

    setUserInfo((prev) => ({ ...prev, ...result.data })); // to update when user edit info
  };

  const updateUserData = async () => {
   
    try {
      if (
        previoususerInfo?.username !== userInfo?.username ||
        previoususerInfo?.email !== userInfo.email ||
        previoususerInfo?.password !== userInfo?.password
      ) {
        
        let validateUser = await ApiMethods.post("users-validate", userInfo);
        if (validateUser.status == "200") {
          const upadtingUserData = await ApiMethods.put(
            "users-update",
            userInfo ,
            {},
            loginUser?._id
          );

          localStorage.setItem(
            "loggedUser",
            JSON.stringify(upadtingUserData.data)
          );
          setActiveStep((prev) => prev + 1);
        }
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      
      if (
        error?.response?.data?.Error == "Username Already Exist"
        // &&
        // previoususerInfo?.username !== userInfo?.username
      ) {
       

        notify(error?.response?.data?.Error, "fail");
        return;
      } else if (
        error?.response?.data?.Error == "Email Already Exist"
        // &&
        // previoususerInfo?.email !== userInfo.email
      ) {
      

        notify(error?.response?.data?.Error, "fail");
        return;
      } else {
      
        try {
          const upadtingUserData = await ApiMethods.put(
            "users-update",
            userInfo ,
            {},
            loginUser?._id
          );
          localStorage.setItem("loggedUser",  JSON.stringify(upadtingUserData.data));
          setActiveStep((prev) => prev + 1);
        } catch (error) {
          notify("Username Already Exist", "fail");
        }
      }
    }

    //update
    return;
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
        {!editable ? (
          <Box
            sx={{
              position: "relative",
              height: "30px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="edit"
              sx={{
                position: "absolute",
                right: 10,
                top: -5,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setEditable(true)}
              className="onEdit"
            >
              <CreateIcon />
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => setEditable(true)}
              >
                {t("Edit")}
              </Typography>
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ height: "30px" }}></Box>
        )}
        <TextField
          label="User Name"
          value={userInfo?.username}
          onChange={(e) =>
            setUserInfo({ ...userInfo, username: e.target.value })
          }
          disabled={!editable}
          sx={{ backgroundColor: !editable ? "#f2f2f2" : "initial" }}
        />
        <TextField
          label="Email"
          value={userInfo?.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          disabled={true}
          sx={{ backgroundColor: !editable ? "#f2f2f2" : "#f2f2f2" }}
        />
        {/* <TextField
          label="password"
          id="user_password"
          type="password"
          value={userInfo?.password}
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
          disabled={true}
          sx={{ backgroundColor: !editable ? "#f2f2f2" : "#f2f2f2" }}
        /> */}
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", ml: 1, mr: 1 }}
      >
        {activeStep >= 2 ? (
          <Button onClick={() => setActiveStep((prev) => prev - 1)}>
            {t("Back")}
          </Button>
        ) : (
          <span></span>
        )}
        {activeStep < steps.length && !editable ? (
          <Button onClick={() => setActiveStep((prev) => prev + 1)}>
            {t("Next")}
          </Button>
        ) : (
          <Button onClick={() => updateUserData()}>
            {t("Save and Continue")}
          </Button>
        )}
      </Box>
    </>
  );
};
export default User_Profile;
