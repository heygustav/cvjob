
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DanishCVGenerator from "@/components/resume/DanishCVGenerator";
import DanishResumeActions from "./DanishResumeActions";
import { Resume } from "@/types/resume";

interface DanishResumeContentProps {
  resumeData: Resume;
}

const DanishResumeContent: React.FC<DanishResumeContentProps> = ({
  resumeData
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dansk CV Generator</h1>
            <p className="text-muted-foreground">Opret et professionelt dansk CV baseret på dine profiloplysninger</p>
          </header>

          <DanishResumeActions resumeData={resumeData} />

          <div className="bg-white rounded-md shadow-sm border p-4">
            <DanishCVGenerator data={resumeData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DanishResumeContent;
