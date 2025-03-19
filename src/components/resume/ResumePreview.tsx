
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Resume } from "@/types/resume";
import { ModernTemplate, ClassicTemplate, CreativeTemplate } from "./templates";
import { getTemplateClass } from "./templates/templateUtils";

interface ResumePreviewProps {
  data: Resume;
  template: "modern" | "classic" | "creative";
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  // Check if we have the minimum required data
  const isDataComplete = !!data.name && !!data.email;
  
  if (!isDataComplete) {
    return (
      <div className="p-8 bg-muted rounded-md text-center">
        <h3 className="text-lg font-semibold mb-2">Incomplete Resume</h3>
        <p className="text-muted-foreground">
          Please provide at least your name and email in the edit section.
        </p>
      </div>
    );
  }

  // Render template based on selection
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className={`p-6 ${getTemplateClass(template)}`}>
        {template === "modern" && <ModernTemplate data={data} />}
        {template === "classic" && <ClassicTemplate data={data} />}
        {template === "creative" && <CreativeTemplate data={data} />}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
