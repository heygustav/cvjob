
import React from "react";
import { Button } from "@/components/ui/button";
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
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        asChild
      >
        <Link to={`/cover-letter/generator?letterId=${letter.id}&step=2`}>
          <FileEdit className="h-4 w-4" />
        </Link>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
          </Button>
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
      
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onDelete(letter.id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export default LetterActions;
