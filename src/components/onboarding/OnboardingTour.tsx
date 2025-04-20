
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from "@/components/ui/button";
import { ChevronRight, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tourSteps = [
  {
    id: 'welcome',
    title: 'Velkommen til CVJob',
    content: 'Vi har lavet en kort rundvisning for at hjælpe dig med at komme i gang. Lad os gennemgå de vigtigste funktioner.',
    highlight: null,
  },
  {
    id: 'ansøgningsgenerator',
    title: 'AI Ansøgningsgenerator',
    content: 'Vores kraftfulde AI kan generere personlige jobansøgninger baseret på dit CV og stillingsbeskrivelsen. Det sparer dig timer af arbejde!',
    highlight: 'nav-generator',
  },
  {
    id: 'cv-builder',
    title: 'CV Builder',
    content: 'Upload eller opret dit CV. Vi optimerer det til ATS-scanningsværktøjer, så du har større chance for at nå til samtalen.',
    highlight: 'nav-resume',
  },
  {
    id: 'dashboard',
    title: 'Dit Dashboard',
    content: 'Hold styr på alle dine ansøgninger og CV-versioner et centralt sted.',
    highlight: 'nav-dashboard',
  },
  {
    id: 'complete',
    title: 'Du er klar!',
    content: 'Start med at oprette din profil, så vi kan hjælpe dig med at lande dit næste job.',
    highlight: null,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { toast } = useToast();
  
  const currentStep = tourSteps[currentStepIndex];
  
  // Highlight the relevant element
  useEffect(() => {
    const highlightId = currentStep.highlight;
    if (highlightId) {
      const el = document.getElementById(highlightId);
      if (el) {
        el.classList.add('ring-4', 'ring-primary', 'ring-offset-2', 'z-50');
        
        return () => {
          el.classList.remove('ring-4', 'ring-primary', 'ring-offset-2', 'z-50');
        };
      }
    }
  }, [currentStep]);
  
  const nextStep = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setIsOpen(false);
    toast({
      title: "Rundvisning afsluttet",
      description: "Du kan altid få hjælp under profil-menuen",
    });
    onComplete();
  };
  
  const skipTour = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setIsOpen(false);
    onComplete();
  };
  
  const step = tourSteps[currentStepIndex];
  const isLastStep = currentStepIndex === tourSteps.length - 1;
  
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 text-primary mb-4">
            <HelpCircle className="h-5 w-5" />
            <Dialog.Title className="text-lg font-medium">
              {step.title}
            </Dialog.Title>
          </div>
          
          <Dialog.Description className="text-sm text-gray-500 mb-6">
            {step.content}
          </Dialog.Description>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={skipTour}>
              Spring over
            </Button>
            <Button onClick={nextStep}>
              {isLastStep ? 'Start' : 'Næste'}
              {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OnboardingTour;
