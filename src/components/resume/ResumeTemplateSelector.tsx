
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResumeTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Et rent og professionelt layout med et moderne twist.",
      image: "/placeholder.svg"
    },
    {
      id: "classic",
      name: "Klassisk",
      description: "Et traditionelt layout, der passer til alle brancher.",
      image: "/placeholder.svg"
    },
    {
      id: "creative",
      name: "Kreativ",
      description: "Et farverigt layout for kreative stillinger.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-6">Vælg en skabelon til dit CV</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`overflow-hidden cursor-pointer transition-all ${
              selectedTemplate === template.id 
                ? "ring-2 ring-primary" 
                : "hover:shadow-md"
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="h-48 bg-gray-100 relative">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Valgt
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
              <Button 
                className="w-full mt-4"
                variant={selectedTemplate === template.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id);
                }}
              >
                {selectedTemplate === template.id ? "Fortsæt" : "Vælg skabelon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;
