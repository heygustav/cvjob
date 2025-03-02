
import React from "react";
import { CoverLetter, JobPosting } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import LetterActions from "./LetterActions";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface LetterTableProps {
  coverLetters: CoverLetter[];
  findJobForLetter: (jobPostingId: string) => JobPosting | undefined;
  onLetterDelete: (id: string) => void;
  onDownloadPdf: (letter: CoverLetter, job?: JobPosting) => void;
  onDownloadDocx: (letter: CoverLetter, job?: JobPosting) => void;
  onDownloadTxt: (letter: CoverLetter, job?: JobPosting) => void;
  isDownloading: boolean;
}

const LetterTable: React.FC<LetterTableProps> = ({
  coverLetters,
  findJobForLetter,
  onLetterDelete,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadTxt,
  isDownloading
}) => {
  const formatDate = (dateString: string) => {
    try {
      // Get the formatted date string
      let formattedDate = formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: da,
      });
      
      // Capitalize "cirka" if it starts with it
      if (formattedDate.toLowerCase().startsWith("cirka")) {
        formattedDate = "Cirka" + formattedDate.substring(5);
      }
      
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Ukendt dato";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Virksomhed</TableHead>
            <TableHead>Stilling</TableHead>
            <TableHead>Oprettet</TableHead>
            <TableHead>Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coverLetters.map((letter) => {
            const job = findJobForLetter(letter.job_posting_id);
            return (
              <TableRow key={letter.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {job?.company || "Ukendt virksomhed"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900">{job?.title || "Ukendt stilling"}</div>
                    {job?.url && (
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-primary hover:text-primary-700"
                        aria-label="Åbn jobopslag"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">{formatDate(letter.created_at)}</div>
                </TableCell>
                <TableCell>
                  <LetterActions 
                    letter={letter}
                    job={job}
                    onDelete={onLetterDelete}
                    onDownloadPdf={onDownloadPdf}
                    onDownloadDocx={onDownloadDocx}
                    onDownloadTxt={onDownloadTxt}
                    isDownloading={isDownloading}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LetterTable;
