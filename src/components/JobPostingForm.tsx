import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock } from "lucide-react";
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
  const [startTime, setStartTime] = useState<number | null>(null);
  const { toast } = useToast();

  // Timer effect for loading state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      // Start or reset timer when loading starts
      setStartTime(Date.now());
      
      interval = setInterval(() => {
        if (startTime) {
          setElapsed(Math.floor((Date.now() - startTime) / 10));
        }
      }, 100);
    } else {
      // Reset when loading stops
      setStartTime(null);
      setElapsed(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, startTime]);

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
      // Try to extract info using our patterns directly in the frontend
      // This is a fallback in case the edge function call fails
      const extractedTitle = extractTitle(description);
      const extractedCompany = extractCompany(description);
      const extractedContactPerson = extractContactPerson(description);
      const extractedUrl = extractUrl(description);
      
      let newFormData = { 
        ...formData,
        title: formData.title || extractedTitle,
        company: formData.company || extractedCompany,
        contact_person: formData.contact_person || extractedContactPerson,
        url: formData.url || extractedUrl
      };
      
      // Now try the edge function for potentially better extraction
      try {
        console.log("Calling edge function for extraction");
        const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
          body: {
            action: "extract_job_info",
            text: description
          },
        });
        
        if (error) {
          console.error("Edge function error:", error);
          // Continue with our local extraction results
        } else if (data) {
          console.log("Received extraction data:", data);
          
          // Only update fields that were found by the edge function and not already set
          if (data.title && !formData.title) {
            newFormData.title = data.title;
          }
          
          if (data.company && !formData.company) {
            newFormData.company = data.company;
          }
          
          if (data.contact_person && !formData.contact_person) {
            newFormData.contact_person = data.contact_person;
          }
          
          if (data.url && !formData.url) {
            newFormData.url = data.url;
          }
        }
      } catch (fetchError) {
        console.error("Error calling extraction endpoint:", fetchError);
        // We'll continue with our local extraction results
      }
      
      setFormData(newFormData);
      
      // Show appropriate toast message based on what was extracted
      const extractedFields = [];
      if (newFormData.title !== formData.title) extractedFields.push('jobtitel');
      if (newFormData.company !== formData.company) extractedFields.push('virksomhed');
      if (newFormData.contact_person !== formData.contact_person) extractedFields.push('kontaktperson');
      if (newFormData.url !== formData.url) extractedFields.push('URL');
      
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
        description: "Der opstod en fejl under forsøget på at udtrække information. Prøv at udfylde felterne manuelt.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };
  
  // Simple extraction functions for frontend fallback
  const extractTitle = (text: string): string => {
    const patterns = [
      /(?:stilling|job|rolle)(?:\s+som|\:)\s+["']?([^"'\n,\.]{3,50})["']?/i,
      /søger\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?/i,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return "";
  };
  
  const extractCompany = (text: string): string => {
    const patterns = [
      /(?:hos|ved|for|i)\s+["']?([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S))["']?/i,
      /(?:virksomhed|firma)\s+["']?([^"'\n,\.]{2,40})["']?/i,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return "";
  };
  
  const extractContactPerson = (text: string): string => {
    const patterns = [
      /(?:kontakt|henvendelse til)\s+["']?([^"'\n,\.]{2,40})["']?/i,
      /(?:spørgsmål|information)(?:\s+til)?\s+["']?([^"'\n,\.]{2,40})["']?/i,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return "";
  };
  
  const extractUrl = (text: string): string => {
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g;
    const urls = text.match(urlPattern);
    if (urls && urls.length > 0) {
      const jobUrl = urls[0];
      if (!jobUrl.startsWith('http')) {
        return 'https://' + jobUrl;
      }
      return jobUrl;
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jobbeskrivelse
          </label>
          <div className="relative rounded-md shadow-sm">
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={extractInfoFromDescription}
                className="text-gray-700 hover:text-black"
                disabled={!formData.description || isLoading || isExtracting}
              >
                {isExtracting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-800" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="sr-only">Udtræk information</span>
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Indsæt hele jobopslaget her, og vi vil forsøge at udtrække nøgleinformation automatisk
          </p>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              Job-URL (Valgfri)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="f.eks. https://eksempel.dk/jobs/marketingansvarlig"
              disabled={isLoading}
            />
          </div>
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
