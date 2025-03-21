
import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
            Hvad vores brugere siger
          </h2>
          <div className="mt-12 space-y-8 lg:mt-16 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="relative p-6 bg-white shadow-sm rounded-lg">
              <blockquote>
                <p className="text-base font-medium text-gray-900">
                  "Efter at have brugt CVJob modtog jeg positive svar på tre ud af fire ansøgninger. 
                  Værktøjet sparede mig meget tid og hjalp mig med at fremhæve mine relevante kompetencer."
                </p>
                <footer className="mt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img 
                        src="/lovable-uploads/0abc60a6-733d-464f-9670-262c71b58d8c.png" 
                        alt="Portrait of Mette L."
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Mette L.</p>
                      <p className="text-sm text-gray-600">Digital Marketing Manager</p>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>

            <div className="relative p-6 bg-white shadow-sm rounded-lg">
              <blockquote>
                <p className="text-base font-medium text-gray-900">
                  "Som karriereskifter var det svært at skrive ansøgninger, der viste mine overførbare kompetencer. 
                  CVJob gjorde det muligt at fremhæve mine relevante erfaringer, og jeg har nu fundet job i en ny branche."
                </p>
                <footer className="mt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img 
                        src="/lovable-uploads/ddd2a12f-1253-4b04-9998-642e1cd5366c.png" 
                        alt="Portrait of Anders K."
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Anders K.</p>
                      <p className="text-sm text-gray-600">IT-projektleder</p>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
