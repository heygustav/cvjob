
import React from 'react';
import Icon from '../ui/icon';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-left">
          <h2 id="features-heading" className="text-base font-semibold leading-7 text-primary-700">
            Effektiv jobsøgning
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Fokusér på de rette jobs, ikke på at skrive ansøgninger
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Med vores værktøj kan du hurtigt skabe målrettede ansøgninger,
            der fremhæver dine relevante kompetencer og matcher stillingens krav.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <Icon name="FileText" className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Skræddersyede ansøgninger
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Vores teknologi analyserer jobopslaget og skaber en personlig ansøgning,
                der matcher virksomhedens behov og fremhæver dine relevante kompetencer.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <Icon name="CheckCircle" className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Enkel og brugervenlig
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Indsæt jobopslaget, udfyld din profil, og få en færdig
                ansøgning på få minutter. Ingen komplicerede trin.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <Icon name="Shield" className="h-6 w-6 text-white" dynamic aria-hidden="true" />
                </div>
                Sikkerhed og fortrolighed
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Dine data er sikre hos os. Vi prioriterer beskyttelse af dine personlige oplysninger
                og overholder GDPR-regler om databeskyttelse.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                  <Icon name="folder" className="h-6 w-6 text-white" dynamic aria-hidden="true" />
                </div>
                Overblik over din jobsøgning
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Gem alle dine ansøgninger ét sted, så du nemt kan holde styr på 
                din jobsøgningsproces og genbruge indhold til fremtidige ansøgninger.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
