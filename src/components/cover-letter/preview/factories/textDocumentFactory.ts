
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
  const letterHeader = `${company}\nAtt.: Ansøgning til ${jobTitle}\n\n${formattedDate}\n\n`;
  return letterHeader + content;
};

/**
 * Generate a text file filename based on company and job title
 */
export const generateTextFilename = (company: string = "Virksomhed", jobTitle: string = "Stilling"): string => {
  return `Ansøgning - ${company} - ${jobTitle}.txt`;
};
