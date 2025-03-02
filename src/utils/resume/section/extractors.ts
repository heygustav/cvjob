
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
    const sectionIndex = lowercaseText.indexOf(sectionName.toLowerCase());
    if (sectionIndex !== -1) {
      // Find the next section heading or end of text
      let nextSectionIndex = text.length;
      
      // List of common section headings to detect the end of current section
      const commonHeadings = [
        'uddannelse', 'education', 'erfaring', 'experience', 'kompetencer', 'skills', 
        'projekter', 'projects', 'certificeringer', 'certifications', 'referencer', 
        'references', 'sprog', 'languages', 'interesser', 'interests', 'profil', 
        'profile', 'kontakt', 'contact', 'personlig', 'personal', 'øvrig', 'other',
        'kvalifikationer', 'qualifications', 'kurser', 'courses'
      ];
      
      for (const heading of commonHeadings) {
        if (heading === sectionName.toLowerCase()) continue; // Skip the current section name
        
        // Look for the next heading after the current section starts
        const headingPattern = new RegExp(`\\b${heading}\\b`, 'i');
        const matches = [...lowercaseText.matchAll(new RegExp(headingPattern, 'g'))];
        
        for (const match of matches) {
          const headingIndex = match.index;
          if (headingIndex !== undefined && headingIndex > sectionIndex + sectionName.length && headingIndex < nextSectionIndex) {
            nextSectionIndex = headingIndex;
          }
        }
      }
      
      // Extract the section content
      const sectionContent = text.substring(sectionIndex, nextSectionIndex).trim();
      
      // Remove the section heading itself (improved to handle headings with different formats)
      const headingEndPos = sectionIndex + sectionName.length;
      const contentStartPos = text.indexOf('\n', headingEndPos) !== -1 
        ? text.indexOf('\n', headingEndPos) 
        : text.indexOf('. ', headingEndPos) + 2;
      
      return contentStartPos > headingEndPos 
        ? text.substring(contentStartPos, nextSectionIndex).trim()
        : sectionContent.substring(sectionName.length).trim();
    }
  }
  
  return undefined;
}
