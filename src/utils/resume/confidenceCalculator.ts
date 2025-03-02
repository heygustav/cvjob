
import { PersonalInfoFormState } from '@/pages/Profile';

/**
 * Calculate confidence scores for each extracted field
 * @param data Extracted data from resume
 * @param fullText The complete text extracted from the document
 * @returns Record of field names and their confidence scores (0-1)
 */
export function calculateConfidence(data: Partial<PersonalInfoFormState>, fullText: string): Record<string, number> {
  const confidence: Record<string, number> = {};
  
  // Calculate confidence for each field
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
