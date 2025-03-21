
import React, { useState } from "react";
import { CoverLetter, JobPosting } from "@/lib/types";
import { useLetterDownload } from "./letter-utils/useLetterDownload";
import LetterTable from "./letter-components/LetterTable";
import DeleteLetterDialog from "./letter-components/DeleteLetterDialog";

interface LetterListComponentProps {
  coverLetters: CoverLetter[];
  jobPostings: JobPosting[];
  isDeleting: boolean;
  onLetterDelete: (id: string) => void;
  findJobForLetter: (jobPostingId: string) => JobPosting | undefined;
}

const LetterListComponent: React.FC<LetterListComponentProps> = ({
  coverLetters,
  jobPostings,
  isDeleting,
  onLetterDelete,
  findJobForLetter,
}) => {
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);
  const { isDownloading, handleDownloadPdf, handleDownloadDocx, handleDownloadTxt } = useLetterDownload();

  const handleDeleteClick = (id: string) => {
    setLetterToDelete(id);
  };

  const confirmDelete = () => {
    if (letterToDelete) {
      onLetterDelete(letterToDelete);
      setLetterToDelete(null);
    }
  };

  const cancelDelete = () => {
    setLetterToDelete(null);
  };

  // Find job info for the letter to delete
  const letterToDeleteJob = letterToDelete 
    ? findJobForLetter(coverLetters.find(letter => letter.id === letterToDelete)?.job_posting_id || '')
    : undefined;
  
  // Get a descriptive name for the letter based on job info
  const letterDescriptiveName = letterToDeleteJob 
    ? `ansøgning til ${letterToDeleteJob.title || 'stillingen'}`
    : "ansøgning";

  return (
    <div className="overflow-hidden">
      <LetterTable 
        coverLetters={coverLetters}
        findJobForLetter={findJobForLetter}
        onLetterDelete={handleDeleteClick}
        onDownloadPdf={(letter) => handleDownloadPdf(letter, findJobForLetter(letter.job_posting_id))}
        onDownloadDocx={(letter) => handleDownloadDocx(letter, findJobForLetter(letter.job_posting_id))}
        onDownloadTxt={(letter) => handleDownloadTxt(letter, findJobForLetter(letter.job_posting_id))}
        isDownloading={isDownloading}
      />

      <DeleteLetterDialog 
        isOpen={!!letterToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        letterTitle={letterDescriptiveName}
      />
    </div>
  );
};

export default LetterListComponent;
