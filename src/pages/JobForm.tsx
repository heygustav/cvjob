
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import JobPostingForm from "@/components/JobPostingForm";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchJobById, saveOrUpdateJob } from "@/services/coverLetter/jobOperations";
import { JobFormData } from "@/services/coverLetter/types";
import { ArrowLeft } from "lucide-react";
import { JobPosting } from "@/lib/types";

const JobForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState<JobPosting | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const jobData = await fetchJobById(id);
        
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
    
    if (isEditMode) {
      loadJob();
    }
  }, [id, navigate, toast, isEditMode]);

  const handleSubmit = async (formData: JobFormData) => {
    if (!user) {
      toast({
        title: "Ikke logget ind",
        description: "Du skal være logget ind for at oprette et jobopslag.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Save job to database
      await saveOrUpdateJob(formData, user.id, isEditMode ? id : undefined);
      
      toast({
        title: isEditMode ? "Jobopslag opdateret" : "Jobopslag oprettet",
        description: isEditMode 
          ? "Dit jobopslag er blevet opdateret." 
          : "Dit jobopslag er blevet oprettet.",
      });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: isEditMode ? "Fejl ved opdatering" : "Fejl ved oprettelse",
        description: `Der opstod en fejl under ${isEditMode ? 'opdatering' : 'oprettelse'} af jobopslaget.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Rediger jobopslag" : "Tilføj nyt jobopslag"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditMode 
                ? "Opdater oplysninger om jobbet. Disse oplysninger bruges til at generere en målrettet ansøgning."
                : "Udfyld nedenstående oplysninger om jobbet. Disse oplysninger bruges til at generere en målrettet ansøgning."
              }
            </p>
          </div>
          
          {isEditMode && isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Indlæser joboplysninger...</p>
            </div>
          ) : (
            <JobPostingForm 
              onSubmit={handleSubmit} 
              initialData={job} 
              isLoading={isSubmitting} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobForm;
