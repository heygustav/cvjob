
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { JobPosting } from "../lib/types";

interface JobPostingFormProps {
  onSubmit: (jobData: {
    title: string;
    company: string;
    description: string;
    contact_person?: string;
    url?: string;
  }) => void;
  initialData?: JobPosting;
  isLoading?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    company: initialData?.company || "",
    description: initialData?.description || "",
    contact_person: initialData?.contact_person || "",
    url: initialData?.url || "",
  });
  const { toast } = useToast();

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

  // More advanced extraction function using NLP-inspired approaches
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

    let newFormData = { ...formData };
    
    try {
      // Step 1: Try to use the advanced extraction function (fetch-based)
      let extractedData = await extractWithAdvancedAlgorithm(description);
      
      // Step 2: Use our fallback patterns if advanced extraction failed
      if (!extractedData.title && !formData.title) {
        extractedData.title = extractJobTitle(description);
      }
      
      if (!extractedData.company && !formData.company) {
        extractedData.company = extractCompany(description);
      }
      
      if (!extractedData.contact_person && !formData.contact_person) {
        extractedData.contact_person = extractContactPerson(description);
      }
      
      if (!extractedData.url && !formData.url) {
        extractedData.url = extractJobURL(description);
      }
      
      // Update formData with extracted information
      newFormData = {
        ...newFormData,
        title: extractedData.title || newFormData.title,
        company: extractedData.company || newFormData.company,
        contact_person: extractedData.contact_person || newFormData.contact_person,
        url: extractedData.url || newFormData.url
      };
      
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
      console.error("Error extracting information:", error);
      toast({
        title: "Fejl ved udtrækning",
        description: "Der opstod en fejl under forsøget på at udtrække information. Prøv at udfylde felterne manuelt.",
        variant: "destructive",
      });
    }
  };
  
  // Try to use Supabase Edge Function for advanced extraction
  const extractWithAdvancedAlgorithm = async (text: string) => {
    try {
      const response = await fetch('/functions/v1/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: "extract_job_info",
          text: text
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title || '',
          company: data.company || '',
          contact_person: data.contact_person || '',
          url: data.url || ''
        };
      }
    } catch (error) {
      console.error("Error with advanced extraction:", error);
    }
    
    // Return empty data if the advanced method failed
    return { title: '', company: '', contact_person: '', url: '' };
  };
  
  // Fallback extraction methods using regex patterns
  
  const extractJobTitle = (text: string): string => {
    // List of common job title patterns in Danish
    const titlePatterns = [
      // Pattern for direct title mentions
      /(?:stilling(?:en)?|job(?:bet)?|rolle[nr]?|titel)(?::\s*|\s+er\s+|\s+som\s+|\s+)["']?([^"'\n,\.]{3,50})["']?/i,
      
      // Pattern for "we are looking for" type sentences
      /(?:søger|ansætter|leder efter|mangler)\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?/i,
      
      // Pattern for "you are a" type sentences
      /(?:du er|som|til)\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?\s+(?:stilling|job|rolle|position)/i,
      
      // Pattern for job titles at the beginning of sentences
      /(?:^|\n|\r|\. )["']?([A-ZÆØÅa-zæøå][A-ZÆØÅa-zæøå\s]{2,30})["']?\s+(?:stilling|job|rolle|position|søges)/i,
      
      // Pattern for job titles in header-like formats
      /^["']?([A-ZÆØÅa-zæøå][A-ZÆØÅa-zæøå\s]{2,30})["']?\s*$/im,
      
      // Open job title patterns
      /(?:vi\s+har\s+en\s+ledig\s+stilling\s+som|vi\s+søger\s+en)(?:\s+dygtig)?(?:\s+erfaren)?\s+["']?([^"'\n,\.]{3,50})["']?/i
    ];
    
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Clean up the job title
        let title = match[1].trim();
        
        // Remove common prefixes/suffixes
        title = title.replace(/^(?:en|et|vores|som)\s+/i, '');
        title = title.replace(/\s+(?:til|ved|hos|for|i|med)\s+.*$/i, '');
        
        // Check if it's reasonably a job title (not too short or too long)
        if (title.length > 2 && title.length < 50) {
          return title;
        }
      }
    }
    
    // Try another approach for common job titles
    const commonJobTitles = [
      "Udvikler", "Frontend", "Backend", "Fullstack", "Developer", 
      "Projektleder", "Project Manager", "UX Designer", "UI Designer",
      "Grafiker", "Marketing", "Salg", "Sælger", "HR", "Konsulent",
      "Advokat", "Jurist", "Økonom", "Bogholder", "Regnskab", "Finans",
      "Ingeniør", "Tekniker", "Chef", "Leder", "Manager", "Direktør", 
      "Koordinator", "Specialist", "Analytiker", "Konsulent"
    ];
    
    for (const jobTitle of commonJobTitles) {
      if (text.includes(jobTitle)) {
        // Get surrounding context
        const index = text.indexOf(jobTitle);
        const start = Math.max(0, index - 30);
        const end = Math.min(text.length, index + jobTitle.length + 30);
        const context = text.substring(start, end);
        
        // Additional check if it's in a job title context
        if (context.match(/(?:stilling|job|rolle|position|søger|ansætter|leder efter)/i)) {
          // Try to extract a more complete title
          const contextMatch = context.match(/["']?([A-ZÆØÅa-zæøå][A-ZÆØÅa-zæøå\s]{2,30}\s+(?:developer|udvikler|projektleder|designer|manager|specialist|analytiker|konsulent))["']?/i);
          if (contextMatch && contextMatch[1]) {
            return contextMatch[1].trim();
          }
          return jobTitle;
        }
      }
    }
    
    return "";
  };
  
  const extractCompany = (text: string): string => {
    // Company extraction patterns
    const companyPatterns = [
      // Company as employer
      /(?:hos|ved|for|i|til)\s+["']?([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))?["']?/i,
      
      // Explicit company mentions
      /(?:virksomhed(?:en)?|firma(?:et)?|arbejdsplads(?:en)?|arbejdsgiver(?:en)?)\s+(?:er\s+)?["']?([^"'\n,\.]{2,40})["']?/i,
      
      // Company with legal suffix searching for employees
      /([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))\s+(?:søger|ansætter|leder efter)/i,
      
      // Company at beginning of text
      /^["']?([A-ZÆØÅa-zæøå][A-ZÆØÅa-zæøå\s]{2,30})(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))?["']?/im,
      
      // Company in about us section
      /(?:om os|om virksomheden|about us)[\s\S]{1,100}["']?([A-ZÆØÅa-zæøå][A-ZÆØÅa-zæøå\s]{2,30})(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))?["']?/i
    ];
    
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Clean up the company name
        let company = match[1].trim();
        
        // Check for company legal suffixes
        if (!company.match(/(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA)$/i)) {
          const suffixMatch = text.match(new RegExp(`${company}\\s+(A\\/S|ApS|I\\/S|A\\/B|K\\/S|P\\/S|IVS|SMBA|AMBA|FMBA)`, 'i'));
          if (suffixMatch) {
            company += ' ' + suffixMatch[1];
          }
        }
        
        // Remove common prefixes
        company = company.replace(/^(?:hos|ved|for|i|til)\s+/i, '');
        
        return company;
      }
    }
    
    // Try to find capitalized words that could be company names
    const capitalizedWordsMatch = text.match(/[A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+){0,3}(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))/g);
    if (capitalizedWordsMatch && capitalizedWordsMatch.length > 0) {
      // Return the longest match as it's more likely to be a complete company name
      return capitalizedWordsMatch.reduce((a, b) => a.length > b.length ? a : b).trim();
    }
    
    return "";
  };
  
  const extractContactPerson = (text: string): string => {
    // Contact person patterns
    const contactPatterns = [
      // Direct contact mentions
      /(?:kontakt(?:person)?|henvendelse til|kontakt venligst|send .+ til|er\s+kontaktperson)\s+["']?([^"'\n,\.]{2,40})["']?/i,
      
      // Questions to contact person
      /(?:spørgsmål|yderligere information|mere information)(?:\s+kan\s+rettes)?\s+til\s+["']?([^"'\n,\.]{2,40})["']?/i,
      
      // Send application to
      /(?:ansøgning(?:en)?|CV(?:et)?)\s+(?:sendes|fremsendes|stiles)\s+til\s+["']?([^"'\n,\.]{2,40})["']?/i,
      
      // Named person with contact information
      /([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+){0,2})(?:\s+på)?(?:\s+(?:e-mail|email|mail|telefon|tlf|mobil))?\s*[:\.]?\s*[\w\.-]+@[\w\.-]+/i,
      
      // Named person with title
      /([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+){0,2})(?:\s*[,\.])?\s+(?:er|som)\s+(?:vores|firmaets)?\s+(?:HR|Manager|Direktør|Chef|Leder|Ansvarlig)/i
    ];
    
    for (const pattern of contactPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Clean up the contact person
        let contact = match[1].trim();
        
        // Remove titles
        contact = contact.replace(/^(?:hr\.|hr|fru\.|frk\.|dr\.|prof\.|direktør|chef)\s+/i, '');
        
        // Remove trailing stuff
        contact = contact.replace(/\s+(?:på|via|gennem|hos|ved|i)\s+.*$/i, '');
        
        // Check if it looks like a name (typically contains at least one capitalized word)
        if (contact.match(/[A-ZÆØÅ][a-zæøå]+/)) {
          return contact;
        }
      }
    }
    
    // Try to find email addresses and extract names from them
    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+/);
    if (emailMatch) {
      const email = emailMatch[0];
      // Try to find a name near the email
      const emailContext = text.substring(
        Math.max(0, text.indexOf(email) - 50),
        text.indexOf(email)
      );
      
      const nameNearEmailMatch = emailContext.match(/([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+){0,2})$/);
      if (nameNearEmailMatch) {
        return nameNearEmailMatch[1].trim();
      }
    }
    
    return "";
  };
  
  const extractJobURL = (text: string): string => {
    // URL extraction pattern
    const urlPattern = /(?:(?:https?:)?\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s\)]*)?/g;
    
    const urls = text.match(urlPattern);
    if (!urls || urls.length === 0) {
      return "";
    }
    
    // Filter and prioritize URLs
    const relevantUrls = urls.filter(url => {
      const lowerUrl = url.toLowerCase();
      return (
        lowerUrl.includes('job') || 
        lowerUrl.includes('career') || 
        lowerUrl.includes('stilling') ||
        lowerUrl.includes('ansog') ||
        lowerUrl.includes('ansøg') ||
        lowerUrl.includes('apply') ||
        lowerUrl.includes('position') ||
        lowerUrl.includes('vacancy') ||
        lowerUrl.includes('recruit')
      );
    });
    
    const jobUrl = relevantUrls.length > 0 ? relevantUrls[0] : urls[0];
    
    // Ensure URL has proper protocol
    if (!jobUrl.startsWith('http')) {
      return 'https://' + jobUrl;
    }
    
    return jobUrl;
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
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={extractInfoFromDescription}
                className="text-gray-700 hover:text-black"
                disabled={!formData.description || isLoading}
              >
                <Search className="h-5 w-5" />
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
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Behandler...
            </>
          ) : (
            'Fortsæt til at generere ansøgning'
          )}
        </button>
      </div>
    </form>
  );
};

export default JobPostingForm;
