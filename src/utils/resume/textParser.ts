
import { PersonalInfoFormState } from '@/pages/Profile';

/**
 * Extract a section from the resume text
 * @param text The full text of the resume
 * @param sectionNames Possible names for the section (for multilingual support)
 * @returns The extracted section content or undefined if not found
 */
export function extractSection(text: string, sectionNames: string[]): string | undefined {
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

/**
 * Parse resume text to extract structured information
 * @param text The full text of the resume
 * @returns Structured data extracted from the resume
 */
export function parseResumeText(text: string): Partial<PersonalInfoFormState> {
  const extractedData: Partial<PersonalInfoFormState> = {};
  
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
