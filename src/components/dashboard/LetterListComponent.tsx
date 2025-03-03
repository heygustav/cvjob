
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

  return (
    <div className="overflow-hidden">
      <LetterTable 
        coverLetters={coverLetters}
        findJobForLetter={findJobForLetter}
        onLetterDelete={handleDeleteClick}
        onDownloadPdf={handleDownloadPdf}
        onDownloadDocx={handleDownloadDocx}
        onDownloadTxt={handleDownloadTxt}
        isDownloading={isDownloading}
      />

      <DeleteLetterDialog 
        isOpen={!!letterToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default LetterListComponent;
