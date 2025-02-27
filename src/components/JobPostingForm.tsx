
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Clock } from "lucide-react";
import { JobPosting } from "../lib/types";
import { supabase } from "@/integrations/supabase/client";
import { JobFormData } from "@/services/coverLetter/types";

interface JobPostingFormProps {
  onSubmit: (jobData: JobFormData) => void;
  initialData?: JobPosting;
  isLoading?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    description: initialData?.description || "",
    contact_person: initialData?.contact_person || "",
    url: initialData?.url || "",
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Timer effect for loading state
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isLoading) {
      // Only set start time if it hasn't been set yet
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        setElapsed(0);
      }
      
      // Start a new timer
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 10);
          setElapsed(currentElapsed);
        }
      }, 100);
    } else {
      // Reset timer when loading stops
      startTimeRef.current = null;
      setElapsed(0);
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 100);
    const hundredths = ms % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Manglende information",
        description: "Udfyld venligst som minimum jobtitel, virksomhed og beskrivelse",
        variant: "destructive",
      });
      return;
    }

    startTimeRef.current = null;
    setElapsed(0);
    
    onSubmit(formData);
  };

  // Function for extracting info from job description
  const extractInfoFromDescription = async () => {
    const description = formData.description;
    
    if (!description) {
      toast({
        title: "Ingen beskrivelse at analysere",
        description: "Indsæt venligst en jobbeskrivelse først",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      console.log("Calling OpenAI to extract job information");
      toast({
        title: "Analyserer jobopslag",
        description: "Vent venligst mens vi analyserer jobopslaget...",
      });

      // Call our Edge Function that uses OpenAI
      const { data, error } = await supabase.functions.invoke('extract-job-info', {
        body: { jobDescription: description }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(`Fejl ved analyse: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Ingen data modtaget fra AI-analyse");
      }
      
      console.log("Received extraction data:", data);
      
      // Update form with the extracted data
      const newFormData = { 
        ...formData,
        title: data.title || formData.title,
        company: data.company || formData.company,
        contact_person: data.contact_person || formData.contact_person,
        url: data.url || formData.url
      };
      
      setFormData(newFormData);
      
      // Show success toast with information about what was extracted
      const extractedFields = [];
      if (data.title && newFormData.title !== formData.title) extractedFields.push('jobtitel');
      if (data.company && newFormData.company !== formData.company) extractedFields.push('virksomhed');
      if (data.contact_person && newFormData.contact_person !== formData.contact_person) extractedFields.push('kontaktperson');
      if (data.url && newFormData.url !== formData.url) extractedFields.push('URL');
      
      if (extractedFields.length > 0) {
        toast({
          title: "Information fundet",
          description: `Vi har udtrukket følgende: ${extractedFields.join(', ')}`,
        });
      } else {
        toast({
          title: "Ingen ny information fundet",
          description: "Vi kunne ikke finde yderligere information i teksten. Prøv at udfylde felterne manuelt.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in extraction process:", error);
      toast({
        title: "Fejl ved udtrækning",
        description: error instanceof Error 
          ? error.message 
          : "Der opstod en fejl under forsøget på at udtrække information. Prøv at udfylde felterne manuelt.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Job-URL (Valgfri)
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="f.eks. https://eksempel.dk/jobs/marketingansvarlig"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          Indsæt linket til jobopslaget, hvis du har det
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jobbeskrivelse
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="Indsæt jobbeskrivelsen her..."
            disabled={isLoading}
          />
          <div className="mt-2">
            <button
              type="button"
              onClick={extractInfoFromDescription}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              disabled={!formData.description || isLoading || isExtracting}
            >
              {isExtracting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-gray-800" />
                  Analyserer...
                </>
              ) : (
                "Hent information"
              )}
            </button>
            <p className="mt-1 text-xs text-gray-500">
              Indsæt hele jobopslaget, og lad os udtrække nøgleinformation automatisk
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Jobtitel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="f.eks. Marketingansvarlig"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Virksomhed
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="f.eks. Acme A/S"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact_person"
            className="block text-sm font-medium text-gray-700"
          >
            Kontaktperson (Valgfri)
          </label>
          <input
            type="text"
            id="contact_person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="f.eks. Jane Jensen"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Clock className="animate-pulse -ml-1 mr-2 h-4 w-4" />
              <span className="mr-2">
                Behandler... {formatTime(elapsed)}s
              </span>
              <span className="text-xs text-gray-200">Tålmodighed er det bedste mod...</span>
            </>
          ) : (
            'Generer ansøgning'
          )}
        </button>
      </div>
    </form>
  );
};

export default JobPostingForm;
