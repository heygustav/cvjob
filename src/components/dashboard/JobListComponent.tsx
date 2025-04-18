
import React, { useMemo } from "react";
import { JobPosting } from "@/lib/types";
import IconButton from "@/components/ui/icon-button";
import { FileText, Link as LinkIcon, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { VirtualizedTable } from "@/components/ui/virtualized-table";

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
  const { isAuthenticated, session } = useAuth();

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
    navigate(`/ansoegning?jobId=${jobId}&step=1&direct=true`);
  };

  const columns = useMemo(() => [
    {
      header: "Stilling",
      key: "title",
      render: (job: JobPosting) => job.title,
    },
    {
      header: "Virksomhed",
      key: "company",
      render: (job: JobPosting) => job.company,
    },
    {
      header: "Oprettet",
      key: "created",
      render: (job: JobPosting) =>
        formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: da }),
    },
    {
      header: "Frist",
      key: "deadline",
      render: (job: JobPosting) =>
        job.deadline
          ? new Date(job.deadline).toLocaleDateString('da-DK', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : "",
    },
    {
      header: "Handlinger",
      key: "actions",
      render: (job: JobPosting) => (
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
      ),
    },
  ], [handleCreateApplication, handleEditJob, isDeleting, onJobDelete]);

  if (jobPostings.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <VirtualizedTable
        data={jobPostings}
        columns={columns}
        estimateSize={60}
      />
    </div>
  );
};

export default JobListComponent;
