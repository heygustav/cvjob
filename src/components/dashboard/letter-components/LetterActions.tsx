
import React from "react";
import { CoverLetter, JobPosting } from "@/lib/types";
import { 
  Download, FileText, Trash2, MoreHorizontal, ExternalLink, File, FileIcon 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
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
    <div className="flex items-center space-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none" 
            aria-label="Handlinger"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => onDownloadPdf(letter, job)}
            disabled={isDownloading}
            className="flex items-center cursor-pointer"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            <span>{isDownloading ? "Downloader..." : "Download PDF"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDownloadDocx(letter, job)}
            disabled={isDownloading}
            className="flex items-center cursor-pointer"
          >
            <File className="mr-2 h-4 w-4" />
            <span>{isDownloading ? "Downloader..." : "Download Word"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDownloadTxt(letter, job)}
            disabled={isDownloading}
            className="flex items-center cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>{isDownloading ? "Downloader..." : "Download Text"}</span>
          </DropdownMenuItem>
          {job?.url && (
            <DropdownMenuItem asChild>
              <a 
                href={job.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center cursor-pointer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Åbn jobopslag</span>
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(letter.id)}
            className="flex items-center text-red-600 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Slet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LetterActions;
