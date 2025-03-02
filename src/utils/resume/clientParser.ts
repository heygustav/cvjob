
import * as mammoth from 'mammoth';
import { ParsedResumeData, ProcessResult } from './types';

// Function to parse a PDF file using client-side logic
export const processPdfFile = async (file: File): Promise<ProcessResult> => {
  try {
    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    let extractedText = '';
    
    // Handle different file types
    if (file.type === 'application/pdf') {
      // For PDF, we currently have limited support
      // In the future, we could add pdf.js or similar
      return {
        success: false, 
        error: 'PDF-analyse er midlertidigt begrænset. Vi arbejder på at forbedre denne funktion. Venligst udfyld oplysningerne manuelt.'
      };
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Process DOCX files using mammoth
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
        console.log("Extracted text from DOCX:", extractedText.substring(0, 200) + "...");
      } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        return {
          success: false,
          error: 'Kunne ikke læse DOCX-filen. Kontrollér filen eller udfyld oplysningerne manuelt.'
        };
      }
    } else {
      return {
        success: false,
        error: 'Ukendt filformat. Venligst upload en PDF eller DOCX fil.'
      };
    }
    
    // Parse the extracted text to get structured data
    const extractedData = parseResumeText(extractedText);
    
    if (Object.keys(extractedData).length === 0) {
      return {
        success: false,
        error: 'Kunne ikke finde relevante oplysninger i dokumentet. Venligst udfyld oplysningerne manuelt.'
      };
    }
    
    // Return the extracted data
    return {
      success: true,
      data: {
        validatedData: extractedData,
        extractedFields: Object.keys(extractedData),
        confidence: calculateConfidence(extractedData, extractedText)
      }
    };
  } catch (error: any) {
    console.error('Error processing resume:', error);
    return {
      success: false,
      error: error.message || 'Der opstod en fejl under behandling af filen'
    };
  }
};

// Function to parse text and extract structured information
function parseResumeText(text: string): Partial<ParsedResumeData> {
  const extractedData: Partial<ParsedResumeData> = {};
  
  // Extract name (assuming it's in the first few lines)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length > 0) {
    // Simple heuristic: first line is usually the name if it's not an email or phone
    const possibleName = lines[0];
    if (!possibleName.includes('@') && !possibleName.match(/\d{3,}/)) {
      extractedData.name = possibleName;
    }
  }
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = text.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    extractedData.email = emailMatches[0];
  }
  
  // Extract phone number (various formats)
  const phoneRegex = /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    extractedData.phone = phoneMatches[0];
  }
  
  // Extract address (simple approach)
  const addressRegex = /\b\d+\s+[\w\s]+,\s+[\w\s]+,\s+[A-Z]{2}\s+\d{5}\b/;
  const addressMatch = text.match(addressRegex);
  if (addressMatch) {
    extractedData.address = addressMatch[0];
  }
  
  // Extract education (simplified approach)
  const educationSection = extractSection(text, ['education', 'uddannelse']);
  if (educationSection) {
    extractedData.education = educationSection;
  }
  
  // Extract experience (simplified approach)
  const experienceSection = extractSection(text, ['experience', 'work experience', 'erfaring', 'arbejdserfaring']);
  if (experienceSection) {
    extractedData.experience = experienceSection;
  }
  
  // Extract skills
  const skillsSection = extractSection(text, ['skills', 'kompetencer', 'færdigheder']);
  if (skillsSection) {
    extractedData.skills = skillsSection;
  }
  
  return extractedData;
}

// Helper function to extract sections from text
function extractSection(text: string, sectionNames: string[]): string | undefined {
  const lowercaseText = text.toLowerCase();
  
  for (const sectionName of sectionNames) {
    const sectionIndex = lowercaseText.indexOf(sectionName);
    if (sectionIndex !== -1) {
      // Find the next section heading or end of text
      let nextSectionIndex = text.length;
      
      // List of common section headings to detect the end of current section
      const commonHeadings = ['education', 'experience', 'skills', 'projects', 'certifications', 
                             'references', 'languages', 'interests', 'uddannelse', 'erfaring', 
                             'kompetencer', 'projekter', 'certificeringer', 'referencer', 
                             'sprog', 'interesser'];
      
      for (const heading of commonHeadings) {
        if (heading === sectionName.toLowerCase()) continue; // Skip the current section name
        
        const headingIndex = lowercaseText.indexOf(heading, sectionIndex + sectionName.length);
        if (headingIndex !== -1 && headingIndex < nextSectionIndex) {
          nextSectionIndex = headingIndex;
        }
      }
      
      // Extract the section content
      const sectionContent = text.substring(sectionIndex, nextSectionIndex).trim();
      
      // Remove the section heading itself
      const lines = sectionContent.split('\n');
      return lines.slice(1).join('\n').trim();
    }
  }
  
  return undefined;
}

// Calculate confidence scores for each extracted field
function calculateConfidence(data: Partial<ParsedResumeData>, fullText: string): Record<string, number> {
  const confidence: Record<string, number> = {};
  
  // Simplified confidence calculation
  for (const field in data) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      const value = (data as any)[field];
      
      // Skip null or undefined values
      if (value === null || value === undefined) continue;
      
      // Calculate confidence based on field type and content
      switch (field) {
        case 'email':
          // Email confidence is high if it matches a standard format
          confidence[field] = value.includes('@') && value.includes('.') ? 0.9 : 0.5;
          break;
        case 'phone':
          // Phone confidence is high if it has enough digits
          confidence[field] = String(value).replace(/\D/g, '').length >= 10 ? 0.8 : 0.4;
          break;
        case 'name':
          // Name confidence is medium-high if it's 2+ words
          confidence[field] = String(value).split(/\s+/).length >= 2 ? 0.7 : 0.5;
          break;
        case 'address':
          // Address confidence is medium
          confidence[field] = 0.6;
          break;
        case 'skills':
        case 'education':
        case 'experience':
          // Text field confidence based on content length
          const content = String(value);
          confidence[field] = content.length > 50 ? 0.7 : 
                             content.length > 20 ? 0.5 : 0.3;
          break;
        default:
          confidence[field] = 0.5; // Default medium confidence
      }
    }
  }
  
  return confidence;
}
