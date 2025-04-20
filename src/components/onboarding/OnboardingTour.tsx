
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Guide } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tourSteps = [
  {
    id: 1,
    title: "Velkommen til CVJob",
    description: "Lad os give dig en hurtig rundvisning af de vigtigste funktioner.",
  },
  {
    id: 2,
    title: "Opret ansøgninger",
    description: "Klik her for at begynde at generere personlige ansøgninger med AI.",
    target: '[data-tour="create-application"]',
  },
  {
    id: 3,
    title: "Se dit dashboard",
    description: "Hold styr på dine ansøgninger og jobopslag i dit personlige dashboard.",
    target: '[data-tour="dashboard"]',
  },
  {
    id: 4,
    title: "Administrer din profil",
    description: "Opdater dine oplysninger og CV for at få bedre ansøgninger.",
    target: '[data-tour="profile"]',
  }
];

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const step = tourSteps[currentStep];

  useEffect(() => {
    if (step?.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, step?.target]);

  const handleNext = () => {
    if (currentStep === tourSteps.length - 1) {
      setIsOpen(false);
      onComplete();
      localStorage.setItem('onboardingComplete', 'true');
      toast({
        title: "Rundvisning fuldført",
        description: "Du er nu klar til at bruge CVJob. God fornøjelse!",
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    onComplete();
    localStorage.setItem('onboardingComplete', 'true');
  };

  if (!isOpen) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => {}}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Guide className="h-5 w-5" />
            <Dialog.Title className="text-lg font-medium">
              {step.title}
            </Dialog.Title>
          </div>

          <Dialog.Description className="text-muted-foreground mb-6">
            {step.description}
          </Dialog.Description>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Spring over
            </Button>
            <Button onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? (
                "Afslut"
              ) : (
                <>
                  Næste
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OnboardingTour;
