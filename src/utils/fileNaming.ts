
/**
 * Utilities for standardizing file naming across the application
 */

/**
 * Sanitizes text for use in filenames
 * - Replaces spaces with underscores
 * - Removes special characters
 * - Limits length if needed
 */
export const sanitizeForFilename = (text: string = '', maxLength: number = 30): string => {
  if (!text) return '';
  
  // Remove special characters that might cause issues in filenames
  let sanitized = text
    .replace(/[&%$#@!*()\[\]{}<>:;'"\\|,/+^~=]/g, '')  // Remove special chars
    .replace(/\s+/g, '_')  // Replace spaces with underscores
    .replace(/__+/g, '_')  // Replace multiple underscores with single one
    .trim();
    
  // Truncate if needed
  if (maxLength > 0 && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
    // Ensure we don't cut in the middle of a word if possible
    if (sanitized.includes('_')) {
      sanitized = sanitized.substring(0, sanitized.lastIndexOf('_'));
    }
  }
  
  return sanitized;
};

/**
 * Generates a standardized filename for cover letters
 * Format: Full_Name_Job_Title_Company_Name_Cover_Letter.extension
 */
export const generateCoverLetterFilename = (
  extension: string = 'pdf',
  options: {
    fullName?: string;
    jobTitle?: string;
    companyName?: string;
    maxLength?: number;
  } = {}
): string => {
  const { 
    fullName, 
    jobTitle, 
    companyName, 
    maxLength = 50 
  } = options;
  
  // Array to build filename parts
  const parts: string[] = [];
  
  // Add parts if they exist
  if (fullName) {
    parts.push(sanitizeForFilename(fullName, 20));
  }
  
  if (jobTitle) {
    parts.push(sanitizeForFilename(jobTitle, 20));
  }
  
  if (companyName) {
    parts.push(sanitizeForFilename(companyName, 20));
  }
  
  // Always add "Cover_Letter" at the end
  parts.push('Cover_Letter');
  
  // Join parts and ensure we're not exceeding max length
  let filename = parts.join('_');
  
  if (filename.length > maxLength) {
    // If too long, prioritize name and suffix over job details
    const namePart = fullName ? sanitizeForFilename(fullName, 15) + '_' : '';
    const suffix = '_Cover_Letter';
    const remainingSpace = maxLength - namePart.length - suffix.length;
    
    if (remainingSpace > 5) {
      // We have space for some job details
      const jobPart = jobTitle ? sanitizeForFilename(jobTitle, Math.floor(remainingSpace / 2)) : '';
      const companyPart = companyName 
        ? '_' + sanitizeForFilename(companyName, remainingSpace - jobPart.length - 1)
        : '';
      
      filename = namePart + jobPart + companyPart + suffix;
    } else {
      // Not enough space, just use name and suffix
      filename = namePart.substring(0, maxLength - suffix.length) + suffix;
    }
  }
  
  return `${filename}.${extension}`;
};
