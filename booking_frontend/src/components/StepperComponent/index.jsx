import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";


export default function HorizontalNonLinearStepper({
  setActiveStep,
  activeStep,
  steps,
}) {
  
  // const totalSteps = () => {
  //   return steps.length;
  // };



  const handleStep = (step) => () => {
    setActiveStep(step);
  };

 

  return (
    <Box>
      <Stepper
        nonLinear
        activeStep={activeStep}
        sx={{ display: "flex", justifyContent: "flex-start" }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
     
    </Box>
  );
}
