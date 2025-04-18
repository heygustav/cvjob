
import React, { memo, useMemo } from "react";
import { CoverLetter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Download, Trash2, ExternalLink, FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { VirtualizedTable } from "@/components/ui/virtualized-table";

interface LetterTableProps {
  coverLetters: CoverLetter[];
  findJobForLetter: (jobPostingId: string) => any;
  onLetterDelete: (id: string) => void;
  onDownloadPdf: (letter: CoverLetter) => void;
  onDownloadDocx: (letter: CoverLetter) => void;
  onDownloadTxt: (letter: CoverLetter) => void;
  isDownloading: boolean;
}

const LetterTable: React.FC<LetterTableProps> = memo(({
  coverLetters,
  findJobForLetter,
  onLetterDelete,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadTxt,
  isDownloading,
}) => {
  const columns = useMemo(() => [
    {
      header: "Stilling",
      key: "title",
      render: (letter: CoverLetter) => {
        const job = findJobForLetter(letter.job_posting_id);
        return job?.title || "Untitled";
      },
    },
    {
      header: "Virksomhed",
      key: "company",
      render: (letter: CoverLetter) => {
        const job = findJobForLetter(letter.job_posting_id);
        return job?.company || "-";
      },
    },
    {
      header: "Oprettet",
      key: "created",
      render: (letter: CoverLetter) => 
        formatDistanceToNow(new Date(letter.created_at), {
          addSuffix: true,
          locale: da,
        }),
    },
    {
      header: "Frist",
      key: "deadline",
      render: (letter: CoverLetter) => {
        const job = findJobForLetter(letter.job_posting_id);
        return job?.deadline 
          ? formatDistanceToNow(new Date(job.deadline), {
              addSuffix: true,
              locale: da,
            })
          : "";
      },
    },
    {
      header: "Handlinger",
      key: "actions",
      render: (letter: CoverLetter) => (
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
      ),
    },
  ], [findJobForLetter, onLetterDelete, onDownloadPdf, onDownloadDocx, onDownloadTxt, isDownloading]);

  if (coverLetters.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <VirtualizedTable
        data={coverLetters}
        columns={columns}
        estimateSize={60}
      />
    </div>
  );
});

LetterTable.displayName = 'LetterTable';

export default LetterTable;
