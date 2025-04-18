
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
  // Check if file is undefined or null
  if (!file) {
    return {
      isValid: false,
      error: "Ingen fil blev valgt."
    };
  }
  
  // Check file size (max 2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Filen er for stor (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal størrelse er 2MB.`
    };
  }

  // Check if the file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: "Filen er tom."
    };
  }

  // Check if the file is a PDF or DOCX
  const fileName = file.name.toLowerCase();
  const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
  const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                fileName.endsWith('.docx');
  
  if (!isPdf && !isDocx) {
    return {
      isValid: false,
      error: "Venligst upload en PDF eller DOCX fil. Andre filformater understøttes ikke."
    };
  }

  // Safety check for file name length to avoid path traversal issues
  if (file.name.length > 255) {
    return {
      isValid: false,
      error: "Filnavnet er for langt. Maksimalt 255 tegn er tilladt."
    };
  }

  // Check for suspicious file extensions that might be renamed
  if (fileName.includes('.exe.') || fileName.includes('.js.') || 
      fileName.includes('.php.') || fileName.includes('.html.')) {
    return {
      isValid: false,
      error: "Filtypen er ikke understøttet."
    };
  }

  return { isValid: true };
};
