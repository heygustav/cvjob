
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  session: any;
}

const CTASection: React.FC<CTASectionProps> = ({ session }) => {
  return (
    <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Klar til at skrive din næste jobansøgning?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
            Kom i gang med CVJob i dag og lad vores AI hjælpe dig med at få dit drømmejob.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              asChild
              className="bg-white text-primary-800 hover:bg-gray-100"
              size="lg"
            >
              <Link to={session ? "/ansoegning" : "/signup"}>
                {session ? "Lav din første ansøgning" : "Tilmeld dig gratis"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/blog"
              className="text-sm font-semibold leading-6 text-primary-100 hover:text-white transition-colors flex items-center"
            >
              Læs mere <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
