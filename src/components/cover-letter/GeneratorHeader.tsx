
import React from "react";

interface GeneratorHeaderProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
}

const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({ step, setStep }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900">
          {step === 1 ? "Indtast jobdetaljer" : "Din ansøgning"}
        </h1>
        <p className="mt-1 text-sm sm:text-lg text-gray-600">
          {step === 1
            ? "Angiv information om jobbet, du søger"
            : "Gennemgå og rediger din AI-genererede ansøgning"}
        </p>
      </div>
      {step === 2 && (
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black w-full sm:w-auto"
        >
          Rediger jobdetaljer
        </button>
      )}
    </div>
  );
};

export default GeneratorHeader;
