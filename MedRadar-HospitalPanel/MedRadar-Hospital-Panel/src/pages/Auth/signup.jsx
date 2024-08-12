import React, { useState } from 'react';
import Step1 from './Signup/Step1';
import Step2 from './Signup/Step2';
const Steps = {
  1: Step1,
  2: Step2,
};
const Signup = () => {
  const [step, setStep] = useState(1);
  const Step = Steps[step];

  const nextStep = () => {
    if (step === 1) {
      setStep(prev => prev + 1);
    }
  };

  const backStep = () => {
    if (step === 2) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <>
      <Step nextStep={nextStep} backStep={backStep} />
    </>
  );
};

export default Signup;
