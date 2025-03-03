
import React from "react";
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

const LetterTable: React.FC<LetterTableProps> = ({
  coverLetters,
  findJobForLetter,
  onLetterDelete,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadTxt,
  isDownloading,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: da,
      });
    } catch (error) {
      return "Ukendt dato";
    }
  };

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
          {coverLetters.map((letter) => {
            const job = letter.job_posting_id
              ? findJobForLetter(letter.job_posting_id)
              : null;
            
            return (
              <TableRow key={letter.id} className="border-b-0">
                <TableCell className="font-medium">{job?.title || "Untitled"}</TableCell>
                <TableCell>{job?.company || "-"}</TableCell>
                <TableCell>{formatDate(letter.created_at)}</TableCell>
                <TableCell>{job?.deadline ? formatDate(job.deadline) : ""}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <IconButton
                      variant="outline"
                      size="sm"
                      icon={<Pencil className="h-4 w-4" />}
                      title="Rediger ansøgning"
                      asChild
                    >
                      <Link to={`/cover-letter/${letter.id}`} />
                    </IconButton>
                    
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
                        <DropdownMenuItem onClick={() => onDownloadPdf(letter)}>
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownloadDocx(letter)}>
                          Download DOCX
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownloadTxt(letter)}>
                          Download TXT
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <IconButton
                      variant="outline"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4 text-red-500" />}
                      onClick={() => onLetterDelete(letter.id)}
                      title="Slet ansøgning"
                    />
                  </div>
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
