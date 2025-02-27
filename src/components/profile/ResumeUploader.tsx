
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

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('extract-resume-data', {
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log("Response from Edge Function:", data, error);

      if (error) {
        throw new Error(error.message || 'Der opstod en fejl under behandling af CV');
      }

      if (!data || !data.extractedData) {
        throw new Error('Kunne ikke hente data fra CV');
      }

      // Extract the data
      const extractedData = data.extractedData;
      onExtractedData(extractedData);
      
      toast({
        title: "CV analyseret",
        description: "Dine profiloplysninger er blevet udfyldt baseret på dit CV.",
      });
    } catch (error: any) {
      console.error('Error extracting resume data:', error);
      
      setError(error.message || 'Der opstod en fejl under behandling af CV');
      
      toast({
        title: "Fejl ved analyse af CV",
        description: error.message || 'Der opstod en fejl under behandling af CV',
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
        OBS: Hvis funktionen her ikke ekstraherer den rigtige information fra dit CV, så vil dit CV i nuværende form sandsynligvis ikke bestå de fleste CV-scannere hos arbejdsgivere.
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
