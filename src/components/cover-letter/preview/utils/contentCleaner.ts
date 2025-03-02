/**
 * Cleans up raw cover letter content to remove duplicate headers, email info, etc.
 */
export const cleanCoverLetterContent = (
  rawContent: string,
  company?: string,
  jobTitle?: string
): string => {
  // Remove any lines with "Dato:" or "Date:" which might be duplicated
  let cleaned = rawContent.replace(/^(Dato|Date):.*$/gm, "");
  
  // Remove any lines with "Til:" or "To:" which might be duplicated
  cleaned = cleaned.replace(/^(Til|To):.*$/gm, "");
  
  // Remove any lines with "Emne:" or "Subject:" which might be duplicated
  cleaned = cleaned.replace(/^(Emne|Subject):.*$/gm, "");
  
  // Remove duplicate company name lines at the beginning
  const companyRegex = company ? new RegExp(`^${company}$`, 'gm') : null;
  if (companyRegex) {
    cleaned = cleaned.replace(companyRegex, "");
  }
  
  // Remove duplicate job title references
  const jobTitleRegex = jobTitle ? new RegExp(`^.*${jobTitle}.*$`, 'gm') : null;
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
