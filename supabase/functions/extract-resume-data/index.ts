
// Follow this setup guide to integrate the Deno runtime into your application:
// https://docs.deno.com/runtime/manual/getting_started/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from '../_shared/cors.ts';

// PDF.js library for PDF parsing
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm';

console.log("CVJob extraction function started");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received, processing data");
    
    // Get the request payload
    const payload = await req.json();
    
    if (!payload.fileBase64 || !payload.fileName || !payload.fileType) {
      console.error("Missing required fields", payload);
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Processing file: ${payload.fileName}, type: ${payload.fileType}`);
    
    // Decode base64 string
    const binaryString = atob(payload.fileBase64.split(',')[1] || payload.fileBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Load the PDF document
    // Set the worker path without using await (this was the error)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
    
    const loadingTask = pdfjs.getDocument({ data: bytes });
    const pdfDocument = await loadingTask.promise;
    
    console.log(`PDF document loaded with ${pdfDocument.numPages} pages`);
    
    // Extract text from all pages
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => 'str' in item ? item.str : '').join(' ');
      fullText += pageText + '\n';
    }
    
    console.log(`Analyzing CVJob text, length: ${fullText.length}`);
    
    if (fullText.length < 50) {
      console.error("Extracted text is too short, possibly not a valid resume");
      return new Response(
        JSON.stringify({ error: "Could not extract sufficient text from the document" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Extract key information with confidence scores
    const extractedData = await extractResumeInfo(fullText);
    
    return new Response(
      JSON.stringify({ extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing CVJob:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Function to extract resume information from text
async function extractResumeInfo(text: string) {
  // Create sections with confidence scores
  const extractEmail = (text: string) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
  };
  
  const extractPhone = (text: string) => {
    // Match various phone number formats
    const phoneRegex = /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0] : null;
  };
  
  const extractName = (text: string) => {
    // Simple heuristic: look for a name at the beginning of the document
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const potentialName = lines[0].trim();
      // Check if it looks like a name (not too long, not an email, etc.)
      if (potentialName.length > 3 && potentialName.length < 50 && !potentialName.includes('@')) {
        return potentialName;
      }
    }
    
    // Second attempt: look for common name patterns
    const nameRegex = /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)$/gm;
    const matches = [...text.matchAll(nameRegex)];
    if (matches.length > 0) {
      return matches[0][0];
    }
    
    return null;
  };
  
  // Create sections with basic pattern matching
  const findSection = (text: string, sectionName: string) => {
    const sectionRegex = new RegExp(`(${sectionName}|${sectionName.toUpperCase()})\\s*:?\\s*([\\s\\S]*?)(?:\\n\\s*(?:${sectionName}|${sectionName.toUpperCase()})|$)`, 'i');
    const match = text.match(sectionRegex);
    return match ? match[2].trim() : null;
  };
  
  // Find sections with various headings
  const findSkills = (text: string) => {
    const skillsSection = findSection(text, 'Skills') || 
                         findSection(text, 'Technical Skills') || 
                         findSection(text, 'Competencies');
    
    if (skillsSection) {
      return {
        text: skillsSection,
        confidence: 0.85
      };
    }
    
    // Try to extract skills from bullet points if no explicit section
    const skillBullets = text.match(/[•\-*]\s*([A-Za-z0-9,\s&+#]+)/g);
    if (skillBullets && skillBullets.length > 3) {
      return {
        text: skillBullets.join('\n'),
        confidence: 0.65
      };
    }
    
    return null;
  };
  
  const findEducation = (text: string) => {
    const educationSection = findSection(text, 'Education') || 
                            findSection(text, 'Academic Background');
    
    if (educationSection) {
      return {
        text: educationSection,
        confidence: 0.9
      };
    }
    
    // Look for degree patterns
    const degreePattern = /(Bachelor|Master|Ph\.D|MBA|B\.S|M\.S|B\.A|M\.A)/i;
    if (degreePattern.test(text)) {
      const paragraphs = text.split('\n\n');
      for (const paragraph of paragraphs) {
        if (degreePattern.test(paragraph)) {
          return {
            text: paragraph,
            confidence: 0.7
          };
        }
      }
    }
    
    return null;
  };
  
  const findExperience = (text: string) => {
    const experienceSection = findSection(text, 'Experience') || 
                             findSection(text, 'Work Experience') ||
                             findSection(text, 'Employment History');
    
    if (experienceSection) {
      return {
        text: experienceSection,
        confidence: 0.9
      };
    }
    
    // Look for date ranges which often indicate experience
    const dateRangePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4} - (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|\d{4} - \d{4}|\d{4} - Present\b/i;
    if (dateRangePattern.test(text)) {
      const paragraphs = text.split('\n\n');
      const experienceParagraphs = paragraphs.filter(p => dateRangePattern.test(p));
      if (experienceParagraphs.length > 0) {
        return {
          text: experienceParagraphs.join('\n\n'),
          confidence: 0.75
        };
      }
    }
    
    return null;
  };
  
  // Collect the extracted data
  const name = extractName(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  
  const skills = findSkills(text);
  const education = findEducation(text);
  const experience = findExperience(text);
  
  // Build confidence scores for all fields
  const confidence: Record<string, number> = {};
  
  if (name) confidence.name = 0.8;
  if (email) confidence.email = 0.95;
  if (phone) confidence.phone = 0.9;
  
  if (skills) confidence.skills = skills.confidence;
  if (education) confidence.education = education.confidence;
  if (experience) confidence.experience = experience.confidence;
  
  return {
    name,
    email,
    phone,
    skills: skills || null,
    education: education || null,
    experience: experience || null,
    confidence
  };
}
