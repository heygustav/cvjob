
import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Briefcase, PenTool, ChevronRight } from 'lucide-react';

interface HowItWorksSectionProps {
  session: any;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ session }) => {
  return (
    <div id="how-it-works" className="bg-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-700">
            Sådan fungerer det
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tre enkle trin til din næste jobansøgning
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Vi har gjort processen enkel, så du kan fokusere på at finde dit drømmejob
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <ol className="grid gap-10 lg:grid-cols-3">
            <li className="relative flex flex-col items-center">
              <div className="rounded-full bg-primary-700 p-4 text-white">
                <FileUp className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                1. Indsæt jobopslaget
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Kopier og indsæt hele jobopslaget. Vores AI analyserer automatisk 
                stillingsbeskrivelsen og identificerer nøglekrav.
              </p>
            </li>
            <li className="relative flex flex-col items-center">
              <div className="rounded-full bg-primary-700 p-4 text-white">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                2. Tilføj dine kvalifikationer
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Fortæl om din erfaring, uddannelse og kompetencer. 
                Jo mere information du giver, desto bedre bliver resultatet.
              </p>
            </li>
            <li className="relative flex flex-col items-center">
              <div className="rounded-full bg-primary-700 p-4 text-white">
                <PenTool className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                3. Modtag din ansøgning
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Få en skræddersyet ansøgning, som du kan redigere og tilpasse.
                Download og send den direkte til arbejdsgiveren.
              </p>
            </li>
          </ol>
          <div className="mt-16 text-center">
            <Link
              to={session ? "/ansoegning" : "/auth"}
              className="inline-flex items-center rounded-md bg-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {session ? "Opret din ansøgning" : "Opret gratis konto"} <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
