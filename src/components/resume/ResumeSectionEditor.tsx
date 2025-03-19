
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Resume, ResumeSectionField } from "@/types/resume";

interface ResumeSectionEditorProps {
  title: string;
  sections: ResumeSectionField[];
  onUpdate: (section: keyof Resume, value: string) => void;
}

const ResumeSectionEditor: React.FC<ResumeSectionEditorProps> = ({
  title,
  sections,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {title}
      </h4>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.key} className="space-y-2">
            <Label htmlFor={section.key}>{section.label}</Label>
            {section.multiline ? (
              <Textarea
                id={section.key}
                value={section.value || ""}
                onChange={(e) => onUpdate(section.key, e.target.value)}
                rows={4}
                className="resize-none"
              />
            ) : (
              <Input
                id={section.key}
                value={section.value || ""}
                onChange={(e) => onUpdate(section.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeSectionEditor;
