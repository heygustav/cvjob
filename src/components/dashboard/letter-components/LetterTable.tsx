
import React, { memo, useMemo } from "react";
import { CoverLetter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Download, Trash2, ExternalLink, FileText, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LetterTableProps {
  coverLetters: CoverLetter[];
  findJobForLetter: (jobPostingId: string) => any;
  onLetterDelete: (id: string) => void;
  onDownloadPdf: (letter: CoverLetter) => void;
  onDownloadDocx: (letter: CoverLetter) => void;
  onDownloadTxt: (letter: CoverLetter) => void;
  isDownloading: boolean;
}

// Memoize the date formatting function
const useFormattedDate = (dateString: string) => {
  return useMemo(() => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: da,
      });
    } catch (error) {
      return "Ukendt dato";
    }
  }, [dateString]);
};

// Create a memoized row component to optimize re-renders
const LetterTableRow = memo(({ 
  letter, 
  job, 
  onLetterDelete, 
  onDownloadPdf, 
  onDownloadDocx, 
  onDownloadTxt, 
  isDownloading 
}: { 
  letter: CoverLetter; 
  job: any; 
  onLetterDelete: (id: string) => void; 
  onDownloadPdf: (letter: CoverLetter) => void;
  onDownloadDocx: (letter: CoverLetter) => void;
  onDownloadTxt: (letter: CoverLetter) => void;
  isDownloading: boolean;
}) => {
  const createdDate = useFormattedDate(letter.created_at);
  const deadlineDate = job?.deadline ? useFormattedDate(job.deadline) : "";
  
  // Memoize handlers to prevent recreating functions on every render
  const handleDelete = React.useCallback(() => onLetterDelete(letter.id), [letter.id, onLetterDelete]);
  const handleDownloadPdf = React.useCallback(() => onDownloadPdf(letter), [letter, onDownloadPdf]);
  const handleDownloadDocx = React.useCallback(() => onDownloadDocx(letter), [letter, onDownloadDocx]);
  const handleDownloadTxt = React.useCallback(() => onDownloadTxt(letter), [letter, onDownloadTxt]);
  
  return (
    <TableRow key={letter.id} className="border-b-0">
      <TableCell className="font-medium">{job?.title || "Untitled"}</TableCell>
      <TableCell>{job?.company || "-"}</TableCell>
      <TableCell>{createdDate}</TableCell>
      <TableCell>{deadlineDate}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Link to={`/cover-letter/${letter.id}`}>
            <IconButton
              variant="outline"
              size="sm"
              icon={<Pencil className="h-4 w-4" />}
              title="Rediger ansøgning"
            />
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                variant="outline"
                size="sm"
                icon={<Download className="h-4 w-4" />}
                title="Download"
                disabled={isDownloading}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadPdf}>
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadDocx}>
                Download DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadTxt}>
                Download TXT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <IconButton
            variant="outline"
            size="sm"
            icon={<Trash2 className="h-4 w-4 text-red-500" />}
            onClick={handleDelete}
            title="Slet ansøgning"
          />
        </div>
      </TableCell>
    </TableRow>
  );
});

LetterTableRow.displayName = 'LetterTableRow';

const LetterTable: React.FC<LetterTableProps> = memo(({
  coverLetters,
  findJobForLetter,
  onLetterDelete,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadTxt,
  isDownloading,
}) => {
  // Memoize finding jobs for letters to avoid recalculating on every render
  const letterJobPairs = useMemo(() => {
    return coverLetters.map(letter => ({
      letter,
      job: letter.job_posting_id ? findJobForLetter(letter.job_posting_id) : null
    }));
  }, [coverLetters, findJobForLetter]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Stilling</TableHead>
            <TableHead className="text-left">Virksomhed</TableHead>
            <TableHead className="text-left">Oprettet</TableHead>
            <TableHead className="text-left">Frist</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {letterJobPairs.map(({ letter, job }) => (
            <LetterTableRow 
              key={letter.id}
              letter={letter}
              job={job}
              onLetterDelete={onLetterDelete}
              onDownloadPdf={onDownloadPdf}
              onDownloadDocx={onDownloadDocx}
              onDownloadTxt={onDownloadTxt}
              isDownloading={isDownloading}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

LetterTable.displayName = 'LetterTable';

export default LetterTable;
