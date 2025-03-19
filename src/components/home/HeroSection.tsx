
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
      {/* Background image - using a cover letter related image from Unsplash */}
      <img
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
        alt="Person writing a cover letter"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Dark overlay - lighter opacity */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-sm">
            <div className="flex justify-center items-center mb-6">
              <FileText className="w-20 h-20 text-primary-700" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary-800 sm:text-6xl">
              Ansøgninger skrevet med kunstig intelligens
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              CVJob hjælper dig med at generere personlige og overbevisende ansøgninger
              til job, du er interesseret i. Kom i gang på få minutter.
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
                {session ? "Gemte ansøgninger" : "Se hvordan det virker"} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
