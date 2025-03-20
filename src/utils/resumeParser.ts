
// Export client-side CV parser
export * from './resume/clientParser';

// Export types with correct syntax for isolatedModules
export type { ProcessResult, ParsedResumeData, RawResumeData } from './resume/types';

// Export utilities with proper type export syntax
export { exportResume } from './resume/pdfExporter';
export type { ResumeFormat } from './resume/pdfExporter';

// Export the processPdfFile function
export { processPdfFile } from './resume/resumeService';
