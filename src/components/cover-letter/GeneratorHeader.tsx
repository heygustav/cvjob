
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface GeneratorHeaderProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  hasGeneratedLetter: boolean;
}

export const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({
  step,
  setStep,
  hasGeneratedLetter,
}) => {
  const handleStepChange = (value: string) => {
    if (value === "1") {
      setStep(1);
    } else if (value === "2" && hasGeneratedLetter) {
      setStep(2);
    }
  };

  return (
    <div className="mb-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Ansøgningsgenerator
        </h1>
        <p className="text-muted-foreground">
          Generér den perfekte ansøgning til dit næste job
        </p>
      </div>

      <Tabs
        defaultValue={step.toString()}
        value={step.toString()}
        onValueChange={handleStepChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1">Joboplysninger</TabsTrigger>
          <TabsTrigger value="2" disabled={!hasGeneratedLetter}>
            Forhåndsvisning
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
