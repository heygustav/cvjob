
import React from "react";
import { CoverLetter } from "@/lib/types";
import { PreviewStep } from "./PreviewStep";

interface LetterPreviewStepProps {
  generatedLetter: CoverLetter;
  onEdit: (content: string) => Promise<void>;
}

const LetterPreviewStep: React.FC<LetterPreviewStepProps> = ({
  generatedLetter,
  onEdit,
}) => {
  return (
    <PreviewStep 
      generatedLetter={generatedLetter} 
      onEdit={onEdit}
    />
  );
};

export default LetterPreviewStep;
