
import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Briefcase, PenTool, ChevronRight } from 'lucide-react';

interface HowItWorksSectionProps {
  session: any;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ session }) => {
  return (
    <div id="how-it-works" className="bg-primary-800 text-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-100">
            Sådan fungerer det
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tre simple trin til din næste jobansøgning
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <ol className="grid gap-10 lg:grid-cols-3">
            <li className="relative flex flex-col items-center">
              <div className="rounded-full bg-white p-4 text-primary-800">
                <FileUp className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white text-center">
                Indsæt jobopslaget
              </h3>
              <p className="mt-2 text-base text-primary-100 text-center">
                Kopier og indsæt hele jobopslaget eller de vigtigste dele. Vores AI vil
                automatisk identificere nøgleoplysninger.
              </p>
            </li>
            <li className="relative flex flex-col items-center">
              <div className="rounded-full bg-white p-4 text-primary-800">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white text-center">
                Tilpas din profil
              </h3>
              <p className="mt-2 text-base text-primary-100 text-center">
                Udfyld din profil med dine kvalifikationer, erfaringer og kompetencer.
                Jo mere detaljeret, desto bedre bliver din ansøgning.
              </p>
            </li>
            <li className="relative flex flex-col items-center">
              <div className="rounded-full bg-white p-4 text-primary-800">
                <PenTool className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white text-center">
                Modtag din ansøgning
              </h3>
              <p className="mt-2 text-base text-primary-100 text-center">
                Vores AI genererer en skræddersyet ansøgning, som du kan redigere,
                gemme og downloade. Klar til at sende til din næste potentielle arbejdsgiver.
              </p>
            </li>
          </ol>
          <div className="mt-16 text-center">
            <Link
              to={session ? "/generator" : "/auth"}
              className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-800 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {session ? "Opret ansøgning" : "Opret konto og start"} <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
