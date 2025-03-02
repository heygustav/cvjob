
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobPostingForm from "@/components/JobPostingForm";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { saveOrUpdateJob } from "@/services/coverLetter/jobOperations";
import { JobFormData } from "@/services/coverLetter/types";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const JobForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      await saveOrUpdateJob(formData, user.id);
      
      toast({
        title: "Jobopslag oprettet",
        description: "Dit jobopslag er blevet oprettet.",
      });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Fejl ved oprettelse",
        description: "Der opstod en fejl under oprettelse af jobopslaget.",
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
            <h1 className="text-2xl font-bold text-gray-900">Tilføj nyt jobopslag</h1>
            <p className="text-gray-600 mt-2">
              Udfyld nedenstående oplysninger om jobbet. Disse oplysninger bruges til at generere en målrettet ansøgning.
            </p>
          </div>
          
          <JobPostingForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default JobForm;
