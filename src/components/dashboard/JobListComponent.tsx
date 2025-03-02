
import React, { useState } from "react";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertTriangle, ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface JobListComponentProps {
  jobPostings: JobPosting[];
  isDeleting: boolean;
  onJobDelete: (id: string) => Promise<void>;
}

const JobListComponent: React.FC<JobListComponentProps> = ({
  jobPostings,
  isDeleting,
  onJobDelete,
}) => {
  const navigate = useNavigate();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const handleAddJobClick = () => {
    navigate("/generator", { state: { initialStep: "job" } });
  };

  const handleCreateLetterClick = (jobId: string) => {
    navigate("/generator", { state: { jobId, initialStep: "job" } });
  };

  const confirmDelete = (id: string) => {
    setJobToDelete(id);
  };

  const handleDelete = async () => {
    if (jobToDelete) {
      await onJobDelete(jobToDelete);
      setJobToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Jobopslag ({jobPostings.length})
        </h2>
        <Button onClick={handleAddJobClick} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Tilføj jobopslag
        </Button>
      </div>

      {jobPostings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ingen jobopslag endnu
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Tilføj jobopslag for at holde styr på dine jobmuligheder og generere ansøgninger.
          </p>
          <Button onClick={handleAddJobClick} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Tilføj jobopslag
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobPostings.map((job) => (
            <Card key={job.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h3 className="font-medium text-lg text-gray-900">
                      {job.title}
                    </h3>
                    <Badge variant="outline" className="md:ml-2 w-fit">
                      {job.company}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    Oprettet: {format(new Date(job.created_at), 'dd/MM/yyyy')}
                  </p>
                  
                  {job.url && (
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center text-sm mb-3"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Se jobopslag
                    </a>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Button 
                    onClick={() => handleCreateLetterClick(job.id)} 
                    variant="default"
                    className="w-full md:w-auto"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Opret ansøgning
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => confirmDelete(job.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                          Slet jobopslag
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Er du sikker på, at du vil slette dette jobopslag? 
                          Denne handling kan ikke fortrydes, og eventuelle tilknyttede ansøgninger vil også blive slettet.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuller</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Slet
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListComponent;
