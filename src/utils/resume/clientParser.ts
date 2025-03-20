
import { Resume } from '@/types/resume';
import { ProcessResult, ParsedResumeData, RawResumeData } from './types';
import DOMPurify from 'dompurify';

/**
 * Client-side parsing and processing of resume data
 * Follows ATS-friendly formatting guidelines
 */
export const processResumeData = (data: RawResumeData): ProcessResult => {
  try {
    // Extract validated data
    const extractedFields: string[] = [];
    const validatedData: Partial<Resume> = {};
    const confidence: Record<string, number> = {};
    
    // Process essential fields with proper sanitization
    if (data.name) {
      validatedData.name = DOMPurify.sanitize(data.name);
      extractedFields.push('name');
      confidence['name'] = 1.0;
    }
    
    if (data.email) {
      validatedData.email = DOMPurify.sanitize(data.email);
      extractedFields.push('email');
      confidence['email'] = 1.0;
    }
    
    if (data.phone) {
      validatedData.phone = DOMPurify.sanitize(data.phone);
      extractedFields.push('phone');
      confidence['phone'] = 0.95;
    }
    
    if (data.address) {
      validatedData.address = DOMPurify.sanitize(data.address);
      extractedFields.push('address');
      confidence['address'] = 0.90;
    }
    
    // Process sections in ATS-friendly format (simple text without complex formatting)
    if (data.skills) {
      // Convert array of sections to formatted text
      if (Array.isArray(data.skills)) {
        validatedData.skills = formatSectionContent(data.skills);
        confidence['skills'] = calculateSectionConfidence(data.skills);
      } else {
        validatedData.skills = DOMPurify.sanitize(data.skills);
        confidence['skills'] = 0.85;
      }
      extractedFields.push('skills');
    }
    
    if (data.education) {
      if (Array.isArray(data.education)) {
        validatedData.education = formatSectionContent(data.education);
        confidence['education'] = calculateSectionConfidence(data.education);
      } else {
        validatedData.education = DOMPurify.sanitize(data.education);
        confidence['education'] = 0.85;
      }
      extractedFields.push('education');
    }
    
    if (data.experience) {
      if (Array.isArray(data.experience)) {
        validatedData.experience = formatSectionContent(data.experience);
        confidence['experience'] = calculateSectionConfidence(data.experience);
      } else {
        validatedData.experience = DOMPurify.sanitize(data.experience);
        confidence['experience'] = 0.85;
      }
      extractedFields.push('experience');
    }
    
    // Process summary for professional resume section
    if (data.summary) {
      validatedData.summary = DOMPurify.sanitize(data.summary);
      extractedFields.push('summary');
      confidence['summary'] = 0.85;
    }
    
    // Process photo if available
    if (data.photo) {
      validatedData.photo = data.photo;
      extractedFields.push('photo');
    }
    
    // Process languages in ATS-friendly format
    if (data.languages && Array.isArray(data.languages)) {
      validatedData.languages = data.languages;
      extractedFields.push('languages');
      confidence['languages'] = 0.85;
    }
    
    return {
      success: true,
      data: {
        validatedData,
        extractedFields,
        confidence
      }
    };
  } catch (error) {
    console.error('Error processing resume data:', error);
    return {
      success: false,
      error: 'Kunne ikke behandle CV-data. Prøv igen eller kontakt support.'
    };
  }
};

/**
 * Format section content according to ATS guidelines
 * - Use simple bullet points
 * - Maintain consistent line spacing
 * - Focus on content readability
 */
const formatSectionContent = (sections: { text: string; confidence: number }[]): string => {
  return sections
    .map(section => {
      // Sanitize and clean up the text
      const sanitizedText = DOMPurify.sanitize(section.text);
      
      // Format as bullet points if not already formatted
      if (!sanitizedText.trim().startsWith('-') && !sanitizedText.trim().startsWith('•')) {
        return `- ${sanitizedText}`;
      }
      
      return sanitizedText;
    })
    .join('\n\n');
};

/**
 * Calculate average confidence for a section
 */
const calculateSectionConfidence = (sections: { text: string; confidence: number }[]): number => {
  if (!sections.length) return 0;
  
  const total = sections.reduce((sum, section) => sum + section.confidence, 0);
  return total / sections.length;
};

/**
 * Convert summary sections to a concise professional summary
 * - Limit to 3-4 sentences
 * - Focus on key skills and experience
 */
export const formatProfessionalSummary = (summary: string): string => {
  if (!summary) return '';
  
  // Sanitize input
  const sanitizedSummary = DOMPurify.sanitize(summary);
  
  // Split into sentences
  const sentences = sanitizedSummary.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Limit to 3-4 sentences
  const limitedSentences = sentences.slice(0, 4);
  
  // Join back with proper punctuation
  return limitedSentences.map(s => `${s.trim()}.`).join(' ');
};
