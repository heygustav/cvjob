
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeftIcon, PencilIcon, FileTextIcon } from "lucide-react";

interface GeneratorLayoutProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  hasGeneratedLetter: boolean;
  children: React.ReactNode;
}

export const GeneratorLayout: React.FC<GeneratorLayoutProps> = ({
  step,
  setStep,
  hasGeneratedLetter,
  children
}) => {
  // Create tab value based on current step
  const tabValue = `step-${step}`;
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'step-1') {
      setStep(1);
    } else if (value === 'step-2' && hasGeneratedLetter) {
      setStep(2);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Ansøgningsgenerator
        </h1>
        <p className="text-muted-foreground">
          Opret en skræddersyet ansøgning til dit næste job
        </p>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        <div className="border-b p-4 sm:px-6">
          <Tabs
            value={tabValue}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="step-1" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Job Information</span>
                  <span className="sm:hidden">Job</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="step-2" 
                  disabled={!hasGeneratedLetter}
                  className={cn(
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    !hasGeneratedLetter && "cursor-not-allowed opacity-50"
                  )}
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Ansøgning</span>
                  <span className="sm:hidden">Brev</span>
                </TabsTrigger>
              </TabsList>

              {step === 2 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setStep(1)}
                  className="hidden sm:flex"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Tilbage til jobinfo
                </Button>
              )}
            </div>
          </Tabs>
        </div>
        
        <CardContent className="p-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
