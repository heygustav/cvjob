
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
        <h3 className="text-lg font-medium mb-2">ATS-optimering</h3>
        <p className="text-sm text-muted-foreground">
          Applicant Tracking Systems (ATS) er software, som arbejdsgivere bruger til at scanne og filtrere CV'er.
          Brug dette værktøj til at kontrollere, hvor godt dit CV vil klare sig med disse systemer, og få skræddersyet rådgivning.
        </p>
      </div>
      
      <AtsOptimizer resumeData={resumeData} />
      
      <div className="border-t pt-4 mt-6">
        <h4 className="font-medium mb-3">ATS-tips</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Brug standard sektionsoverskrifter (Erfaring, Uddannelse, Kompetencer)</li>
          <li>Anvend korrekt formatering med konsekvent spacing</li>
          <li>Inkluder relevante nøgleord fra jobopslaget</li>
          <li>Brug et rent, enkelt layout uden komplekse tabeller eller grafik</li>
          <li>Gem dit CV i et simpelt PDF- eller DOCX-format</li>
        </ul>
      </div>
    </div>
  );
};

export default AtsTab;
