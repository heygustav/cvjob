
import { PersonalInfoFormState } from '@/pages/Profile';

/**
 * Validates and sanitizes raw data extracted from a resume
 */
export const validateExtractedData = (data: any): Partial<PersonalInfoFormState> => {
  const validated: Partial<PersonalInfoFormState> = {};
  
  // Check if data has the expected structure
  if (!data || typeof data !== 'object') {
    console.error("Invalid data structure:", data);
    return {};
  }
  
  // Validate sections
  if (isValidTextSection(data.skills)) {
    validated.skills = data.skills;
  }
  
  if (isValidTextSection(data.education)) {
    validated.education = data.education;
  }
  
  if (isValidTextSection(data.experience)) {
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
function isValidTextSection(text: any): boolean {
  return text && 
    typeof text === 'string' && 
    text.trim().length > 10 && 
    !text.includes("Kunne ikke identificere");
}
