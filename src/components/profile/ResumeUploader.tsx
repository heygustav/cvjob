
import React, { useState, useRef, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from '@/pages/Profile';
import { supabase } from '@/integrations/supabase/client';
import ErrorDisplay from '@/components/ErrorDisplay';

interface ResumeUploaderProps {
  onExtractedData: (data: Partial<PersonalInfoFormState>) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onExtractedData }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This function will validate and sanitize the extracted data
  const validateExtractedData = (data: any): Partial<PersonalInfoFormState> => {
    const validated: Partial<PersonalInfoFormState> = {};
    
    // Check if data has the expected structure
    if (!data || typeof data !== 'object') {
      console.error("Invalid data structure:", data);
      return {};
    }
    
    // Only include fields that have non-default values
    // For skills, education, and experience sections
    if (data.skills && 
        typeof data.skills === 'string' && 
        data.skills.trim().length > 10 && 
        !data.skills.includes("Kunne ikke identificere")) {
      validated.skills = data.skills;
    }
    
    if (data.education && 
        typeof data.education === 'string' && 
        data.education.trim().length > 10 && 
        !data.education.includes("Kunne ikke identificere")) {
      validated.education = data.education;
    }
    
    if (data.experience && 
        typeof data.experience === 'string' && 
        data.experience.trim().length > 10 && 
        !data.experience.includes("Kunne ikke identificere")) {
      validated.experience = data.experience;
    }
    
    // For email, we'll do a basic validation
    if (data.email && 
        typeof data.email === 'string' && 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      validated.email = data.email;
    }
    
    // Log what fields were extracted
    console.log("Validated fields:", Object.keys(validated));
    
    return validated;
  };

  const processPdfFile = async (file: File) => {
    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Forkert filtype",
        description: "Venligst upload en PDF-fil",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    setError(null);
    
    toast({
      title: "Behandler PDF",
      description: "Vi uploader og analyserer dit CV...",
    });

    try {
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log("Starting CV parsing process");

      // Call the Supabase Edge Function with more detailed logging
      console.log("Invoking extract-resume-data function");
      const { data, error } = await supabase.functions.invoke('extract-resume-data', {
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log("Response from Edge Function:", data, error);

      if (error) {
        console.error("Supabase function error:", error);
        
        // Provide more specific error messages based on error status
        let errorMessage = 'Der opstod en fejl under behandling af CV';
        
        if (error.message) {
          if (error.message.includes('Failed to send a request')) {
            errorMessage = 'Kunne ikke forbinde til CV-analyse tjenesten. Tjek din internetforbindelse og prøv igen senere.';
          } else if (error.message.includes('non-2xx status code')) {
            errorMessage = 'Serverfejl ved behandling af CV. Prøv igen senere.';
          } else {
            errorMessage = error.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      if (!data || !data.extractedData) {
        console.error("Unexpected data format:", data);
        throw new Error('Kunne ikke hente data fra CV');
      }

      // Validate and sanitize the extracted data
      const validatedData = validateExtractedData(data.extractedData);
      
      // Log what was extracted vs. what was validated
      console.log("Raw extracted data:", data.extractedData);
      console.log("Validated data being used:", validatedData);
      
      // Only update if we have some validated data
      if (Object.keys(validatedData).length > 0) {
        onExtractedData(validatedData);
        
        // Show a more specific toast based on what was extracted
        const extractedFields = Object.keys(validatedData).join(', ');
        toast({
          title: "CV analyseret",
          description: `Følgende oplysninger er blevet udfyldt: ${extractedFields}. Gennemgå og juster efter behov.`,
        });
      } else {
        toast({
          title: "Begrænset information fundet",
          description: "Vi kunne ikke finde tilstrækkelig information i dit CV. Prøv venligst at udfylde oplysningerne manuelt.",
        });
      }
    } catch (error: any) {
      console.error('Error extracting resume data:', error);
      
      // More descriptive error message
      let errorMessage = 'Der opstod en fejl under behandling af CV';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Fejl ved analyse af CV",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      // Clear file input if it exists
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processPdfFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const retryUpload = () => {
    setError(null);
  };

  return (
    <div className="mb-6">
      <div 
        className={`p-4 border-2 border-dashed ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-lg text-center transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={isExtracting ? undefined : handleClick}
      >
        <div className="py-4">
          <Upload className={`h-10 w-10 mx-auto ${isDragging ? 'text-primary' : 'text-gray-400'} mb-3 transition-colors`} />
          <h3 className="text-sm font-medium text-gray-900 mb-1">Upload dit CV</h3>
          <p className="text-xs text-gray-500 mb-4 italic">
            {isDragging 
              ? "Slip filen for at uploade..." 
              : "Træk og slip din PDF-fil her, eller klik for at vælge"}
          </p>
          
          {isExtracting ? (
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-primary">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary"
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
              Behandler PDF...
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Accepterer kun PDF-filer
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isExtracting}
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2 mb-3 italic text-left">
        OBS: Vi bruger forbedret teknologi til at analysere dit CV. Vi vil kun forsøge at udfylde din profil med information, der kan udtrækkes med høj sikkerhed.
      </p>
      
      {error && (
        <ErrorDisplay
          title="Fejl ved analyse af CV"
          message={error}
          onRetry={retryUpload}
        />
      )}
    </div>
  );
};

export default ResumeUploader;
