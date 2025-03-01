
import React from 'react';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  session: any;
}

const CTASection: React.FC<CTASectionProps> = ({ session }) => {
  return (
    <div className="bg-primary-800 text-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Klar til at skrive din næste jobansøgning?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
            Kom i gang med CVJob i dag og lad vores AI hjælpe dig med at få dit drømmejob.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to={session ? "/generator" : "/auth"}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-800 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {session ? "Lav din første ansøgning" : "Tilmeld dig gratis"}
            </Link>
            <Link
              to="#how-it-works"
              className="text-sm font-semibold leading-6 text-primary-100 hover:text-white transition-colors"
            >
              Læs mere <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
