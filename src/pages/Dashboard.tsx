
import React, { useState, useEffect } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, FilePlus, Plus, Trash2, RefreshCw, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TabNav from "@/components/dashboard/TabNav";
import LetterListComponent from "@/components/dashboard/LetterListComponent";
import JobListComponent from "@/components/dashboard/JobListComponent";

const Dashboard = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [activeTab, setActiveTab] = useState<"letters" | "jobs">("letters");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([fetchJobPostings(), fetchCoverLetters()]);
      toast({
        title: "Opdateret",
        description: "Dine data er blevet opdateret.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const findJobForLetter = (jobPostingId: string) => {
    return jobPostings.find(job => job.id === jobPostingId);
  };

  const handleTabChange = (tab: "letters" | "jobs") => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-500">Indlæser dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <DashboardHeader />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Dit dashboard</h2>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              disabled={isRefreshing}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Opdater
            </Button>
            
            {activeTab === "jobs" && (
              <Button 
                variant="default" 
                size="sm" 
                asChild 
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Link to="/job/new">
                  <Plus className="h-4 w-4" />
                  Tilføj jobopslag
                </Link>
              </Button>
            )}
            
            {activeTab === "letters" && (
              <Button 
                variant="default" 
                size="sm" 
                asChild 
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Link to="/generator">
                  <FilePlus className="h-4 w-4" />
                  Opret ny ansøgning
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="p-4 sm:p-6">
            {activeTab === "letters" ? (
              <LetterListComponent 
                coverLetters={coverLetters}
                jobPostings={jobPostings}
                isDeleting={isDeleting}
                onLetterDelete={deleteCoverLetter}
                findJobForLetter={findJobForLetter}
              />
            ) : (
              <JobListComponent
                jobPostings={jobPostings}
                isDeleting={isDeleting}
                onJobDelete={deleteJobPosting}
              />
            )}
            
            {((activeTab === "letters" && coverLetters.length === 0) || 
               (activeTab === "jobs" && jobPostings.length === 0)) && (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  {activeTab === "letters" ? (
                    <FilePlus className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {activeTab === "letters" ? "Ingen ansøgninger endnu" : "Ingen jobopslag endnu"}
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  {activeTab === "letters" 
                    ? "Du har ikke oprettet nogen ansøgninger endnu. Kom i gang med at skabe din første ansøgning nu."
                    : "Du har ikke tilføjet nogen jobopslag endnu. Tilføj dit første jobopslag for at komme i gang."}
                </p>
                <Button asChild>
                  <Link to={activeTab === "letters" ? "/generator" : "/job/new"}>
                    <Plus className="h-4 w-4 mr-2" />
                    {activeTab === "letters" ? "Opret din første ansøgning" : "Tilføj dit første jobopslag"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
