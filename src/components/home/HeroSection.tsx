
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  session: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ session }) => {
  return (
    <section 
      className="relative w-full min-h-[600px] overflow-hidden" 
      aria-labelledby="hero-heading"
    >
      {/* Background image with responsive sizes, lazy loading and proper alt text */}
      <picture>
        <source 
          media="(min-width: 1024px)" 
          srcSet="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1920&q=80" 
        />
        <source 
          media="(min-width: 640px)" 
          srcSet="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1280&q=80" 
        />
        <img
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
          fetchPriority="high"
          aria-hidden="true"
        />
      </picture>
      
      {/* Dark overlay with improved contrast for accessibility */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex justify-center items-center mb-6" aria-hidden="true">
              <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
            </div>
            <h1 
              id="hero-heading" 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-800 dark:text-primary-200"
            >
              Ansøgninger skrevet med kunstig intelligens
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-8 text-muted-foreground dark:text-gray-300">
              CVJob hjælper dig med at generere personlige og overbevisende ansøgninger
              til job, du er interesseret i. Kom i gang på få minutter.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              {session ? (
                <Button
                  asChild
                  size="lg"
                  mobileFriendly
                  className="w-full sm:w-auto"
                >
                  <Link to="/ansoegning">
                    Opret ansøgning
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  mobileFriendly
                  className="w-full sm:w-auto"
                >
                  <Link to="/auth">
                    Kom i gang
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="ghost"
                className="w-full sm:w-auto"
              >
                <Link
                  to={session ? "/dashboard" : "#how-it-works"}
                  className="group flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-700 transition-colors"
                >
                  {session ? "Gemte ansøgninger" : "Se hvordan det virker"} 
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
