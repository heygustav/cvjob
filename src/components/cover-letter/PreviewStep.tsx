
import React from "react";
import { CoverLetter } from "@/lib/types";
import CoverLetterPreview from "./preview/CoverLetterPreview";

export interface PreviewStepProps {
  generatedLetter: CoverLetter;
  onEdit: (content: string) => Promise<void>;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  generatedLetter,
  onEdit,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border">
        <CoverLetterPreview 
          content={generatedLetter.content}
          onEdit={onEdit}
          isEditable={true}
        />
      </div>
    </div>
  );
};
