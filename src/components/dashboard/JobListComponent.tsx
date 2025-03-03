
import React from "react";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, FileText, Link, Briefcase, Pencil, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface JobListComponentProps {
  jobPostings: JobPosting[];
  isDeleting: boolean;
  onJobDelete: (id: string) => void;
}

const JobListComponent: React.FC<JobListComponentProps> = ({
  jobPostings,
  isDeleting,
  onJobDelete,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, session, user } = useAuth();

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: da 
      });
    } catch (error) {
      return "Ukendt dato";
    }
  };

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('da-DK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "-";
    }
  };

  const handleCreateApplication = (job: JobPosting) => {
    // Navigate to the application creation page with all job data
    // We'll use the jobId to fetch the job data on the cover letter page
    // but we need to make sure we're already logged in to avoid the login loop
    
    if (!isAuthenticated || !session) {
      // Store the redirect URL and show a toast message
      localStorage.setItem('redirectAfterLogin', `/cover-letter/generator?jobId=${job.id}&step=1&direct=true`);
      toast({
        title: "Log ind kræves",
        description: "Du skal være logget ind for at oprette en ansøgning.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    // If authenticated, navigate directly to the generator
    navigate(`/cover-letter/generator?jobId=${job.id}&step=1&direct=true`);
  };
  
  const handleEditJob = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  if (jobPostings.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Ingen jobopslag endnu
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Kom i gang ved at tilføje dit første jobopslag.
        </p>
        <div className="mt-6">
          <Button asChild>
            <RouterLink to="/job/new">Tilføj jobopslag</RouterLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <RouterLink to="/job/new">
            <Plus className="h-4 w-4 mr-2" />
            Tilføj jobopslag
          </RouterLink>
        </Button>
      </div>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stilling</TableHead>
              <TableHead>Virksomhed</TableHead>
              <TableHead>Oprettet</TableHead>
              <TableHead>Frist</TableHead>
              <TableHead className="text-right">Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPostings.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{formatDate(job.created_at)}</TableCell>
                <TableCell>{formatDeadline(job.deadline)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCreateApplication(job)}
                      title="Opret ansøgning"
                      aria-label="Opret ansøgning for dette job"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditJob(job.id)}
                      title="Rediger jobopslag"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {job.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(job.url, "_blank")}
                        title="Åbn jobopslag"
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onJobDelete(job.id)}
                      disabled={isDeleting}
                      title="Slet jobopslag"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobListComponent;
