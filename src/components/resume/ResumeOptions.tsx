
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { ResumeOptions } from "@/pages/ResumeBuilder";

interface ResumeOptionsProps {
  options: ResumeOptions;
  onChange: (options: Partial<ResumeOptions>) => void;
}

const ResumeOptionsPanel: React.FC<ResumeOptionsProps> = ({ options, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-medium">Skrifttype</Label>
        <RadioGroup 
          value={options.font} 
          onValueChange={(value) => onChange({ font: value as "TimesNewRoman" | "Arial" })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="TimesNewRoman" id="times" />
            <Label htmlFor="times" className="font-serif">Times New Roman</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Arial" id="arial" />
            <Label htmlFor="arial" className="font-sans">Arial</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base font-medium">Inkluder foto</Label>
        <div className="flex items-center space-x-2">
          <Switch 
            id="photo-mode" 
            checked={options.includePhoto} 
            onCheckedChange={(checked) => onChange({ includePhoto: checked })}
          />
          <Label htmlFor="photo-mode">
            {options.includePhoto ? "Ja, inkluder foto" : "Nej, ingen foto"}
          </Label>
        </div>
        {options.includePhoto && (
          <p className="text-sm text-muted-foreground mt-2">
            Dit profilbillede vil blive placeret i øverste venstre hjørne.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeOptionsPanel;
