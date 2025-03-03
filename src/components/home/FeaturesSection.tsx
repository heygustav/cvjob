
import React from 'react';
import Icon from '../ui/icon';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-secondary/50" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-left">
          <h2 id="features-heading" className="text-base font-semibold leading-7 text-primary-700">
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
                  <Icon name="FileText" className="h-6 w-6 text-white" aria-hidden="true" />
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
                  <Icon name="CheckCircle" className="h-6 w-6 text-white" aria-hidden="true" />
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
                  <Icon name="Sparkles" className="h-6 w-6 text-white" dynamic aria-hidden="true" />
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
                  <Icon name="folder" className="h-6 w-6 text-white" dynamic aria-hidden="true" />
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
    </section>
  );
};

export default FeaturesSection;
