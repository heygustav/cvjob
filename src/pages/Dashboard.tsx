
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Calendar, FileText, Edit, Trash2, ExternalLink } from "lucide-react";
import { JobPosting, CoverLetter } from "../lib/types";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [activeTab, setActiveTab] = useState<"jobs" | "letters">("jobs");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchJobPostings();
      fetchCoverLetters();
    }
  }, [user]);

  const fetchJobPostings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setJobPostings(data || []);
    } catch (error) {
      console.error("Error fetching job postings:", error);
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af jobopslag.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoverLetters = async () => {
    try {
      const { data, error } = await supabase
        .from("cover_letters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCoverLetters(data || []);
    } catch (error) {
      console.error("Error fetching cover letters:", error);
    }
  };

  const deleteJobPosting = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // First check if job has any cover letters
      const jobLetters = coverLetters.filter(letter => letter.job_posting_id === id);
      
      if (jobLetters.length > 0) {
        // If there are cover letters, delete them first
        for (const letter of jobLetters) {
          const { error: deleteLetterError } = await supabase
            .from("cover_letters")
            .delete()
            .eq("id", letter.id);
          
          if (deleteLetterError) {
            console.error("Error deleting cover letter:", deleteLetterError);
            throw deleteLetterError;
          }
        }
        
        // Update cover letters state
        setCoverLetters(coverLetters.filter(letter => letter.job_posting_id !== id));
      }
      
      // Then delete the job posting
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setJobPostings(jobPostings.filter(job => job.id !== id));

      toast({
        title: "Jobopslag slettet",
        description: "Jobopslaget er blevet slettet.",
      });
    } catch (error) {
      console.error("Error deleting job posting:", error);
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af jobopslaget.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteCoverLetter = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("cover_letters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCoverLetters(coverLetters.filter(letter => letter.id !== id));

      toast({
        title: "Ansøgning slettet",
        description: "Ansøgningen er blevet slettet.",
      });
    } catch (error) {
      console.error("Error deleting cover letter:", error);
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const findJobForLetter = (jobPostingId: string) => {
    return jobPostings.find(job => job.id === jobPostingId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
            <p className="mt-1 text-lg text-gray-600">
              Administrer dine jobansøgninger og ansøgningsbreve
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <Link
              to="/generator"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ny ansøgning
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "jobs"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Jobopslag
              </button>
              <button
                onClick={() => setActiveTab("letters")}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "letters"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Ansøgninger
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "jobs" && (
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
                                  onClick={() => deleteJobPosting(job.id)}
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
            )}

            {activeTab === "letters" && (
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
                                    onClick={() => deleteCoverLetter(letter.id)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
