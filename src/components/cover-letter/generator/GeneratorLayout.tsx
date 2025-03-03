
import React from "react";
import { GeneratorHeader } from "../GeneratorHeader";

interface GeneratorLayoutProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  hasGeneratedLetter: boolean;
  children: React.ReactNode;
}

export const GeneratorLayout: React.FC<GeneratorLayoutProps> = ({
  step,
  setStep,
  hasGeneratedLetter,
  children,
}) => {
  return (
    <div className="container py-8">
      <GeneratorHeader 
        step={step} 
        setStep={setStep} 
        hasGeneratedLetter={hasGeneratedLetter}
      />
      {children}
    </div>
  );
};
