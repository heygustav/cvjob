
import { PersonalInfoFormState } from '@/pages/Profile';
import { extractSection } from './section/extractors';
import { extractName } from './personal/nameExtractor';
import { extractContactInfo } from './personal/contactExtractor';
import { validateEducation, validateExperience, validateSkills } from './content/validators';

// Re-export the extractSection function for external use
export { extractSection } from './section/extractors';

/**
 * Parse resume text to extract structured information
 * @param text The full text of the resume
 * @returns Structured data extracted from the resume
 */
export function parseResumeText(text: string): Partial<PersonalInfoFormState> {
  const extractedData: Partial<PersonalInfoFormState> = {};
  
  console.log("Full resume text for parsing:", text.substring(0, 300) + "...");
  
  // Extract name
  extractedData.name = extractName(text);
  console.log("Extracted name:", extractedData.name);
  
  // Extract contact information
  const contactInfo = extractContactInfo(text);
  Object.assign(extractedData, contactInfo);
  console.log("Extracted contact info:", contactInfo);
  
  // Extract education (improved with multilingual support)
  const educationSection = extractSection(text, [
    'education', 'uddannelse', 'uddannelser', 'education history', 'academic background',
    'educational background', 'uddannelsesmæssig baggrund', 'akademisk baggrund'
  ]);
  
  if (educationSection) {
    // Validate and clean up the education section
    extractedData.education = validateEducation(educationSection);
    console.log("Extracted education section of length:", educationSection.length);
  } else {
    // Fallback: Try to identify education information from the general text
    const educationKeywords = [
      'bachelor', 'master', 'kandidat', 'phd', 'ph.d.', 
      'universitet', 'university', 'college', 'diploma', 'diplom'
    ];
    
    let foundEducation = false;
    for (const keyword of educationKeywords) {
      const pattern = new RegExp(`\\b${keyword}\\b.*?\\n+`, 'ig');
      const matches = [...text.matchAll(pattern)];
      
      if (matches.length > 0) {
        const educationText = matches.map(match => match[0]).join('\n');
        extractedData.education = validateEducation(educationText);
        foundEducation = true;
        console.log("Found education using keyword matching:", keyword);
        break;
      }
    }
    
    if (!foundEducation) {
      console.log("Could not extract education section");
    }
  }
  
  // Extract experience (improved with multilingual support)
  const experienceSection = extractSection(text, [
    'experience', 'work experience', 'employment', 'professional experience',
    'erfaring', 'arbejdserfaring', 'erhvervserfaring', 'ansættelser', 'professionel erfaring',
    'arbejde', 'career', 'karriere'
  ]);
  
  if (experienceSection) {
    // Validate and clean up the experience section
    extractedData.experience = validateExperience(experienceSection);
    console.log("Extracted experience section of length:", experienceSection.length);
  } else {
    // Fallback: Try to identify experience information from the general text
    const experienceKeywords = [
      'stilling', 'position', 'job', 'arbejde', 'ansvarlig', 
      'ansvar', 'responsibilities', 'company', 'virksomhed'
    ];
    
    let foundExperience = false;
    for (const keyword of experienceKeywords) {
      const pattern = new RegExp(`\\b${keyword}\\b.*?\\n+`, 'ig');
      const matches = [...text.matchAll(pattern)];
      
      if (matches.length > 0) {
        const experienceText = matches.map(match => match[0]).join('\n');
        extractedData.experience = validateExperience(experienceText);
        foundExperience = true;
        console.log("Found experience using keyword matching:", keyword);
        break;
      }
    }
    
    if (!foundExperience) {
      console.log("Could not extract experience section");
    }
  }
  
  // Extract skills (improved with multilingual support)
  const skillsSection = extractSection(text, [
    'skills', 'kompetencer', 'færdigheder', 'qualifications', 'kvalifikationer',
    'technical skills', 'tekniske kompetencer', 'core competencies', 'kernekompetencer',
    'evner', 'abilities', 'expertises', 'ekspertiser'
  ]);
  
  if (skillsSection) {
    // Validate and clean up the skills section
    extractedData.skills = validateSkills(skillsSection);
    console.log("Extracted skills section of length:", skillsSection.length);
  } else {
    // Fallback: Try to identify skills from lists or bullet points
    const listPattern = /^[•●■○◦-]\s*.+|^\s*[\w\s-]+(,\s*[\w\s-]+)+$/gm;
    const matches = [...text.matchAll(listPattern)];
    
    if (matches.length > 0) {
      // Only use list items that are likely skills (shorter phrases)
      const skillCandidates = matches
        .map(match => match[0].trim())
        .filter(item => item.length < 100); // Skill descriptions are usually short
      
      if (skillCandidates.length > 0) {
        extractedData.skills = skillCandidates.join('\n');
        console.log("Found skills using list pattern matching");
      }
    }
  }
  
  // Log what we found
  console.log("Total fields extracted:", Object.keys(extractedData).length);
  console.log("Extracted fields:", Object.keys(extractedData).join(", "));
  
  return extractedData;
}
