
import React from "react";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, FileText, Link, Briefcase, Pencil } from "lucide-react";
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
    // Check if job is missing important information but don't block navigation
    if (!job.title || !job.company || !job.description) {
      toast({
        title: "Bemærk",
        description: "Dette job mangler nogle detaljer. Du kan fortsætte, men det anbefales at opdatere joboplysningerne.",
        variant: "default",
      });
    }
    
    // Force direct=true and step=1 parameters to ensure proper navigation
    const url = `/cover-letter/generator?jobId=${job.id}&step=1&direct=true`;
    console.log(`Navigating to: ${url}`);
    
    // Use navigate with replace:true to avoid history stacking
    navigate(url, { replace: true });
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Dine jobopslag</h2>
        <Button asChild>
          <RouterLink to="/job/new">Tilføj jobopslag</RouterLink>
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
