
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
  // Check file size (max 2MB instead of 10MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `PDF-filen er for stor (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal størrelse er 2MB.`
    };
  }

  // Check if the file is a PDF
  if (file.type !== 'application/pdf') {
    return {
      isValid: false,
      error: "Venligst upload en PDF-fil. Andre filformater understøttes ikke."
    };
  }

  return { isValid: true };
};
