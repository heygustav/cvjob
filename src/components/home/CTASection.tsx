
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  session: any;
}

const CTASection: React.FC<CTASectionProps> = ({ session }) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-primary-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">Klar til at skrive din</span>
                <span className="block">næste jobansøgning?</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-white">
                Start i dag og lad vores værktøj hjælpe dig med at skabe en overbevisende 
                ansøgning, der øger dine chancer for at blive kaldt til samtale.
              </p>
              <div className="mt-10">
                <Button
                  asChild
                  className="bg-white text-primary-700 hover:bg-gray-100 border border-transparent"
                  size="lg"
                >
                  <Link to={session ? "/ansoegning" : "/auth"}>
                    {session ? "Opret ansøgning nu" : "Prøv gratis"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-6 lg:p-8">
            <img
              className="rounded-lg shadow-xl object-cover h-full w-full max-h-80"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80"
              alt="Personer der samarbejder om en jobansøgning"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
