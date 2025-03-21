
import React from "react";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { Link } from "react-router-dom";
import { Download, FileEdit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface LetterActionsProps {
  letter: CoverLetter;
  job?: JobPosting;
  currentUser?: User;
  onDelete: (id: string) => void;
  onDownloadPdf: (letter: CoverLetter, job?: JobPosting) => void;
  onDownloadDocx: (letter: CoverLetter, job?: JobPosting) => void;
  onDownloadTxt: (letter: CoverLetter, job?: JobPosting) => void;
  isDownloading: boolean;
}

const LetterActions: React.FC<LetterActionsProps> = ({
  letter,
  job,
  currentUser,
  onDelete,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadTxt,
  isDownloading
}) => {
  const letterTitle = letter.title || "ansøgning";
  
  return (
    <div className="flex justify-end space-x-2">
      <IconButton
        variant="outline"
        size="sm"
        icon={<FileEdit className="h-4 w-4" />}
        asChild
        title={`Rediger ${letterTitle}`}
      >
        <Link to={`/ansoegning?letterId=${letter.id}&step=2`} />
      </IconButton>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            disabled={isDownloading}
            title={`Download ${letterTitle}`}
            aria-label={`Download ${letterTitle}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
          <DropdownMenuItem 
            onClick={() => onDownloadPdf(letter, job)}
            disabled={isDownloading}
            className="text-sm px-3 py-2 cursor-pointer focus:bg-gray-100 focus:outline-none"
          >
            Download som PDF
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDownloadDocx(letter, job)}
            disabled={isDownloading}
            className="text-sm px-3 py-2 cursor-pointer focus:bg-gray-100 focus:outline-none"
          >
            Download som DOCX
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDownloadTxt(letter, job)}
            disabled={isDownloading}
            className="text-sm px-3 py-2 cursor-pointer focus:bg-gray-100 focus:outline-none"
          >
            Download som TXT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <IconButton
        variant="outline"
        size="sm"
        icon={<Trash2 className="h-4 w-4 text-red-500" />}
        onClick={() => onDelete(letter.id)}
        title={`Slet ${letterTitle}`}
        aria-label={`Slet ${letterTitle}`}
      />
    </div>
  );
};

export default LetterActions;
