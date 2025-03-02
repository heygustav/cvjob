
import React, { useState, useEffect } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

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
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <DashboardHeader />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Dit dashboard</h2>
          
          <DashboardActions 
            activeTab={activeTab}
            isRefreshing={isRefreshing}
            onRefresh={refreshData}
          />
        </div>

        <DashboardContent 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          jobPostings={jobPostings}
          coverLetters={coverLetters}
          isDeleting={isDeleting}
          onJobDelete={deleteJobPosting}
          onLetterDelete={deleteCoverLetter}
          findJobForLetter={findJobForLetter}
        />
      </div>
    </div>
  );
};

export default Dashboard;
