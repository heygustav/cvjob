
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

// Helper function to analyze CV text and extract structured information
function analyzeCV(text: string) {
  console.log("Analyzing CV text, length:", text.length);
  
  const sections: Record<string, string> = {
    experience: "",
    education: "",
    skills: ""
  };
  
  // Convert text to lowercase for easier pattern matching
  const lowerText = text.toLowerCase();
  
  // Extract Experience Section
  const experienceKeywords = [
    "erfaring", "erhvervserfaring", "arbejdserfaring", "job erfaring",
    "experience", "work experience", "professional experience"
  ];
  
  const educationKeywords = [
    "uddannelse", "akademisk baggrund", "kurser", "certificeringer",
    "education", "academic background", "qualifications", "studies"
  ];
  
  const skillsKeywords = [
    "kompetencer", "færdigheder", "kvalifikationer", "evner", "tekniske kompetencer",
    "skills", "competencies", "technical skills", "qualifications", "core skills"
  ];
  
  // Find starting positions of each section
  let expStart = -1;
  let eduStart = -1;
  let skillsStart = -1;
  
  // Find starting position for each section with improved logging
  for (const keyword of experienceKeywords) {
    const pos = lowerText.indexOf(keyword);
    if (pos !== -1 && (expStart === -1 || pos < expStart)) {
      expStart = pos;
      console.log(`Found experience section at position ${pos} with keyword "${keyword}"`);
    }
  }
  
  for (const keyword of educationKeywords) {
    const pos = lowerText.indexOf(keyword);
    if (pos !== -1 && (eduStart === -1 || pos < eduStart)) {
      eduStart = pos;
      console.log(`Found education section at position ${pos} with keyword "${keyword}"`);
    }
  }
  
  for (const keyword of skillsKeywords) {
    const pos = lowerText.indexOf(keyword);
    if (pos !== -1 && (skillsStart === -1 || pos < skillsStart)) {
      skillsStart = pos;
      console.log(`Found skills section at position ${pos} with keyword "${keyword}"`);
    }
  }
  
  // Define section boundaries
  const boundaries = [
    { name: "experience", start: expStart },
    { name: "education", start: eduStart },
    { name: "skills", start: skillsStart }
  ].filter(section => section.start !== -1)
   .sort((a, b) => a.start - b.start);
  
  console.log("Identified sections:", boundaries.map(b => b.name).join(", "));
  
  // Extract section content based on boundaries
  for (let i = 0; i < boundaries.length; i++) {
    const currentSection = boundaries[i];
    const nextSection = boundaries[i + 1];
    
    const sectionStart = currentSection.start;
    const sectionEnd = nextSection ? nextSection.start : undefined;
    
    let sectionContent = sectionEnd 
      ? text.substring(sectionStart, sectionEnd).trim() 
      : text.substring(sectionStart).trim();
    
    // Remove section title from the beginning of the content
    const titleEndIndex = sectionContent.indexOf('\n');
    if (titleEndIndex !== -1) {
      sectionContent = sectionContent.substring(titleEndIndex).trim();
    }
    
    sections[currentSection.name] = sectionContent;
    console.log(`Extracted ${currentSection.name} section, length: ${sectionContent.length} characters`);
  }
  
  // Handle case where no sections were found
  if (boundaries.length === 0) {
    console.log("No clear sections found, attempting fallback method");
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    
    // If we have paragraphs, try to assign them intelligently
    if (paragraphs.length >= 3) {
      sections.experience = paragraphs[0];
      sections.education = paragraphs[1];
      sections.skills = paragraphs[2];
      console.log("Applied fallback method using paragraphs");
    } else if (paragraphs.length > 0) {
      // Just use the content as experience
      sections.experience = paragraphs.join('\n\n');
      console.log("Used all content as experience section");
    }
  }
  
  // Clean up sections
  for (const [key, value] of Object.entries(sections)) {
    if (!value || value.length < 10) {
      sections[key] = `Kunne ikke identificere ${key} i dit CV. Venligst udfyld denne sektion manuelt.`;
      console.log(`Section ${key} was too short or not found`);
    }
  }
  
  return sections;
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
      
      // Analyze the CV text to extract structured information
      console.log("Analyzing CV text...");
      const extractedData = analyzeCV(extractedText);
      
      console.log("Analysis complete, returning results");
      
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
