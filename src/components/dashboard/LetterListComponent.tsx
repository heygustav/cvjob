
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Trash2, MoreHorizontal, ExternalLink } from "lucide-react";
import { CoverLetter, JobPosting } from "@/lib/types";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";

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

  if (coverLetters.length === 0) {
    return (
      <div className="text-left py-10">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen ansøgninger endnu</h3>
          <p className="mt-1 text-sm text-gray-500">
            Du har ikke gemt nogen ansøgninger endnu.
          </p>
          <div className="mt-6">
            <Link to="/generator">
              <Button>
                Opret din første ansøgning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="text-left mb-4">
        <h2 className="text-lg font-medium text-gray-900">Dine ansøgninger</h2>
        <p className="text-sm text-gray-500">
          Se og administrer dine gemte ansøgninger.
        </p>
      </div>

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
                    <div className="text-sm text-gray-900">{job?.title || "Ukendt stilling"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm text-gray-500">{formatDate(letter.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/generator?letterId=${letter.id}`}
                        className="text-primary hover:text-primary-700 transition-colors"
                        aria-label={`Rediger ansøgning til ${job?.title || "Ukendt stilling"}`}
                      >
                        <span className="hidden sm:inline">Rediger</span>
                        <ExternalLink className="h-4 w-4 inline sm:hidden" />
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" 
                            aria-label="Flere handlinger"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link 
                              to={`/generator?letterId=${letter.id}`}
                              className="flex items-center cursor-pointer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Rediger</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a 
                              href={`/api/download/letter/${letter.id}`} 
                              download
                              className="flex items-center cursor-pointer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(letter.id)}
                            className="flex items-center text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Slet</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!letterToDelete} onOpenChange={() => !isDeleting && setLetterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Denne handling kan ikke fortrydes. Dette vil permanent slette din
              ansøgning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={cancelDelete}>
              Annuller
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Sletter..." : "Slet"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LetterListComponent;
