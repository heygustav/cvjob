
import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from '@/pages/Profile';
import ErrorDisplay from '@/components/ErrorDisplay';
import FileDropArea from './FileDropArea';
import { processPdfFile } from '@/utils/resumeParser';
import { validateFile } from '@/utils/resume/fileUtils';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    
    // Validate file before processing
    const { isValid, error: validationError } = validateFile(file);
    if (!isValid) {
      setError(validationError || "Ukendt valideringsfejl");
      setIsExtracting(false);
      toast({
        title: "Filvalideringsfejl",
        description: validationError || "Filen kunne ikke valideres",
        variant: "destructive",
      });
      return;
    }
    
    // Log file details
    console.log("Starting upload process", { 
      fileName: file.name, 
      fileSize: file.size,
      fileType: file.type
    });
    
    toast({
      title: "Behandler fil",
      description: "Vi analyserer dit CV...",
    });

    try {
      // Verify PDF.js worker is available
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const workerSrc = '/pdf.worker.js';
        try {
          const workerCheck = await fetch(workerSrc, { method: 'HEAD' });
          if (!workerCheck.ok) {
            console.error(`PDF worker file check failed with status: ${workerCheck.status}`);
            throw new Error('PDF-læser komponenten kunne ikke indlæses. Prøv at genindlæse siden eller prøv med en DOCX-fil i stedet.');
          }
        } catch (workerError) {
          console.error('Error checking PDF worker:', workerError);
          toast({
            title: "Problem med PDF-læser",
            description: "Vi havde problemer med at indlæse PDF-læser komponenten. Prøv at genindlæse siden eller upload en DOCX-fil i stedet.",
            variant: "destructive",
          });
        }
      }
      
      // Process file with our client-side parser
      const result = await processPdfFile(file);
      
      console.log("Response from processing", { 
        success: result.success, 
        error: result.error || null,
        dataKeys: result.data ? Object.keys(result.data) : null,
        extractedFields: result.data?.extractedFields || null,
        confidence: result.data?.confidence || null
      });
      
      if (!result.success) {
        setError(result.error || 'Ukendt fejl ved behandling af CV');
        toast({
          title: "Bemærk",
          description: result.error || 'Vi kunne ikke analysere dit CV. Venligst udfyld oplysningerne manuelt.',
          variant: "default",
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
        
        // Add additional toast with confidence information if available
        if (result.data.confidence) {
          const confidenceValues = Object.entries(result.data.confidence)
            .map(([field, value]) => `${field}: ${Math.round(value * 100)}%`)
            .join(', ');
            
          console.log("Confidence scores:", confidenceValues);
          
          // Only show confidence toast if we have confidence data
          if (confidenceValues.length > 0) {
            toast({
              title: "Analyse-sikkerhed",
              description: `Sikkerhed for udfyldte felter: ${confidenceValues}`,
            });
          }
        }
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
    
    // Refresh the page to reload the PDF.js worker
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Check if PDF.js worker is available after a short delay
    setTimeout(async () => {
      try {
        const workerCheck = await fetch('/pdf.worker.js', { method: 'HEAD' });
        if (workerCheck.ok) {
          toast({
            title: "PDF-læser klar",
            description: "PDF-læser komponenten er nu klar. Du kan prøve at uploade din fil igen.",
          });
        }
      } catch (error) {
        console.error("Error checking PDF worker availability:", error);
      }
    }, 1000);
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <Label htmlFor="cv-upload" className="block text-sm font-medium text-gray-700 mb-1">
          Upload CV (PDF eller DOCX)
        </Label>
        <div className="flex gap-2">
          <Input
            id="cv-upload"
            type="file"
            accept=".pdf,.docx"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
              }
            }}
            disabled={isExtracting}
            className="flex-1"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 italic">
          Du kan uploade dit CV for at automatisk udfylde formularen. Understøttede formater: PDF, DOCX.
        </p>
      </div>
      
      <FileDropArea 
        onFileSelected={handleFileSelected}
        isProcessing={isExtracting}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      
      {error && (
        <ErrorDisplay
          title="Information om CV-upload"
          message={error}
          onRetry={retryUpload}
          phase="cv-parsing"
        />
      )}
    </div>
  );
};

export default ResumeUploader;
