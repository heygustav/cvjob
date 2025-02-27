
import React from "react";
import CoverLetterPreview from "../CoverLetterPreview";
import { CoverLetter, JobPosting } from "@/lib/types";

interface PreviewStepProps {
  generatedLetter: CoverLetter;
  selectedJob: JobPosting;
  onEdit: (content: string) => Promise<void>;
  onSave: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  generatedLetter,
  selectedJob,
  onEdit,
  onSave
}) => {
  return (
    <div className="p-4 sm:p-6">
      <CoverLetterPreview
        content={generatedLetter.content}
        jobTitle={selectedJob.title}
        company={selectedJob.company}
        onEdit={onEdit}
        onSave={onSave}
      />
    </div>
  );
};

export default PreviewStep;
