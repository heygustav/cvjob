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

/**
 * Extract name from resume text using various heuristics
 * @param text The resume text
 * @returns The extracted name or undefined
 */
function extractName(text: string): string | undefined {
  // Check for name in a "name" or "navn" section
  const nameSection = extractSection(text, ['name:', 'navn:', 'name', 'navn']);
  if (nameSection && nameSection.length < 50) {
    return nameSection.split('\n')[0].trim();
  }
  
  // Try to extract from the first few lines (common in resumes)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Check the first 3 lines for a possible name
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    // Name is typically short, doesn't contain common symbols, and isn't all uppercase
    if (line.length > 0 && line.length < 40 && 
        !line.includes('@') && !line.includes(':') && 
        !line.match(/^\d+/) && line !== line.toUpperCase() &&
        !line.match(/uddannelse|education|erfaring|experience|kompetencer|skills/i)) {
      return line;
    }
  }
  
  return undefined;
}

/**
 * Extract contact information including email, phone, etc.
 * @param text The resume text
 * @returns Object with extracted contact information
 */
function extractContactInfo(text: string): { email?: string, phone?: string, address?: string } {
  const result: { email?: string, phone?: string, address?: string } = {};
  
  // Extract contact section if available
  const contactSection = extractSection(text, ['contact', 'kontakt', 'kontaktinformation', 'contact information']) || text;
  
  // Extract email - handle multiple formats
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = contactSection.match(emailRegex) || text.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    result.email = emailMatches[0];
  }
  
  // Extract phone number - updated to handle up to 10 digits with improved patterns
  const phoneRegexes = [
    /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // International format with 10 digits
    /\b(\+\d{1,3}[-.\s]?)?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}\b/g, // Danish format
    /\b\d{8,10}\b/g, // Simple 8-10 digit numbers
    /\b\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2,4}\b/g, // Danish with separators and up to 10 digits
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{2,4}\b/g, // Another common format with up to 10 digits
    /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2,3}\b/g // Format with up to 10 digits with separators
  ];
  
  for (const regex of phoneRegexes) {
    const phoneMatches = contactSection.match(regex) || text.match(regex);
    if (phoneMatches && phoneMatches.length > 0) {
      // Take the first match and ensure it has up to 10 digits
      let phoneNumber = phoneMatches[0];
      
      // Clean up the phone number to get just the digits
      const digits = phoneNumber.replace(/\D/g, '');
      
      // If it has more than 10 digits, it might include a country code
      // In that case, take the last 10 digits for the local number
      if (digits.length > 10) {
        // Keep the "+" and country code if present, then append up to 10 digits
        const hasPlus = phoneNumber.includes('+');
        phoneNumber = hasPlus ? 
          '+' + digits.substring(0, digits.length - 10) + ' ' + digits.slice(-10) :
          digits.slice(-10);
      }
      
      result.phone = phoneNumber;
      break;
    }
  }
  
  // Extract address - look for patterns in Danish and English addresses
  const addressRegexes = [
    /\b\d+\s+[\w\s]+,\s+[\w\s]+,\s+[A-Z]{2}\s+\d{5}\b/, // US format
    /\b[\w\s]+\s+\d+,\s*\d{4}\s+[\w\s]+\b/, // Danish format (Street Num, Postal City)
    /\b[\w\s]+\s+\d+,\s*\d{1,2}\.(\s*[a-zA-Z]{2}\.)?,\s*\d{4}\s+[\w\s]+\b/ // Danish with floor
  ];
  
  for (const regex of addressRegexes) {
    const addressMatch = contactSection.match(regex) || text.match(regex);
    if (addressMatch) {
      result.address = addressMatch[0];
      break;
    }
  }
  
  return result;
}

/**
 * Parse resume text to extract structured information
 * @param text The full text of the resume
 * @returns Structured data extracted from the resume
 */
export function parseResumeText(text: string): Partial<PersonalInfoFormState> {
  const extractedData: Partial<PersonalInfoFormState> = {};
  
  console.log("Full resume text for parsing:", text.substring(0, 300) + "...");
  
  // Extract name
  extractedData.name = extractName(text);
  console.log("Extracted name:", extractedData.name);
  
  // Extract contact information
  const contactInfo = extractContactInfo(text);
  Object.assign(extractedData, contactInfo);
  console.log("Extracted contact info:", contactInfo);
  
  // Extract education (improved with multilingual support)
  const educationSection = extractSection(text, ['education', 'uddannelse', 'uddannelser', 'education history', 'academic background']);
  if (educationSection) {
    extractedData.education = educationSection;
    console.log("Extracted education section of length:", educationSection.length);
  }
  
  // Extract experience (improved with multilingual support)
  const experienceSection = extractSection(text, [
    'experience', 'work experience', 'employment', 'professional experience',
    'erfaring', 'arbejdserfaring', 'erhvervserfaring', 'ansættelser', 'professionel erfaring'
  ]);
  if (experienceSection) {
    extractedData.experience = experienceSection;
    console.log("Extracted experience section of length:", experienceSection.length);
  }
  
  // Extract skills (improved with multilingual support)
  const skillsSection = extractSection(text, [
    'skills', 'kompetencer', 'færdigheder', 'qualifications', 'kvalifikationer',
    'technical skills', 'tekniske kompetencer', 'core competencies', 'kernekompetencer'
  ]);
  if (skillsSection) {
    extractedData.skills = skillsSection;
    console.log("Extracted skills section of length:", skillsSection.length);
  }
  
  // Log what we found
  console.log("Total fields extracted:", Object.keys(extractedData).length);
  console.log("Extracted fields:", Object.keys(extractedData).join(", "));
  
  return extractedData;
}
