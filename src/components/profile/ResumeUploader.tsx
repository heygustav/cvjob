
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFormState } from '@/pages/Profile';

interface ResumeUploaderProps {
  onExtractedData: (data: Partial<PersonalInfoFormState>) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onExtractedData }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      // Upload the file and extract text
      const response = await fetch('https://zfyzkiseykwvpckavbxd.functions.supabase.co/extract-resume-data', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fejl ved upload af CV');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Update the form with extracted data
      if (result.extractedData) {
        onExtractedData(result.extractedData);
        
        toast({
          title: "CV analyseret",
          description: "Dine profiloplysninger er blevet udfyldt baseret på dit CV",
        });
      } else {
        toast({
          title: "Ingen data fundet",
          description: "Vi kunne ikke udtrække information fra PDF'en. Prøv at udfylde felterne manuelt.",
        });
      }
    } catch (error) {
      console.error('Error extracting resume data:', error);
      toast({
        title: "Fejl ved behandling",
        description: error instanceof Error ? error.message : "Der opstod en fejl under behandling af din PDF",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      // Clear file input
      e.target.value = '';
    }
  };

  return (
    <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="text-center">
        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">Upload dit CV</h3>
        <p className="text-xs text-gray-500 mb-3">
          Upload en PDF-fil med dit CV for at automatisk udfylde din profil
        </p>
        
        <label className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer transition-colors">
          {isExtracting ? (
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
            "Vælg PDF-fil"
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isExtracting}
          />
        </label>
      </div>
    </div>
  );
};

export default ResumeUploader;
