
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Calendar, FileText, Edit, Trash2, ExternalLink } from "lucide-react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobListComponentProps {
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
  isDeleting: boolean;
  onJobDelete: (id: string) => Promise<void>;
}

const JobListComponent: React.FC<JobListComponentProps> = ({
  jobPostings,
  coverLetters,
  isDeleting,
  onJobDelete
}) => {
  const { toast } = useToast();

  return (
    <>
      {jobPostings.length === 0 ? (
        <div className="py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 text-center">Ingen jobopslag endnu</h3>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Start med at tilføje et jobopslag for at generere en ansøgning.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/generator"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tilføj jobopslag
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {jobPostings.map((job) => (
              <li key={job.id} className="px-0 py-4 sm:px-0">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                        <span className="text-xs font-medium">{job.company.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900 truncate">{job.title}</h3>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm text-gray-600 truncate">{job.company}</span>
                          {job.url && (
                            <a 
                              href={job.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-black hover:text-gray-800"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex flex-shrink-0 items-center space-x-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: da })}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <Link
                        to={`/generator?jobId=${job.id}`}
                        className="p-1 rounded-full text-gray-600 hover:text-black focus:outline-none"
                      >
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">Rediger</span>
                      </Link>
                      <button
                        onClick={() => onJobDelete(job.id)}
                        disabled={isDeleting}
                        className={`p-1 rounded-full text-gray-600 hover:text-red-600 focus:outline-none ${
                          isDeleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Slet</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                </div>
                <div className="mt-3">
                  {coverLetters.filter(letter => letter.job_posting_id === job.id).length > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Ansøgning oprettet
                    </span>
                  ) : (
                    <Link
                      to={`/generator?jobId=${job.id}`}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200"
                    >
                      Generer ansøgning
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default JobListComponent;
