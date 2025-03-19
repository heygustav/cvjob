
import React from "react";
import { Button } from "@/components/ui/button";

interface QuizSlideProps {
  title: string;
  description?: string;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
  children: React.ReactNode;
}

const QuizSlide: React.FC<QuizSlideProps> = ({
  title,
  description,
  onNext,
  onSkip,
  isLast = false,
  children,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      
      <div className="mb-6">
        {children}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          onClick={onSkip}
          className="text-gray-500 hover:text-gray-700"
        >
          Spring over
        </Button>
        <Button onClick={onNext}>
          {isLast ? "Afslut" : "Næste"}
        </Button>
      </div>
    </div>
  );
};

export default QuizSlide;
