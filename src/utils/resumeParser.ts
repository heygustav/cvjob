
import { supabase } from '@/integrations/supabase/client';
import { PersonalInfoFormState } from '@/pages/Profile';

export interface ParsedResumeData {
  validatedData: Partial<PersonalInfoFormState>;
  extractedFields: string[];
}

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Validate and sanitize the extracted data
export const validateExtractedData = (data: any): Partial<PersonalInfoFormState> => {
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

// Process PDF file and extract data
export const processPdfFile = async (
  file: File
): Promise<{ 
  success: boolean; 
  data?: ParsedResumeData; 
  error?: string; 
}> => {
  // Add better file validation
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return {
      success: false,
      error: "PDF-filen må maksimalt være 10MB"
    };
  }

  // Check if the file is a PDF
  if (file.type !== 'application/pdf') {
    return {
      success: false,
      error: "Venligst upload en PDF-fil"
    };
  }

  // Add additional logging
  console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

  try {
    // Convert file to base64 instead of using FormData
    console.log("Converting file to base64");
    const fileBase64 = await fileToBase64(file);
    
    console.log("Starting CV parsing process");

    // Call the Supabase Edge Function with more detailed logging
    console.log("Invoking extract-resume-data function");
    const { data, error } = await supabase.functions.invoke('extract-resume-data', {
      body: { 
        fileBase64,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size 
      },
      headers: {
        'Content-Type': 'application/json',
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
      
      return { success: false, error: errorMessage };
    }

    if (!data || !data.extractedData) {
      console.error("Unexpected data format:", data);
      return { 
        success: false, 
        error: 'Kunne ikke hente data fra CV' 
      };
    }

    // Validate and sanitize the extracted data
    const validatedData = validateExtractedData(data.extractedData);
    
    // Log what was extracted vs. what was validated
    console.log("Raw extracted data:", data.extractedData);
    console.log("Validated data being used:", validatedData);
    
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
