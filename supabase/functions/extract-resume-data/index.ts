
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// Helper function to extract text from a PDF using PDF.js
async function extractTextFromPdf(pdfBytes: Uint8Array): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF document loaded with ${pdf.numPages} pages`);
    
    // Extract text from all pages
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      
      fullText += pageText + "\n\n";
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Helper function to analyze CV text and extract structured information
function analyzeCV(text: string) {
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
  
  // Find starting position for each section
  for (const keyword of experienceKeywords) {
    const pos = lowerText.indexOf(keyword);
    if (pos !== -1 && (expStart === -1 || pos < expStart)) {
      expStart = pos;
    }
  }
  
  for (const keyword of educationKeywords) {
    const pos = lowerText.indexOf(keyword);
    if (pos !== -1 && (eduStart === -1 || pos < eduStart)) {
      eduStart = pos;
    }
  }
  
  for (const keyword of skillsKeywords) {
    const pos = lowerText.indexOf(keyword);
    if (pos !== -1 && (skillsStart === -1 || pos < skillsStart)) {
      skillsStart = pos;
    }
  }
  
  // Define section boundaries
  const boundaries = [
    { name: "experience", start: expStart },
    { name: "education", start: eduStart },
    { name: "skills", start: skillsStart }
  ].filter(section => section.start !== -1)
   .sort((a, b) => a.start - b.start);
  
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
  }
  
  // Handle case where no sections were found
  if (boundaries.length === 0) {
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    
    // If we have paragraphs, try to assign them intelligently
    if (paragraphs.length >= 3) {
      sections.experience = paragraphs[0];
      sections.education = paragraphs[1];
      sections.skills = paragraphs[2];
    } else if (paragraphs.length > 0) {
      // Just use the content as experience
      sections.experience = paragraphs.join('\n\n');
    }
  }
  
  // Clean up sections
  for (const [key, value] of Object.entries(sections)) {
    if (!value || value.length < 10) {
      sections[key] = `Kunne ikke identificere ${key} i dit CV. Venligst udfyld denne sektion manuelt.`;
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
    
    // Get the PDF file from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.error("No file provided or invalid file");
      return new Response(
        JSON.stringify({ error: "No valid file provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Check if it's a PDF file
    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "Uploaded file is not a PDF" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Read the file as a buffer
      const fileBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(fileBuffer);
      
      // Extract text from the PDF
      console.log("Extracting text from PDF...");
      const extractedText = await extractTextFromPdf(pdfBytes);
      
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
