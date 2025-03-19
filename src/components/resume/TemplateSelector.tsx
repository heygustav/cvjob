
import React from "react";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

// Available templates
const TEMPLATES = ["modern", "classic", "creative"];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-2">Skabelon</h4>
      <div className="flex space-x-2">
        {TEMPLATES.map((template) => (
          <Button
            key={template}
            variant={selectedTemplate === template ? "default" : "outline"}
            onClick={() => onSelectTemplate(template)}
            className="capitalize h-10 px-4"
          >
            {template === "modern" ? "Moderne" : 
             template === "classic" ? "Klassisk" : 
             template === "creative" ? "Kreativ" : template}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
