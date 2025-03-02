
import React from 'react';
import { Link } from 'react-router-dom';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <nav className="grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-4 sm:pb-6">
            <Link to="/about" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
              Om os
            </Link>
          </div>
          <div className="pb-4 sm:pb-6">
            <Link to="/privacy" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
              Privatlivspolitik
            </Link>
          </div>
          <div className="pb-4 sm:pb-6">
            <Link to="/terms" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
              Vilkår og betingelser
            </Link>
          </div>
          <div className="pb-4 sm:pb-6">
            <Link to="/contact" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} CVJob.dk
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
