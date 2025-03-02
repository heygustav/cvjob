
/**
 * Validate and clean education section
 * @param text The extracted education text
 * @returns Validated education text
 */
export function validateEducation(text: string): string {
  if (!text) return '';
  
  // Check if text is too large or likely contains other sections
  if (text.length > 1500) {
    // Try to find common patterns that indicate education entries
    const educationPatterns = [
      /\b(20\d{2}|19\d{2})\s*-\s*(20\d{2}|19\d{2}|\bnu\b|\bpresent\b)/gi, // Year ranges
      /\b(bachelor|master|kandidat|phd|ph\.d\.|diplomuddannelse|akademiuddannelse|erhvervsuddannelse)\b/gi, // Degree types
      /\b(universitet|university|uddannelse|skole|school|college|academy|akademi|institut)\b/gi, // Educational institutions
    ];
    
    // Try to extract only the relevant parts using the patterns
    let cleanedText = '';
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      
      for (const pattern of educationPatterns) {
        if (pattern.test(line)) {
          cleanedText += line + '\n';
          break;
        }
      }
    }
    
    // If we found education-related content, use it; otherwise, truncate the original
    return cleanedText.length > 0 ? cleanedText.trim() : text.substring(0, 1000) + '...';
  }
  
  return text;
}

/**
 * Validate and clean experience section
 * @param text The extracted experience text
 * @returns Validated experience text
 */
export function validateExperience(text: string): string {
  if (!text) return '';
  
  // Check if text is too large or likely contains other sections
  if (text.length > 1500) {
    // Try to find common patterns that indicate experience entries
    const experiencePatterns = [
      /\b(20\d{2}|19\d{2})\s*-\s*(20\d{2}|19\d{2}|\bnu\b|\bpresent\b)/gi, // Year ranges
      /\b(stilling|position|title|ansvarlig|specialist|manager|director|chef|konsulent|consultant|medarbejder)\b/gi, // Position titles
      /\b(virksomhed|company|firma|organisation|organization|arbejdsgiver|employer)\b/gi, // Organizations
    ];
    
    // Try to extract only the relevant parts using the patterns
    let cleanedText = '';
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      
      for (const pattern of experiencePatterns) {
        if (pattern.test(line)) {
          cleanedText += line + '\n';
          break;
        }
      }
    }
    
    // If we found experience-related content, use it; otherwise, truncate the original
    return cleanedText.length > 0 ? cleanedText.trim() : text.substring(0, 1000) + '...';
  }
  
  return text;
}

/**
 * Validate and clean skills section
 * @param text The extracted skills text
 * @returns Validated skills text
 */
export function validateSkills(text: string): string {
  if (!text) return '';
  
  // Check if text is too large or likely contains other sections
  if (text.length > 1000) {
    // Try to find common patterns that indicate skill listings
    const skillIndicators = [
      /\b(programmering|programming|udvikling|development|design|analyse|analysis)\b/gi,
      /\b(tekniske|technical|personlige|personal|faglige|professional)\b/gi,
      /\b(værktøjer|tools|software|hardware|teknologier|technologies)\b/gi,
    ];
    
    // Try to extract only lines that are likely skills
    let cleanedText = '';
    const lines = text.split('\n');
    
    // Look for bullet points, commas, and other list indicators
    const listPatterns = [
      /^[•●■○◦-]\s*.+/, // Bullet points
      /^\s*[\w\s-]+(,\s*[\w\s-]+)+$/, // Comma-separated lists
      /^\s*[A-Za-z-]+(\s+[A-Za-z-]+){0,3}\s*$/ // Short skill terms
    ];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) continue;
      
      // Check if the line matches skill indicators or list patterns
      let isSkill = false;
      
      for (const pattern of skillIndicators) {
        if (pattern.test(trimmedLine)) {
          isSkill = true;
          break;
        }
      }
      
      if (!isSkill) {
        for (const pattern of listPatterns) {
          if (pattern.test(trimmedLine)) {
            isSkill = true;
            break;
          }
        }
      }
      
      if (isSkill) {
        cleanedText += trimmedLine + '\n';
      }
    }
    
    // If we found skill-related content, use it; otherwise, truncate the original
    return cleanedText.length > 0 ? cleanedText.trim() : text.substring(0, 500) + '...';
  }
  
  return text;
}
