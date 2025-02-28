
import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from '@/pages/Profile';
import ErrorDisplay from '@/components/ErrorDisplay';
import FileDropArea from './FileDropArea';
import { processPdfFile } from '@/utils/resumeParser';

interface ResumeUploaderProps {
  onExtractedData: (data: Partial<PersonalInfoFormState>) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onExtractedData }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    if (isExtracting) return;
    
    setIsExtracting(true);
    setError(null);
    
    // More comprehensive logging at the start of the process
    console.log("Starting upload process", { 
      fileName: file.name, 
      fileSize: file.size,
      fileType: file.type
    });
    
    toast({
      title: "Behandler PDF",
      description: "Vi uploader og analyserer dit CV...",
    });

    try {
      const result = await processPdfFile(file);
      
      // Comprehensive logging of the response
      console.log("Response from processing", { 
        success: result.success, 
        error: result.error || null,
        dataKeys: result.data ? Object.keys(result.data) : null,
        extractedFields: result.data?.extractedFields || null,
        validatedDataKeys: result.data?.validatedData ? Object.keys(result.data.validatedData) : null
      });
      
      if (!result.success) {
        setError(result.error || 'Ukendt fejl ved behandling af CV');
        toast({
          title: "Fejl ved analyse af CV",
          description: result.error || 'Ukendt fejl ved behandling af CV',
          variant: "destructive",
        });
        return;
      }
      
      if (result.data) {
        console.log("Data extracted successfully, updating form with:", result.data.validatedData);
        onExtractedData(result.data.validatedData);
        
        // Show a more specific toast based on what was extracted
        const extractedFields = result.data.extractedFields.join(', ');
        toast({
          title: "CV analyseret",
          description: `Følgende oplysninger er blevet udfyldt: ${extractedFields}. Gennemgå og juster efter behov.`,
        });
      }
    } catch (error: any) {
      console.error('Unexpected error in CV processing:', error);
      const errorMessage = error.message || 'Uventet fejl under behandling af CV';
      setError(errorMessage);
      toast({
        title: "Fejl ved analyse af CV",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log("Upload process completed", { 
        status: error ? "error" : "success",
        error: error
      });
      
      setIsExtracting(false);
      // Clear file input if it exists
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const retryUpload = () => {
    console.log("Retrying upload, resetting error state");
    setError(null);
  };

  return (
    <div className="mb-6">
      <FileDropArea 
        onFileSelected={handleFileSelected}
        isProcessing={isExtracting}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      
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
