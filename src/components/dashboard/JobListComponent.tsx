
import React, { useState } from "react";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Calendar, Trash2, FileText, Link as LinkIcon, Pencil } from "lucide-react";
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
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('da-DK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "";
    }
  };

  const handleCreateApplication = (job: JobPosting) => {
    if (!isAuthenticated || !session) {
      localStorage.setItem('redirectAfterLogin', `/ansoegning?jobId=${job.id}&step=1&direct=true`);
      toast({
        title: "Log ind kræves",
        description: "Du skal være logget ind for at oprette en ansøgning.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    navigate(`/ansoegning?jobId=${job.id}&step=1&direct=true`);
  };
  
  const handleEditJob = (jobId: string) => {
    // Navigate to the cover letter generator with this job pre-selected
    navigate(`/ansoegning?jobId=${jobId}&step=1&direct=true`);
  };

  if (jobPostings.length === 0) {
    return null; // Empty state handled by parent
  }

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
          {jobPostings.map((job) => (
            <TableRow key={job.id} className="border-b-0">
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>{formatDate(job.created_at)}</TableCell>
              <TableCell>{job.deadline ? formatDeadline(job.deadline) : ""}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <IconButton
                    variant="outline"
                    size="sm"
                    icon={<FileText className="h-4 w-4" />}
                    onClick={() => handleCreateApplication(job)}
                    title="Opret ansøgning"
                    aria-label="Opret ansøgning for dette job"
                  />
                  <IconButton
                    variant="outline"
                    size="sm"
                    icon={<Pencil className="h-4 w-4" />}
                    onClick={() => handleEditJob(job.id)}
                    title="Rediger jobopslag"
                  />
                  {job.url && (
                    <IconButton
                      variant="outline"
                      size="sm"
                      icon={<LinkIcon className="h-4 w-4" />}
                      onClick={() => window.open(job.url, "_blank")}
                      title="Åbn jobopslag"
                    />
                  )}
                  <IconButton
                    variant="outline"
                    size="sm"
                    icon={<Trash2 className="h-4 w-4 text-red-500" />}
                    onClick={() => onJobDelete(job.id)}
                    disabled={isDeleting}
                    title="Slet jobopslag"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobListComponent;
