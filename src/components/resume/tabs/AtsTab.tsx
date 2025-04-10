
import React from "react";
import AtsOptimizer from "../AtsOptimizer";
import { Resume } from "@/types/resume";

interface AtsTabProps {
  resumeData: Resume;
}

const AtsTab: React.FC<AtsTabProps> = ({ resumeData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/40 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-2">ATS Optimization</h3>
        <p className="text-sm text-muted-foreground">
          Applicant Tracking Systems (ATS) are software used by employers to scan and filter resumes.
          Use this tool to check how well your resume might perform with these systems and get tailored advice.
        </p>
      </div>
      
      <AtsOptimizer resumeData={resumeData} />
      
      <div className="border-t pt-4 mt-6">
        <h4 className="font-medium mb-3">ATS Tips</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Use standard section headings (Experience, Education, Skills)</li>
          <li>Apply proper formatting with consistent spacing</li>
          <li>Include relevant keywords from the job description</li>
          <li>Use a clean, simple layout without complex tables or graphics</li>
          <li>Save your resume as a simple PDF or DOCX format</li>
        </ul>
      </div>
    </div>
  );
};

export default AtsTab;
