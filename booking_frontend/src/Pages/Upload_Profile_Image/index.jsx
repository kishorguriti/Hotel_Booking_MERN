import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Card from "@mui/material/Card";
import notify from "../../components/ToastMessage";
import { Password } from "@mui/icons-material";
import ApiMethods from "../../api/methods";

const Upload_Profile_Image = ({ activeStep, setActiveStep, steps }) => {
  const { t, i18n } = useTranslation();
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));

  const [selectedProfileImage, setSelectedProfileImage] = useState(
    loginUser?.profileImage
  );

  const [generatedCloudUrl, setGeneratedCloudUrl] = useState(
    loginUser?.profileImage
  );


const updateUser= async ()=>{
  try {
   let updateUser = await ApiMethods.put('users-update-uploadProfile', {
        profileImage: generatedCloudUrl, 
      } , {} , loginUser?._id )
   
    localStorage.removeItem("loggedUser");
    localStorage.setItem("loggedUser", JSON.stringify(updateUser.data));
    notify("Profile Updated", "succuss");
    setTimeout(() => {
      window.location.reload();
    }, 3400);
  } catch (err) {
    return ''
  }
}

  const handleChange = async (e) => {
   
    setSelectedProfileImage(e.target.files[0]);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "profilepicture"); // at the time of creating cloudinary account
    data.append("cloud_name", "dyvdwtjoy"); // at the time of creating cloudinary account

    const selectedImageCloudinaryUrl = await axios.post(
      `https://api.cloudinary.com/v1_1/dyvdwtjoy/image/upload`,
      data
    );

    setGeneratedCloudUrl(selectedImageCloudinaryUrl.data.url);
  };

 
  
  

  const handleSubmit = ()=>{
    return
  }

  return (
    <>
      {selectedProfileImage && (
        <Card
          sx={{ maxWidth: 320, maxHeight: 320, m: 4, width:"100%" }}
        >
          <img
            src={generatedCloudUrl}
            style={{ objectFit: "fill" ,borderRadius: "100%"  }}
            alt="selected_image"
            height={300}
            width={"100%"}
          />
        </Card>
      )}

      <Box sx={{ m: 4 }}>
        <form>
          <input type="file" sx={{ mt: 3 }} onChange={handleChange} />
          <Button
            onClick={handleSubmit}
            disabled={selectedProfileImage === loginUser?.profileImage}
          >
            Upload
          </Button>
        </form>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", ml: 1, mr: 1 }}
      >
        <Button onClick={() => setActiveStep((prev) => prev - 1)}>
          {t("Back")}
        </Button>

        {steps.length > activeStep + 1 ? (
          <Button onClick={() => setActiveStep((prev) => prev + 1)}>
            {t("Next")}
          </Button>
        ) : (
          <Button onClick={() => updateUser()}>{t("Finish")}</Button>
        )}
      </Box>
    </>
  );
};

export default Upload_Profile_Image;
