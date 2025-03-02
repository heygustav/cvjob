
/**
 * Calculate confidence scores for each extracted field
 * @param extractedData The extracted data from the resume
 * @param originalText The original resume text
 * @returns Object with confidence scores for each field (0-1)
 */
export function calculateConfidence(
  extractedData: Record<string, any>,
  originalText: string
): Record<string, number> {
  const confidence: Record<string, number> = {};
  const text = originalText.toLowerCase();
  
  // Calculate confidence for each field based on heuristics
  for (const [key, value] of Object.entries(extractedData)) {
    if (!value) continue;
    
    switch (key) {
      case 'email':
        // Email confidence is high if it matches standard email pattern
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        confidence.email = emailRegex.test(value as string) ? 0.9 : 0.5;
        break;
        
      case 'phone':
        // Phone confidence based on digit ratio and common formats
        const digits = (value as string).replace(/\D/g, '');
        const hasCountryCode = (value as string).includes('+');
        confidence.phone = (digits.length >= 8 && digits.length <= 15) ? 
          (hasCountryCode ? 0.9 : 0.8) : 0.5;
        break;
        
      case 'name':
        // Name confidence based on position in text and format
        const nameStr = value as string;
        const nameWords = nameStr.split(/\s+/).length;
        const isFirstTwoLines = originalText.split('\n').slice(0, 2).join(' ').includes(nameStr);
        const hasDigits = /\d/.test(nameStr);
        
        if (isFirstTwoLines && nameWords >= 2 && !hasDigits) {
          confidence.name = 0.85;
        } else if (nameWords >= 2 && !hasDigits) {
          confidence.name = 0.7;
        } else {
          confidence.name = 0.5;
        }
        break;
        
      case 'address':
        // Address confidence based on format and content
        const addressStr = value as string;
        const hasNumber = /\d/.test(addressStr);
        const hasPostalCode = /\b\d{4,5}\b/.test(addressStr);
        
        if (hasNumber && hasPostalCode) {
          confidence.address = 0.8;
        } else if (hasNumber) {
          confidence.address = 0.6;
        } else {
          confidence.address = 0.4;
        }
        break;
        
      case 'education':
        // Education confidence based on section length and keywords
        const educationStr = value as string;
        const eduKeywords = ['university', 'college', 'bachelor', 'master', 'phd', 'diploma', 
                          'universitet', 'uddannelse', 'kandidat', 'bachelor', 'gymnasium'];
        const keywordMatches = eduKeywords.filter(keyword => 
          text.includes(keyword.toLowerCase())).length;
        
        confidence.education = keywordMatches >= 2 ? 
          (educationStr.length > 100 ? 0.85 : 0.7) : 0.5;
        break;
        
      case 'experience':
        // Experience confidence based on section length and job-related keywords
        const experienceStr = value as string;
        const expKeywords = ['job', 'work', 'position', 'company', 'employer', 'arbejde', 
                            'stilling', 'virksomhed', 'ansvar', 'responsibility'];
        const expKeywordMatches = expKeywords.filter(keyword => 
          text.includes(keyword.toLowerCase())).length;
        
        confidence.experience = expKeywordMatches >= 2 ? 
          (experienceStr.length > 150 ? 0.85 : 0.7) : 0.5;
        break;
        
      case 'skills':
        // Skills confidence based on section length and skill-related keywords
        const skillsStr = value as string;
        const skillKeywords = ['skills', 'proficient', 'knowledge', 'experienced', 
                              'kompetencer', 'færdigheder', 'kendskab', 'erfaren'];
        const skillKeywordMatches = skillKeywords.filter(keyword => 
          text.includes(keyword.toLowerCase())).length;
        
        confidence.skills = skillKeywordMatches >= 2 ? 
          (skillsStr.length > 50 ? 0.85 : 0.7) : 0.5;
        break;
        
      default:
        confidence[key] = 0.5; // Default confidence for other fields
    }
  }
  
  return confidence;
}
