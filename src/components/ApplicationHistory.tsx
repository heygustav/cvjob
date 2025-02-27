
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Calendar, File, Edit, Trash2 } from "lucide-react";
import { JobPosting, CoverLetter } from "../lib/types";
import { Link } from "react-router-dom";

interface ApplicationHistoryProps {
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
  onDeleteJob?: (id: string) => void;
  onDeleteLetter?: (id: string) => void;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({
  jobPostings,
  coverLetters,
  onDeleteJob,
  onDeleteLetter,
}) => {
  // Function to find a cover letter for a specific job
  const findLetterForJob = (jobId: string) => {
    return coverLetters.find((letter) => letter.jobPostingId === jobId);
  };

  // Function to find a job for a specific cover letter
  const findJobForLetter = (jobPostingId: string) => {
    return jobPostings.find((job) => job.id === jobPostingId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Job Postings</h3>
        {jobPostings.length === 0 ? (
          <p className="text-gray-500 text-sm">No job postings yet.</p>
        ) : (
          <div className="space-y-4">
            {jobPostings.slice(0, 3).map((job) => {
              const letter = findLetterForJob(job.id);
              return (
                <div
                  key={job.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <span className="text-xs font-medium">
                        {job.company.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span>
                        {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    {letter ? (
                      <Link
                        to={`/generator?letterId=${letter.id}`}
                        className="text-gray-600 hover:text-gray-900 mr-2"
                        title="View cover letter"
                      >
                        <File className="h-5 w-5" />
                      </Link>
                    ) : (
                      <Link
                        to={`/generator?jobId=${job.id}`}
                        className="text-gray-600 hover:text-gray-900 mr-2"
                        title="Create cover letter"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                    )}
                    {onDeleteJob && (
                      <button
                        onClick={() => onDeleteJob(job.id)}
                        className="text-gray-600 hover:text-red-600"
                        title="Delete job posting"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {jobPostings.length > 3 && (
              <Link
                to="/dashboard"
                className="block text-center text-sm font-medium text-black hover:text-gray-800 mt-2"
              >
                View all job postings
              </Link>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Cover Letters</h3>
        {coverLetters.length === 0 ? (
          <p className="text-gray-500 text-sm">No cover letters yet.</p>
        ) : (
          <div className="space-y-4">
            {coverLetters.slice(0, 3).map((letter) => {
              const job = findJobForLetter(letter.jobPostingId);
              return (
                <div
                  key={letter.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <File className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">
                      Cover Letter for {job?.title || "Unknown Position"}
                    </h4>
                    <p className="text-sm text-gray-600">{job?.company || "Unknown Company"}</p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span>
                        {formatDistanceToNow(letter.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <Link
                      to={`/generator?letterId=${letter.id}`}
                      className="text-gray-600 hover:text-gray-900 mr-2"
                      title="Edit cover letter"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    {onDeleteLetter && (
                      <button
                        onClick={() => onDeleteLetter(letter.id)}
                        className="text-gray-600 hover:text-red-600"
                        title="Delete cover letter"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {coverLetters.length > 3 && (
              <Link
                to="/dashboard"
                className="block text-center text-sm font-medium text-black hover:text-gray-800 mt-2"
              >
                View all cover letters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationHistory;
