
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
import { formatDistanceToNow, format } from "date-fns";
import { da } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = async (letter: CoverLetter) => {
    try {
      setIsDownloading(true);
      const job = findJobForLetter(letter.job_posting_id);
      
      // Create a filename based on company and job title
      const companyName = job?.company || "ukendt-virksomhed";
      const jobTitle = job?.title || "ukendt-stilling";
      const fileName = `ansøgning-${companyName.toLowerCase().replace(/\s+/g, '-')}-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      
      // Format the current date in Danish
      const currentDate = new Date();
      const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Set font
      doc.setFont("helvetica");
      
      // Add company name (bold)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 20, 20);
      
      // Add attention line
      doc.setFont("helvetica", "normal");
      doc.text(`Att.: Ansøgning til ${jobTitle}`, 20, 30);
      
      // Add date (right-aligned)
      const dateWidth = doc.getStringUnitWidth(formattedDate) * doc.getFontSize() / doc.internal.scaleFactor;
      doc.text(formattedDate, doc.internal.pageSize.width - 20 - dateWidth, 30);
      
      // Add a spacing before content
      const contentStartY = 50;
      
      // Add the main content
      doc.setFontSize(11);
      
      // Split content into lines that fit within the page width
      const textLines = doc.splitTextToSize(letter.content, 170);
      
      // Add the text to the PDF
      doc.text(textLines, 20, contentStartY);
      
      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error("Error downloading letter as PDF:", error);
      alert("Der opstod en fejl under download af ansøgning.");
    } finally {
      setIsDownloading(false);
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
                          <DropdownMenuItem 
                            onClick={() => handleDownload(letter)}
                            disabled={isDownloading}
                            className="flex items-center cursor-pointer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            <span>{isDownloading ? "Downloader..." : "Download PDF"}</span>
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
