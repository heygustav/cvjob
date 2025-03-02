
import React from "react";
import { CoverLetter, JobPosting } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import LetterActions from "./LetterActions";

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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Virksomhed
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stilling
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Oprettet
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Handlinger
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coverLetters.map((letter) => {
            const job = findJobForLetter(letter.job_posting_id);
            return (
              <tr key={letter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {job?.company || "Ukendt virksomhed"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-gray-500">{formatDate(letter.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <LetterActions 
                    letter={letter}
                    job={job}
                    onDelete={onLetterDelete}
                    onDownloadPdf={onDownloadPdf}
                    onDownloadDocx={onDownloadDocx}
                    onDownloadTxt={onDownloadTxt}
                    isDownloading={isDownloading}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LetterTable;
