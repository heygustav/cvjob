import { Resume } from "@/types/resume";

/**
 * Keyword analyzer for improving ATS compatibility
 * This utility can help identify if a resume contains relevant keywords for a job description
 */

/**
 * Parameters for keyword analysis
 */
export interface KeywordAnalysisParams {
  resume: Resume;
  jobDescription?: string;
}

/**
 * Result of keyword analysis
 */
export interface KeywordAnalysisResult {
  // Score from 0-100
  score: number;
  // Recommendations for improvement
  recommendations: string[];
  // Keywords found in resume
  keywordsFound: string[];
  // Keywords missing from resume but present in job description
  keywordsMissing: string[];
}

/**
 * Common keywords to check for various job types
 */
const COMMON_KEYWORDS: Record<string, string[]> = {
  general: [
    "leadership", "management", "project", "team", "communication", 
    "organized", "detail-oriented", "analysis", "problem-solving",
    "results", "improve", "increase", "decrease", "develop", "implement",
    "collaborate", "coordinate", "strategic", "planning"
  ],
  tech: [
    "software", "development", "programming", "code", "application",
    "data", "analysis", "database", "cloud", "infrastructure", "architecture",
    "testing", "deployment", "security", "agile", "scrum", "devops",
    "javascript", "python", "java", "react", "node", "api", "rest", "front-end", "back-end"
  ],
  marketing: [
    "marketing", "brand", "strategy", "campaign", "social media", "content",
    "seo", "sem", "analytics", "growth", "conversion", "customer", "research",
    "advertising", "communications", "digital marketing", "lead generation"
  ],
  sales: [
    "sales", "revenue", "business development", "client", "customer", "account",
    "negotiation", "targets", "quota", "pipeline", "crm", "relationship",
    "closing", "prospecting", "lead generation", "conversion"
  ],
  finance: [
    "finance", "accounting", "budget", "analysis", "financial", "forecast",
    "reporting", "statements", "tax", "audit", "compliance", "cost",
    "revenue", "profit", "loss", "investment", "risk", "cash flow"
  ]
};

/**
 * Extract keywords from job description
 * @param jobDescription 
 * @returns array of keywords
 */
const extractKeywords = (jobDescription: string): string[] => {
  if (!jobDescription) return [];
  
  // Convert to lowercase for easier comparison
  const text = jobDescription.toLowerCase();
  
  // Create a set of potential keywords
  const keywordSet = new Set<string>();
  
  // Add any found keywords from common categories
  Object.values(COMMON_KEYWORDS).forEach(keywordList => {
    keywordList.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        keywordSet.add(keyword.toLowerCase());
      }
    });
  });
  
  // Find skill-related keywords (often preceded by "skills" or bullet points)
  const skillsSection = text.match(/skills(?:.*?)(?:\n\n|\Z)/is);
  if (skillsSection) {
    const skills = skillsSection[0].match(/[•\-*]\s*([^•\-*\n]+)/g);
    if (skills) {
      skills.forEach(skill => {
        // Clean up and add to the set
        const cleanSkill = skill.replace(/[•\-*]/g, '').trim().toLowerCase();
        if (cleanSkill && cleanSkill.length > 2) {
          keywordSet.add(cleanSkill);
        }
      });
    }
  }
  
  // Extract any capitalized terms (often technologies, methodologies, or certifications)
  const capitalized = text.match(/\b[A-Z][A-Za-z0-9]+\b/g);
  if (capitalized) {
    capitalized.forEach(word => {
      if (word.length > 1 && !['I', 'A', 'The'].includes(word)) {
        keywordSet.add(word.toLowerCase());
      }
    });
  }
  
  return Array.from(keywordSet);
};

/**
 * Find occurrences of keywords in a resume
 * @param resume Resume object
 * @param keywords Keywords to search for
 * @returns Map of keywords to count of occurrences
 */
const findKeywordsInResume = (resume: Resume, keywords: string[]): Map<string, number> => {
  const keywordCounts = new Map<string, number>();
  keywords.forEach(keyword => keywordCounts.set(keyword, 0));
  
  // Convert resume to searchable text
  const resumeText = [
    resume.summary,
    resume.experience,
    ...((resume.structuredExperience || []).flatMap(exp => [
      exp.position,
      exp.organization,
      ...(exp.bulletPoints || [])
    ])),
    resume.education,
    ...((resume.structuredEducation || []).flatMap(edu => [
      edu.education,
      edu.school,
      ...(edu.bulletPoints || [])
    ])),
    resume.skills,
    ...((resume.structuredSkills || []).flatMap(skill => [
      skill.skill,
      ...(skill.bulletPoints || [])
    ]))
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Count occurrences of each keyword
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = resumeText.match(regex);
    if (matches) {
      keywordCounts.set(keyword, matches.length);
    }
  });
  
  return keywordCounts;
};

/**
 * Generate ATS optimization suggestions based on keyword analysis
 * @param keywordCounts Keyword occurrence counts
 * @returns Array of suggestions
 */
const generateSuggestions = (
  keywordCounts: Map<string, number>,
  jobDescription?: string
): {recommendations: string[], keywordsFound: string[], keywordsMissing: string[]} => {
  const recommendations: string[] = [];
  const keywordsFound: string[] = [];
  const keywordsMissing: string[] = [];
  
  // Check which keywords are missing or have low counts
  keywordCounts.forEach((count, keyword) => {
    if (count === 0) {
      keywordsMissing.push(keyword);
    } else {
      keywordsFound.push(keyword);
    }
  });
  
  // Generate recommendations based on findings
  if (keywordsMissing.length > 0) {
    if (jobDescription) {
      recommendations.push(`Add missing keywords from the job description: ${keywordsMissing.slice(0, 5).join(', ')}${keywordsMissing.length > 5 ? '...' : ''}`);
    } else {
      recommendations.push(`Consider adding these common industry keywords: ${keywordsMissing.slice(0, 5).join(', ')}${keywordsMissing.length > 5 ? '...' : ''}`);
    }
  }
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+%|\d+x|\$\d+|\d+ percent|increased by \d+/i;
  if (!keywordsFound.some(k => hasNumbers.test(k))) {
    recommendations.push("Quantify your achievements with specific numbers (e.g., 'increased sales by 20%')");
  }
  
  // Check for action verbs
  const actionVerbs = ['achieved', 'improved', 'created', 'developed', 'managed', 'led', 'implemented'];
  if (!actionVerbs.some(verb => keywordsFound.includes(verb))) {
    recommendations.push("Use strong action verbs like 'achieved', 'improved', 'developed' to describe your experience");
  }
  
  // Default recommendations for good measure
  if (recommendations.length === 0) {
    recommendations.push("Your resume contains many relevant keywords - tailor it further for each specific job application");
  }
  
  recommendations.push("Ensure your resume uses a clean, ATS-friendly format with standard section headings");
  
  return { recommendations, keywordsFound, keywordsMissing };
};

/**
 * Calculate an ATS compatibility score
 * @param keywordCounts Keyword occurrence map
 * @param totalKeywords Total number of relevant keywords
 * @returns Score from 0-100
 */
const calculateScore = (
  keywordCounts: Map<string, number>,
  totalKeywords: number
): number => {
  if (totalKeywords === 0) return 0;
  
  // Count keywords that are present at least once
  const keywordsPresent = Array.from(keywordCounts.values()).filter(count => count > 0).length;
  
  // Base score on percentage of keywords present
  const baseScore = Math.round((keywordsPresent / totalKeywords) * 100);
  
  // Cap at 100
  return Math.min(baseScore, 100);
};

/**
 * Analyze a resume for ATS compatibility
 * @param params Analysis parameters
 * @returns Analysis results
 */
export const analyzeResume = (params: KeywordAnalysisParams): KeywordAnalysisResult => {
  const { resume, jobDescription } = params;
  
  // Extract keywords from job description or use general ones
  const keywords = jobDescription 
    ? extractKeywords(jobDescription)
    : [...COMMON_KEYWORDS.general, ...COMMON_KEYWORDS.tech, ...COMMON_KEYWORDS.marketing];
  
  // Find keyword occurrences
  const keywordCounts = findKeywordsInResume(resume, keywords);
  
  // Generate suggestions
  const { recommendations, keywordsFound, keywordsMissing } = generateSuggestions(keywordCounts, jobDescription);
  
  // Calculate score
  const score = calculateScore(keywordCounts, keywords.length);
  
  return {
    score,
    recommendations,
    keywordsFound,
    keywordsMissing
  };
}; 