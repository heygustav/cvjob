
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface HeroSectionProps {
  session: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ session }) => {
  return (
    <div 
      className="relative w-full h-[600px] overflow-hidden" 
    >
      {/* Background image - using a more professional office/workplace image from Unsplash */}
      <img
        src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1920&q=80"
        alt="Professionelt kontormiljø"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Dark overlay - lighter opacity for clarity */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-md">
            <div className="flex justify-center items-center mb-6">
              <FileText className="w-16 h-16 text-primary-700" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Professionelle ansøgninger skrevet med AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              CVJob hjælper dig med at skabe målrettede og overbevisende ansøgninger
              til de stillinger, du søger. Kom godt i gang med jobsøgningen.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {session ? (
                <Link
                  to="/ansoegning"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Opret ansøgning
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Kom i gang
                </Link>
              )}
              <Link
                to={session ? "/dashboard" : "#how-it-works"}
                className="text-sm font-semibold leading-6 text-primary hover:text-primary-700 transition-colors"
              >
                {session ? "Se dine ansøgninger" : "Sådan fungerer det"} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
