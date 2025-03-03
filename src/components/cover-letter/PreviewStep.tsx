
import React from "react";
import { CoverLetter } from "@/lib/types";
import CoverLetterPreview from "./preview/CoverLetterPreview";
import DOMPurify from "dompurify";

export interface PreviewStepProps {
  generatedLetter: CoverLetter;
  onEdit: (content: string) => Promise<void>;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  generatedLetter,
  onEdit,
}) => {
  // Handle content sanitization before passing to components
  const safeContent = generatedLetter?.content 
    ? DOMPurify.sanitize(generatedLetter.content) 
    : "";
    
  // Safely handle content editing
  const handleSafeEdit = async (content: string) => {
    // Sanitize content before saving
    const sanitizedContent = DOMPurify.sanitize(content);
    await onEdit(sanitizedContent);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border">
        <CoverLetterPreview 
          content={safeContent}
          onEdit={handleSafeEdit}
          isEditable={true}
        />
      </div>
    </div>
  );
};
