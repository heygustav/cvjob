
import { supabase } from '@/integrations/supabase/client';
import { fileToBase64, validateFile } from './fileUtils';
import { validateExtractedData } from './dataValidator';
import { ParsedResumeData, ProcessResult } from './types';

/**
 * Processes a PDF file by sending it to the Edge Function for analysis
 */
export const processPdfFile = async (file: File): Promise<ProcessResult> => {
  // Validate the file
  const { isValid, error: validationError } = validateFile(file);
  if (!isValid) {
    return {
      success: false,
      error: validationError
    };
  }

  // Add additional logging
  console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

  try {
    // Convert file to base64
    console.log("Converting file to base64");
    const fileBase64 = await fileToBase64(file);
    console.log("Base64 conversion complete, length:", fileBase64.length);
    
    // Check if fileBase64 is valid
    if (!fileBase64 || fileBase64.length < 100) {
      console.error("Invalid base64 data generated");
      return {
        success: false,
        error: "Kunne ikke konvertere fil til korrekt format"
      };
    }
    
    console.log("Starting CV parsing process");

    // Call the Supabase Edge Function with timeout handling
    console.log("Invoking extract-resume-data function");
    
    try {
      // Basic request payload with essential information - avoid sending the full base64 string in logs
      console.log("Sending request with payload:", { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type,
        base64Length: fileBase64.length
      });

      const { data, error } = await Promise.race([
        supabase.functions.invoke('extract-resume-data', {
          body: { 
            fileBase64: fileBase64,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size 
          }
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Tidsgrænse overskredet ved behandling af CV')), 60000)
        )
      ]);

      console.log("Response from Edge Function received:", 
        data ? "Data present" : "No data", 
        error ? `Error: ${error.message}` : "No error"
      );

      if (error) {
        return handleEdgeFunctionError(error);
      }

      if (!data) {
        console.error("No data returned from Edge Function");
        return { 
          success: false, 
          error: 'Ingen data returneret fra CV-analysen' 
        };
      }

      if (!data.extractedData) {
        console.error("No extracted data in response:", data);
        return { 
          success: false, 
          error: 'Kunne ikke finde data i CV-analysen' 
        };
      }

      // Validate the extracted data
      const validatedData = validateExtractedData(data.extractedData);
      
      // Log what was extracted vs. what was validated
      console.log("Raw extracted data keys:", Object.keys(data.extractedData));
      console.log("Validated data keys:", Object.keys(validatedData));
      
      // Only return success if we have some validated data
      if (Object.keys(validatedData).length > 0) {
        return { 
          success: true, 
          data: {
            validatedData,
            extractedFields: Object.keys(validatedData)
          }
        };
      } else {
        return { 
          success: false, 
          error: 'Begrænset information fundet i dit CV. Prøv venligst at udfylde oplysningerne manuelt.'
        };
      }
    } catch (functionError: any) {
      return handleFunctionTimeoutError(functionError);
    }
  } catch (error: any) {
    console.error('Error extracting resume data:', error);
    
    // More descriptive error message
    let errorMessage = 'Der opstod en fejl under behandling af CV';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Handles errors from the Edge Function
 */
function handleEdgeFunctionError(error: any): ProcessResult {
  console.error("Supabase function error:", error);
  
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
  
  return { success: false, error: errorMessage };
}

/**
 * Handles timeout errors from the Edge Function
 */
function handleFunctionTimeoutError(error: any): ProcessResult {
  console.error("Error invoking Edge Function:", error);
  let errorMessage = error.message || 'Fejl ved behandling af CV';
  
  if (errorMessage.includes('Tidsgrænse overskredet')) {
    errorMessage = 'Tidsgrænse overskredet ved behandling af CV. Prøv med en mindre fil eller senere.';
  }
  
  return { success: false, error: errorMessage };
}
