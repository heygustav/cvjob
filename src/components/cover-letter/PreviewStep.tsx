
import React from "react";
import CoverLetterPreview from "./preview";
import { CoverLetter, JobPosting } from "@/lib/types";

interface PreviewStepProps {
  generatedLetter: CoverLetter;
  selectedJob: JobPosting;
  onEdit: (content: string) => Promise<void>;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  generatedLetter,
  selectedJob,
  onEdit
}) => {
  return (
    <div className="p-4 sm:p-6">
      <CoverLetterPreview
        content={generatedLetter.content}
        jobTitle={selectedJob.title}
        company={selectedJob.company}
        onEdit={onEdit}
      />
    </div>
  );
};

export default PreviewStep;
