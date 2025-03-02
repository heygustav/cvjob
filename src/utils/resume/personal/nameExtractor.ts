
import { extractSection } from '../section/extractors';

/**
 * Extract name from resume text using various heuristics
 * @param text The resume text
 * @returns The extracted name or undefined
 */
export function extractName(text: string): string | undefined {
  // Check for name in a "name" or "navn" section
  const nameSection = extractSection(text, ['name:', 'navn:', 'name', 'navn']);
  if (nameSection && nameSection.length < 50) {
    return nameSection.split('\n')[0].trim();
  }
  
  // Try to extract from the first few lines (common in resumes)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Check the first 3 lines for a possible name
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    // Name is typically short, doesn't contain common symbols, and isn't all uppercase
    if (line.length > 0 && line.length < 40 && 
        !line.includes('@') && !line.includes(':') && 
        !line.match(/^\d+/) && line !== line.toUpperCase() &&
        !line.match(/uddannelse|education|erfaring|experience|kompetencer|skills/i)) {
      return line;
    }
  }
  
  return undefined;
}
