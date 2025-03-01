
import React from 'react';
import { FileText, CheckCircle, Sparkles } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-left">
          <h2 className="text-base font-semibold leading-7 text-primary-700">
            Spar tid på jobsøgningen
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">
            Fokusér på de rigtige jobs, ikke på at skrive ansøgninger
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Med vores avancerede AI-teknologi kan du hurtigt generere målrettede ansøgninger,
            der matcher jobopslaget og fremhæver dine relevante kompetencer.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-primary-800">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Skræddersyede ansøgninger
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Vores AI analyserer jobopslaget og genererer en personlig ansøgning,
                der matcher virksomhedens behov og fremhæver dine relevante kompetencer.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-primary-800">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Simpel og intuitiv
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Kopier og indsæt jobopslaget, angiv din profil, og få en færdig
                ansøgning på få sekunder. Det har aldrig været nemmere.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-primary-800">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Avanceret AI-teknologi
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Vi anvender de nyeste modeller inden for kunstig intelligens til at
                generere overbevisende og personlige ansøgninger i høj kvalitet.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-primary-800">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                Organisér dine ansøgninger
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Gem alle dine jobopslag og ansøgninger ét sted, så du nemt kan følge
                med i din jobsøgningsproces og genbruge indhold.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
