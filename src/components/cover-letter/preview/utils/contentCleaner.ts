
import DOMPurify from "dompurify";

/**
 * Cleans up raw cover letter content to remove duplicate headers, email info, etc.
 * Also sanitizes content to prevent XSS attacks.
 */
export const cleanCoverLetterContent = (
  rawContent: string,
  company?: string,
  jobTitle?: string
): string => {
  // First sanitize the input to prevent XSS
  let cleaned = DOMPurify.sanitize(rawContent);
  
  // Remove any lines with "Dato:" or "Date:" which might be duplicated
  cleaned = cleaned.replace(/^(Dato|Date):.*$/gm, "");
  
  // Remove any lines with "Til:" or "To:" which might be duplicated
  cleaned = cleaned.replace(/^(Til|To):.*$/gm, "");
  
  // Remove any lines with "Emne:" or "Subject:" which might be duplicated
  cleaned = cleaned.replace(/^(Emne|Subject):.*$/gm, "");
  
  // Remove duplicate company name lines at the beginning
  const sanitizedCompany = company ? DOMPurify.sanitize(company) : "";
  const companyRegex = sanitizedCompany ? new RegExp(`^${escapeRegExp(sanitizedCompany)}$`, 'gm') : null;
  if (companyRegex) {
    cleaned = cleaned.replace(companyRegex, "");
  }
  
  // Remove duplicate job title references
  const sanitizedJobTitle = jobTitle ? DOMPurify.sanitize(jobTitle) : "";
  const jobTitleRegex = sanitizedJobTitle ? new RegExp(`^.*${escapeRegExp(sanitizedJobTitle)}.*$`, 'gm') : null;
  if (jobTitleRegex) {
    // Count occurrences
    const matches = cleaned.match(jobTitleRegex);
    if (matches && matches.length > 1) {
      // Keep only the first occurrence and replace others
      const firstOccurrence = matches[0];
      for (let i = 1; i < matches.length; i++) {
        cleaned = cleaned.replace(matches[i], "");
      }
    }
  }
  
  // Remove duplicate greeting lines
  cleaned = cleaned.replace(/(Kære|Dear).*\n+\1/g, "$1");
  
  // Normalize multiple empty lines to max 2
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  
  // Trim leading/trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
};

/**
 * Helper function to escape special characters in a string for use in a RegExp
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
