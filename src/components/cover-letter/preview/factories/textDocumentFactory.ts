
export interface TextDocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate: string;
}

/**
 * Creates formatted text content for a cover letter
 */
export const createTextDocument = ({
  content,
  company = "Virksomhed",
  jobTitle = "stillingen",
  formattedDate
}: TextDocumentOptions): string => {
  // Create a cleaner header with single line spacing
  const letterHeader = `${company}\nAtt.: Ansøgning til ${jobTitle}\n\n${formattedDate}\n\n`;
  
  // Process content to ensure consistent single line breaks between paragraphs
  const processedContent = content
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ consecutive line breaks with 2
    .replace(/\s+\n/g, '\n') // Remove whitespace before line breaks
    .trim();
  
  return letterHeader + processedContent;
};

/**
 * Generate a text file filename based on company and job title
 */
export const generateTextFilename = (company: string = "Virksomhed", jobTitle: string = "Stilling"): string => {
  return `Ansøgning - ${company} - ${jobTitle}.txt`;
};
