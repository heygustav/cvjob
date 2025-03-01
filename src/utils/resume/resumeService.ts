
import { supabase } from '@/integrations/supabase/client';
import { fileToBase64, validateFile } from './fileUtils';
import { validateExtractedData } from './dataValidator';
import { ParsedResumeData, ProcessResult, RawResumeData } from './types';

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
    
    // Implementing a direct client-side fallback option
    // This simulates what would happen if parsing was successful but with low confidence
    // In a production environment, you might want to actually call the edge function
    
    // Let the user know we're trying client-side parsing
    console.log("Starting client-side processing approach");
    
    try {
      // Basic request payload with essential information
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
          setTimeout(() => reject(new Error('Tidsgrænse overskredet ved behandling af CVJob')), 15000)
        )
      ]);

      console.log("Response received:", 
        data ? `Data status: ${data.status || 'No status'}` : "No data", 
        error ? `Error: ${error.message}` : "No error"
      );

      if (error) {
        return handleEdgeFunctionError(error);
      }

      if (!data) {
        console.error("No data returned from processing");
        return { 
          success: false, 
          error: 'Dit CV kunne ikke analyseres. Venligst udfyld oplysningerne manuelt.' 
        };
      }

      // If we received a manual_entry_needed status, inform the user
      if (data.status === "manual_entry_needed") {
        return { 
          success: false, 
          error: 'CV analyse er midlertidigt utilgængelig. Venligst udfyld din information manuelt.'
        };
      }

      if (!data.extractedData) {
        console.error("No extracted data in response:", data);
        return { 
          success: false, 
          error: 'Kunne ikke finde data i CVJob-analysen. Venligst udfyld oplysningerne manuelt.' 
        };
      }

      // Log the raw extracted data
      console.log("Raw extracted data:", data.extractedData);

      // Validate the extracted data
      const rawData: RawResumeData = data.extractedData;
      const validatedData = validateExtractedData(rawData);
      
      // Log what was extracted vs. what was validated
      console.log("Raw extracted data keys:", Object.keys(data.extractedData));
      console.log("Validated data keys:", Object.keys(validatedData));
      console.log("Confidence scores:", rawData.confidence || "Not available");
      
      // Only return success if we have some validated data
      if (Object.keys(validatedData).length > 0) {
        return { 
          success: true, 
          data: {
            validatedData,
            extractedFields: Object.keys(validatedData),
            confidence: rawData.confidence
          }
        };
      } else {
        return { 
          success: false, 
          error: 'Vi kunne ikke finde nogen brugbar information i dit CVJob. Venligst udfyld oplysningerne manuelt.'
        };
      }
    } catch (functionError: any) {
      return handleFunctionTimeoutError(functionError);
    }
  } catch (error: any) {
    console.error('Error processing resume data:', error);
    
    // More descriptive error message
    let errorMessage = 'Der opstod en fejl under behandling af CVJob';
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
  
  let errorMessage = 'Der opstod en fejl under behandling af CVJob';
  
  if (error.message) {
    if (error.message.includes('Failed to send a request')) {
      errorMessage = 'Kunne ikke forbinde til CV-analyse tjenesten. Tjek din internetforbindelse og prøv igen senere.';
    } else if (error.message.includes('non-2xx status code')) {
      // Check if error message includes HTTP status code
      const statusMatch = error.message.match(/(\d{3})/);
      if (statusMatch) {
        const statusCode = parseInt(statusMatch[1]);
        
        // Provide specific messages based on status code
        if (statusCode === 413) {
          errorMessage = 'PDF-filen er for stor til at blive analyseret. Prøv med en mindre fil (max 2MB).';
        } else if (statusCode === 415) {
          errorMessage = 'Filformatet understøttes ikke. Sørg for at uploade en gyldig PDF-fil.';
        } else if (statusCode === 429) {
          errorMessage = 'For mange anmodninger. Vent venligst et øjeblik og prøv igen.';
        } else if (statusCode >= 500) {
          errorMessage = 'Serverfejl ved behandling af CVJob. Vi arbejder på at løse problemet.';
        } else {
          errorMessage = 'Vi beklager, men vi kan ikke analysere din PDF-fil på nuværende tidspunkt. Venligst udfyld oplysningerne manuelt.';
        }
      } else {
        errorMessage = 'Vi beklager, men vi kan ikke analysere din PDF-fil på nuværende tidspunkt. Venligst udfyld oplysningerne manuelt.';
      }
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Det tog for lang tid at analysere din PDF. Prøv venligst igen eller udfyld oplysningerne manuelt.';
    } else {
      errorMessage = 'Vi beklager, men vi kan ikke analysere din PDF-fil på nuværende tidspunkt. Venligst udfyld oplysningerne manuelt.';
    }
  }
  
  return { success: false, error: errorMessage };
}

/**
 * Handles timeout errors from the Edge Function
 */
function handleFunctionTimeoutError(error: any): ProcessResult {
  console.error("Error invoking Edge Function:", error);
  let errorMessage = error.message || 'Fejl ved behandling af CVJob';
  
  if (errorMessage.includes('Tidsgrænse overskredet')) {
    errorMessage = 'Det tog for lang tid at analysere din PDF. Venligst udfyld oplysningerne manuelt.';
  }
  
  return { success: false, error: errorMessage };
}
