
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import JobPostingForm from "@/components/JobPostingForm";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchJobById, saveOrUpdateJob } from "@/services/coverLetter/jobOperations";
import { JobFormData } from "@/services/coverLetter/types";
import { ArrowLeft } from "lucide-react";

const JobEdit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState(null);
  const { jobId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        const jobData = await fetchJobById(jobId);
        
        if (!jobData) {
          toast({
            title: "Job ikke fundet",
            description: "Det angivne job kunne ikke findes.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setJob(jobData);
      } catch (error) {
        console.error("Error loading job:", error);
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl ved indlæsning af joboplysninger.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJob();
  }, [jobId, navigate, toast]);

  const handleSubmit = async (formData: JobFormData) => {
    if (!user) {
      toast({
        title: "Ikke logget ind",
        description: "Du skal være logget ind for at gemme et jobopslag.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Update job in database
      await saveOrUpdateJob(formData, user.id, jobId);
      
      toast({
        title: "Jobopslag opdateret",
        description: "Dit jobopslag er blevet opdateret.",
      });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af jobopslaget.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (formData: JobFormData) => {
    if (!user) return;
    
    try {
      await saveOrUpdateJob(formData, user.id, jobId);
      toast({
        title: "Kladde gemt",
        description: "Din kladde er blevet gemt.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbage til dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Rediger jobopslag</h1>
            <p className="text-gray-600 mt-2">
              Opdater oplysninger om jobbet. Disse oplysninger bruges til at generere en målrettet ansøgning.
            </p>
          </div>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Indlæser joboplysninger...</p>
            </div>
          ) : job ? (
            <JobPostingForm 
              onSubmit={handleSubmit} 
              onSave={handleSave}
              initialData={job} 
              isLoading={isSubmitting} 
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Jobbet blev ikke fundet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobEdit;
