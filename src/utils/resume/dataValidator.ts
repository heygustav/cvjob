
import { PersonalInfoFormState } from '@/pages/Profile';
import { ParsedSection, RawResumeData } from './types';

/**
 * Validates and sanitizes raw data extracted from a resume
 */
export const validateExtractedData = (data: RawResumeData): Partial<PersonalInfoFormState> => {
  const validated: Partial<PersonalInfoFormState> = {};
  
  // Check if data has the expected structure
  if (!data || typeof data !== 'object') {
    console.error("Invalid data structure:", data);
    return {};
  }
  
  // Process skills sections
  if (data.skills && Array.isArray(data.skills)) {
    // Join skills sections with high confidence
    const highConfidenceSkills = data.skills
      .filter(section => section.confidence > 0.7)
      .map(section => section.text);
    
    if (highConfidenceSkills.length > 0) {
      validated.skills = highConfidenceSkills.join('\n\n');
    }
  } else if (isValidTextSection(data.skills)) {
    validated.skills = data.skills;
  }
  
  // Process education sections
  if (data.education && Array.isArray(data.education)) {
    // Join education sections with high confidence
    const highConfidenceEducation = data.education
      .filter(section => section.confidence > 0.7)
      .map(section => section.text);
    
    if (highConfidenceEducation.length > 0) {
      validated.education = highConfidenceEducation.join('\n\n');
    }
  } else if (isValidTextSection(data.education)) {
    validated.education = data.education;
  }
  
  // Process experience sections
  if (data.experience && Array.isArray(data.experience)) {
    // Join experience sections with high confidence
    const highConfidenceExperience = data.experience
      .filter(section => section.confidence > 0.7)
      .map(section => section.text);
    
    if (highConfidenceExperience.length > 0) {
      validated.experience = highConfidenceExperience.join('\n\n');
    }
  } else if (isValidTextSection(data.experience)) {
    validated.experience = data.experience;
  }
  
  // For email, we'll do a basic validation
  if (data.email && 
      typeof data.email === 'string' && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    validated.email = data.email;
  }
  
  // For phone, validate and standardize format
  if (data.phone && 
      typeof data.phone === 'string' && 
      data.phone.trim().length >= 8) {
    // Basic phone validation - just make sure it has at least 8 digits
    const digitsOnly = data.phone.replace(/\D/g, '');
    if (digitsOnly.length >= 8) {
      validated.phone = data.phone;
    }
  }
  
  // For name, validate it's not just a few characters
  if (data.name && 
      typeof data.name === 'string' && 
      data.name.trim().length > 3) {
    validated.name = data.name;
  }
  
  // For address, just check it's not empty
  if (data.address && 
      typeof data.address === 'string' && 
      data.address.trim().length > 5) {
    validated.address = data.address;
  }
  
  // Log what fields were extracted
  console.log("Validated fields:", Object.keys(validated));
  
  return validated;
};

/**
 * Helper function to check if a text section is valid
 */
function isValidTextSection(text: any): text is string {
  return text && 
    typeof text === 'string' && 
    text.trim().length > 10 && 
    !text.includes("Kunne ikke identificere");
}
