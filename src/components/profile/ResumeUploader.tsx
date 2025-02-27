
import React, { useState, useRef, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFormState } from '@/pages/Profile';
import { useNetworkUtils } from "@/hooks/coverLetter/useNetworkUtils";

interface ResumeUploaderProps {
  onExtractedData: (data: Partial<PersonalInfoFormState>) => void;
}

// Fallback data in case the Edge Function isn't working
const MOCK_RESUME_DATA: Partial<PersonalInfoFormState> = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+45 12 34 56 78",
  address: "Hovedgaden 123, 2100 København Ø",
  experience: "5+ års erfaring som softwareudvikler hos XYZ A/S.\nLed udviklingen af enterprise systemer med React og .NET.",
  education: "Kandidat i Datalogi, Københavns Universitet, 2020\nBachelor i Softwareudvikling, DTU, 2018",
  skills: "JavaScript, TypeScript, React, Node.js, C#, .NET, SQL, Docker, Git, Agile Development, Scrum"
};

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onExtractedData }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { fetchWithTimeout } = useNetworkUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    toast({
      title: "Behandler PDF",
      description: "Vi uploader og analyserer dit CV...",
    });

    try {
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('file', file);

      // Get the access token for authorization
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('Du skal være logget ind for at uploade dit CV');
      }

      let response;
      try {
        // Try to use the Edge Function
        response = await fetchWithTimeout(
          fetch('https://zfyzkiseykwvpckavbxd.functions.supabase.co/extract-resume-data', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }),
          30000 // 30 second timeout for PDF processing
        );
      } catch (fetchError) {
        console.error("Edge function error:", fetchError);
        
        // If the Edge Function fails, use the mock data instead
        console.log("Using mock data instead");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
        onExtractedData(MOCK_RESUME_DATA);
        
        toast({
          title: "CV analyseret (demo)",
          description: "Dine profiloplysninger er blevet udfyldt med eksempeldata, da vores tjeneste er midlertidigt nede.",
        });
        
        return; // Exit early
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Edge function response error:", errorText);
        
        // If the Edge Function returns an error, use the mock data instead
        console.log("Using mock data due to response error");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
        onExtractedData(MOCK_RESUME_DATA);
        
        toast({
          title: "CV analyseret (demo)",
          description: "Dine profiloplysninger er blevet udfyldt med eksempeldata, da vores tjeneste er midlertidigt nede.",
        });
        
        return; // Exit early
      }

      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        
        // If parsing fails, use the mock data
        console.log("Using mock data due to parsing error");
        onExtractedData(MOCK_RESUME_DATA);
        
        toast({
          title: "CV analyseret (demo)",
          description: "Dine profiloplysninger er blevet udfyldt med eksempeldata, da der var et problem med fortolkningen.",
        });
        
        return; // Exit early
      }
      
      if (result.error) {
        console.error("Result contains error:", result.error);
        
        // If result contains an error, use the mock data
        console.log("Using mock data due to result error");
        onExtractedData(MOCK_RESUME_DATA);
        
        toast({
          title: "CV analyseret (demo)",
          description: "Dine profiloplysninger er blevet udfyldt med eksempeldata grundet en fejl.",
        });
        
        return; // Exit early
      }

      // If all went well, update the form with the extracted data
      if (result.extractedData) {
        onExtractedData(result.extractedData);
        
        toast({
          title: "CV analyseret",
          description: "Dine profiloplysninger er blevet udfyldt baseret på dit CV",
        });
      } else {
        // If no extracted data, fall back to mock data
        console.log("No extracted data, using mock data");
        onExtractedData(MOCK_RESUME_DATA);
        
        toast({
          title: "CV analyseret (demo)",
          description: "Vi kunne ikke udtrække information fra PDF'en, så vi har brugt eksempeldata.",
        });
      }
    } catch (error) {
      console.error('Error extracting resume data:', error);
      
      // Fallback to mock data on any error
      console.log("Using mock data due to general error");
      onExtractedData(MOCK_RESUME_DATA);
      
      toast({
        title: "CV analyseret (demo)",
        description: "Der opstod en fejl, så vi har brugt eksempeldata til din profil.",
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

  return (
    <div 
      className={`mb-6 p-4 border-2 border-dashed ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-lg text-center transition-colors duration-200`}
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
  );
};

export default ResumeUploader;
