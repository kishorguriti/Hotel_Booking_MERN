import React, { useEffect, useState } from "react";
import "./style.css";
import StepperComponent from "../../components/StepperComponent";
import User_Profile from "../../Pages/User_Profile";
import Upload_Profile_Image from "../../Pages/Upload_Profile_Image";

const Profile = () => {

  const steps = ["UserInfo", "Upload Profile Image"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  return (
    <>
      <StepperComponent
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={steps}
      />
      {activeStep === 0 && (
        <User_Profile
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={steps}
        />
      )}
      {activeStep === 1 && (
        <Upload_Profile_Image
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={steps}
        />
      )}

      {activeStep === 2 && (
        <Upload_Profile_Image
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={steps}
        />
      )}
    </>
  );
};

export default Profile;
