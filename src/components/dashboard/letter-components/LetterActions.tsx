
import React from "react";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { CoverLetter, JobPosting } from "@/lib/types";
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
  onDelete: (id: string) => void;
  onDownloadPdf: (letter: CoverLetter, job?: JobPosting) => void;
  onDownloadDocx: (letter: CoverLetter, job?: JobPosting) => void;
  onDownloadTxt: (letter: CoverLetter, job?: JobPosting) => void;
  isDownloading: boolean;
}

const LetterActions: React.FC<LetterActionsProps> = ({
  letter,
  job,
  onDelete,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadTxt,
  isDownloading
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <IconButton
        variant="outline"
        size="sm"
        icon={<FileEdit className="h-4 w-4" />}
        asChild
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
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => onDownloadPdf(letter, job)}
            disabled={isDownloading}
          >
            Download som PDF
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDownloadDocx(letter, job)}
            disabled={isDownloading}
          >
            Download som DOCX
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDownloadTxt(letter, job)}
            disabled={isDownloading}
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
      />
    </div>
  );
};

export default LetterActions;
