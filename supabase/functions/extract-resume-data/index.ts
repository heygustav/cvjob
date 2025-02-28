
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createWorker } from "https://cdn.jsdelivr.net/npm/tesseract.js@4.0.3/+esm";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to extract text from PDF using Tesseract.js
async function extractTextFromPdf(pdfBase64: string): Promise<string> {
  try {
    console.log("Starting Tesseract worker...");
    const worker = await createWorker('eng');

    console.log("Converting PDF to images for OCR processing...");
    
    // Process with base64 data
    console.log("Running OCR on PDF content...");
    const { data } = await worker.recognize(pdfBase64);
    
    console.log("OCR processing complete");
    await worker.terminate();
    
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Improved helper function to analyze CV text and extract structured information
function analyzeCV(text: string) {
  console.log("Analyzing CV text, length:", text.length);
  
  const extractedData: Record<string, string> = {
    experience: "",
    education: "",
    skills: "",
    email: "",
    phone: "",
    name: ""
  };
  
  // More robust section detection with regex patterns
  const experienceRegex = /(?:erfaring|erhvervserfaring|arbejdserfaring|job\s+erfaring|experience|work\s+experience|professional\s+experience)(?:\s*:|(\s+|$))/i;
  const educationRegex = /(?:uddannelse|akademisk\s+baggrund|kurser|certificeringer|education|academic\s+background|qualifications|studies)(?:\s*:|(\s+|$))/i;
  const skillsRegex = /(?:kompetencer|færdigheder|kvalifikationer|evner|tekniske\s+kompetencer|skills|competencies|technical\s+skills|core\s+skills)(?:\s*:|(\s+|$))/i;
  
  // Extract email with regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emailMatches = text.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    extractedData.email = emailMatches[0];
    console.log("Found email:", extractedData.email);
  }
  
  // Extract phone numbers with regex
  const phoneRegex = /(?:\+\d{2}[\s-]?)?(?:\d{2}[\s-]?){4}\d{2}|\(\d{2}\)[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    extractedData.phone = phoneMatches[0].replace(/\s+/g, '');
    console.log("Found phone:", extractedData.phone);
  }
  
  // Try to extract name (often at the beginning of the CV)
  // Look for potential names in the first few lines
  const firstLines = text.split('\n').slice(0, 5).join(' ');
  const nameRegex = /^([A-Z][a-zæøåÆØÅ]+(?:\s+[A-Z][a-zæøåÆØÅ]+){1,2})/m;
  const nameMatch = firstLines.match(nameRegex);
  if (nameMatch && nameMatch[0] && nameMatch[0].length > 4) {
    extractedData.name = nameMatch[0].trim();
    console.log("Found potential name:", extractedData.name);
  }
  
  // Find section boundaries with regex
  let experienceMatch = experienceRegex.exec(text);
  let educationMatch = educationRegex.exec(text);
  let skillsMatch = skillsRegex.exec(text);
  
  console.log("Section matches:", {
    experience: experienceMatch ? experienceMatch.index : -1,
    education: educationMatch ? educationMatch.index : -1, 
    skills: skillsMatch ? skillsMatch.index : -1
  });
  
  // Build array of section positions
  const sections = [
    { name: "experience", pos: experienceMatch ? experienceMatch.index : -1 },
    { name: "education", pos: educationMatch ? educationMatch.index : -1 },
    { name: "skills", pos: skillsMatch ? skillsMatch.index : -1 }
  ].filter(section => section.pos !== -1)
   .sort((a, b) => a.pos - b.pos);
  
  // Extract content between sections
  for (let i = 0; i < sections.length; i++) {
    const currentSection = sections[i];
    const nextSection = sections[i + 1];
    
    const sectionStart = currentSection.pos;
    // If this is the last section, extract until the end
    const sectionEnd = nextSection ? nextSection.pos : undefined;
    
    // Extract the section content
    let sectionContent = sectionEnd 
      ? text.substring(sectionStart, sectionEnd).trim() 
      : text.substring(sectionStart).trim();
    
    // Remove section title from the content
    const firstNewlineIndex = sectionContent.indexOf('\n');
    if (firstNewlineIndex !== -1) {
      sectionContent = sectionContent.substring(firstNewlineIndex).trim();
    }
    
    // Store the extracted content
    extractedData[currentSection.name] = sectionContent;
    console.log(`Extracted ${currentSection.name} section, length: ${sectionContent.length} characters`);
  }
  
  // Handle case where no clear sections were found with regex
  if (sections.length === 0) {
    console.log("No clear sections found, attempting fallback method");
    
    // Split by double newlines to get paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    
    // If we have at least 3 paragraphs, assign them to the main sections
    if (paragraphs.length >= 3) {
      extractedData.experience = paragraphs[0];
      extractedData.education = paragraphs[1];
      extractedData.skills = paragraphs[2];
      console.log("Applied fallback method using paragraphs");
    } else if (paragraphs.length > 0) {
      // Just use the content as experience
      extractedData.experience = paragraphs.join('\n\n');
      console.log("Used all content as experience section");
    }
  }
  
  // Clean up sections
  for (const key of ["experience", "education", "skills"]) {
    if (!extractedData[key] || extractedData[key].length < 10) {
      extractedData[key] = `Kunne ikke identificere ${key} i dit CV. Venligst udfyld denne sektion manuelt.`;
      console.log(`Section ${key} was too short or not found`);
    }
  }
  
  // Additional post-processing to improve quality of extracted data
  // Remove common artifacts from OCR
  for (const key of Object.keys(extractedData)) {
    if (typeof extractedData[key] === 'string') {
      // Replace multiple spaces with a single space
      extractedData[key] = extractedData[key].replace(/\s{2,}/g, ' ');
      // Remove strange characters that might come from OCR errors
      extractedData[key] = extractedData[key].replace(/[^\w\s.,;:()[\]{}@+-=/\\æøåÆØÅ]/g, '');
    }
  }
  
  return extractedData;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("Resume extraction function started");
    
    // Get the request body as JSON
    const requestData = await req.json();
    const { fileBase64, fileName, fileType, fileSize } = requestData;

    if (!fileBase64) {
      console.error("No file data provided");
      return new Response(
        JSON.stringify({ error: "No valid file data provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing file: ${fileName}, size: ${fileSize} bytes, type: ${fileType}`);

    // Check if it's a PDF file
    if (fileType !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "Uploaded file is not a PDF" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Extract the base64 data (remove the data URL prefix if it exists)
      const base64Data = fileBase64.split(',')[1] || fileBase64;
      
      // For debugging: Check what we received
      console.log("Base64 data length:", base64Data.length);
      
      // Extract text from the PDF using Tesseract.js with base64 data
      console.log("Extracting text from PDF using Tesseract...");
      const extractedText = await extractTextFromPdf(fileBase64);
      
      if (!extractedText || extractedText.trim().length === 0) {
        console.log("No text could be extracted from the PDF");
        return new Response(
          JSON.stringify({ 
            error: "Kunne ikke udtrække tekst fra PDF. Filen kan være scannet eller passwordbeskyttet." 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      console.log(`Extracted ${extractedText.length} characters of text from PDF`);
      
      // Analyze the CV text to extract structured information with improved analysis
      console.log("Analyzing CV text with enhanced logic...");
      const extractedData = analyzeCV(extractedText);
      
      console.log("Analysis complete, extracted data keys:", Object.keys(extractedData));
      
      return new Response(
        JSON.stringify({
          extractedData,
          message: "CV data blev succesfuldt udtrukket. Gennemgå venligst resultatet og juster efter behov."
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (parsingError) {
      console.error("Error parsing PDF:", parsingError);
      return new Response(
        JSON.stringify({ 
          error: `Fejl ved analyse af PDF: ${parsingError.message}`,
          suggestion: "Prøv med en anden PDF-fil, eller udfyld oplysningerne manuelt."
        }),
        {
          status: 422, // Unprocessable Entity
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in function:", error);
    return new Response(
      JSON.stringify({ error: `Der opstod en uventet fejl: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
