
interface TextDocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate?: string;
}

export const createTextDocument = (options: TextDocumentOptions): string => {
  const { content } = options;
  return content;
};
