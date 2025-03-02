import { extractSection } from '../section/extractors';

/**
 * Extract contact information including email, phone, etc.
 * @param text The resume text
 * @returns Object with extracted contact information
 */
export function extractContactInfo(text: string): { email?: string, phone?: string, address?: string } {
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
