
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

  const extractInfoFromDescription = () => {
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

    // Try to extract title using more Danish patterns
    if (!formData.title) {
      const titlePatterns = [
        /(?:stilling(?:en)?|job(?:bet)?|rolle[nr]?|titel)(?::\s*|\s+er\s+|\s+som\s+|\s+)["']?([^"'\n,\.]+)["']?/i,
        /søger\s+(?:en\s+)?["']?([^"'\n,\.]+)["']?/i,
        /til\s+(?:en\s+)?["']?([^"'\n,\.]+)["']?\s+stilling/i,
        /(?:^|\n)\s*["']?([^"'\n,\.]+)["']?\s+-\s+(?:stilling|job)/i
      ];

      for (const pattern of titlePatterns) {
        const match = description.match(pattern);
        if (match && match[1]) {
          newFormData.title = match[1].trim();
          break;
        }
      }
    }

    // Try to extract company using more Danish patterns
    if (!formData.company) {
      const companyPatterns = [
        /(?:hos|ved|for|i|til)\s+["']?([^"'\n,\.]+)(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))?["']?/i,
        /(?:virksomhed(?:en)?|firma(?:et)?|arbejdsplads(?:en)?)\s+["']?([^"'\n,\.]+)["']?/i,
        /([^"'\n,\.]+)(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))\s+søger/i
      ];

      for (const pattern of companyPatterns) {
        const match = description.match(pattern);
        if (match && match[1]) {
          // Clean up common company suffixes
          let company = match[1].trim();
          if (!company.match(/(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA)$/i)) {
            const suffixMatch = description.match(new RegExp(`${company}\\s+(A\\/S|ApS|I\\/S|A\\/B|K\\/S|P\\/S|IVS|SMBA|AMBA|FMBA)`, 'i'));
            if (suffixMatch) {
              company += ' ' + suffixMatch[1];
            }
          }
          newFormData.company = company;
          break;
        }
      }
    }

    // Try to extract contact person using more Danish patterns
    if (!formData.contact_person) {
      const contactPatterns = [
        /(?:kontakt(?:person)?|henvendelse til|kontakt venligst|send .+ til)\s+["']?([^"'\n,\.]+)["']?/i,
        /(?:spørgsmål|yderligere information)(?:\s+kan\s+rettes)?\s+til\s+["']?([^"'\n,\.]+)["']?/i,
        /ansøgning(?:en)?\s+sendes\s+til\s+["']?([^"'\n,\.]+)["']?/i
      ];

      for (const pattern of contactPatterns) {
        const match = description.match(pattern);
        if (match && match[1]) {
          // Clean up titles and positions from contact person
          let contact = match[1].trim();
          contact = contact.replace(/^(?:hr\.|hr|fru\.|frk\.|dr\.|prof\.)\s+/i, '');
          newFormData.contact_person = contact;
          break;
        }
      }
    }

    // Try to extract URL using more patterns
    if (!formData.url) {
      const urlPattern = /(?:(?:https?:)?\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g;
      const urls = description.match(urlPattern);
      if (urls && urls.length > 0) {
        // Try to find a URL that looks like a job posting
        const jobUrl = urls.find(url => 
          url.toLowerCase().includes('job') || 
          url.toLowerCase().includes('career') || 
          url.toLowerCase().includes('stilling')
        ) || urls[0];
        
        // Ensure URL has proper protocol
        if (!jobUrl.startsWith('http')) {
          newFormData.url = 'https://' + jobUrl;
        } else {
          newFormData.url = jobUrl;
        }
      }
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
