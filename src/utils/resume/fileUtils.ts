
/**
 * Converts a file to base64 string representation
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validates that a file meets the requirements for processing
 */
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      error: "PDF-filen må maksimalt være 10MB"
    };
  }

  // Check if the file is a PDF
  if (file.type !== 'application/pdf') {
    return {
      isValid: false,
      error: "Venligst upload en PDF-fil"
    };
  }

  return { isValid: true };
};
