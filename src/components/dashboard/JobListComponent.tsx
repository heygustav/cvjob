
import React from "react";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, FileText, Link, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link as RouterLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

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
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
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
              <TableHead>Deadline</TableHead>
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
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <RouterLink
                        to={`/cover-letter/new?job=${job.id}`}
                        title="Opret ansøgning"
                      >
                        <FileText className="h-4 w-4" />
                      </RouterLink>
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
