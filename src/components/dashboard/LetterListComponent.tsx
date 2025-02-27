
import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Calendar, FileText, Edit, Trash2 } from "lucide-react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";

interface LetterListComponentProps {
  coverLetters: CoverLetter[];
  jobPostings: JobPosting[];
  isDeleting: boolean;
  onLetterDelete: (id: string) => Promise<void>;
  findJobForLetter: (jobPostingId: string) => JobPosting | undefined;
}

const LetterListComponent: React.FC<LetterListComponentProps> = ({
  coverLetters,
  jobPostings,
  isDeleting,
  onLetterDelete,
  findJobForLetter
}) => {
  return (
    <>
      {coverLetters.length === 0 ? (
        <div className="py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 text-center">Ingen ansøgninger endnu</h3>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Generer din første ansøgning til et jobopslag.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/generator"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Opret ansøgning
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {coverLetters.map((letter) => {
              const job = findJobForLetter(letter.job_posting_id);
              return (
                <li key={letter.id} className="px-0 py-4 sm:px-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            Ansøgning til {job?.title || "Ukendt stilling"}
                          </h3>
                          <div className="mt-1 flex items-center">
                            <span className="text-sm text-gray-600 truncate">{job?.company || "Ukendt virksomhed"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex flex-shrink-0 items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{formatDistanceToNow(new Date(letter.created_at), { addSuffix: true, locale: da })}</span>
                      </div>
                      <div className="flex flex-row items-center">
                        <Link
                          to={`/generator?letterId=${letter.id}`}
                          className="p-1 rounded-full text-gray-600 hover:text-black focus:outline-none"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="sr-only">Rediger</span>
                        </Link>
                        <button
                          onClick={() => onLetterDelete(letter.id)}
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
                    <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">{letter.content}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default LetterListComponent;
