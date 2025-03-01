
import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary-800 text-center">
            Hvad vores brugere siger
          </h2>
          <figure className="mt-12">
            <blockquote className="text-center text-xl font-semibold leading-8 text-foreground sm:text-2xl sm:leading-9">
              <p>
                "Efter at have brugt CVJob fik jeg tre jobsamtaler på en uge.
                Ansøgningerne var så personlige og relevante, at rekrutteringsansvarlige
                troede, jeg havde brugt timer på at skrive dem."
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <div className="mx-auto flex items-center justify-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-700 flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">ML</span>
                </div>
                <div className="text-left">
                  <div className="text-base font-semibold text-primary-800">Mette L.</div>
                  <div className="text-sm text-muted-foreground">Digital Marketing Manager</div>
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
