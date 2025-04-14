
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Button } from '../ui/button';
import { UserCircle, FileText, LogIn, PlusCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { session } = useAuth();

  return (
    <header className="w-full py-4 bg-background border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-y-3">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <span className="text-lg sm:text-xl font-semibold whitespace-nowrap">CVJob</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-3 lg:gap-6" aria-label="Hovedmenu">
            <Link 
              to="/" 
              className="text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:underline focus:underline-offset-4"
            >
              Hjem
            </Link>
            <Link 
              to="#how-it-works" 
              className="text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:underline focus:underline-offset-4"
            >
              Sådan virker det
            </Link>
            <Link 
              to="#features" 
              className="text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:underline focus:underline-offset-4"
            >
              Funktioner
            </Link>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4 ml-auto md:ml-0">
            {session ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-xs sm:text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:underline focus:underline-offset-4 whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline" 
                  asChild 
                  size="sm"
                  className="border-primary text-primary hover:bg-primary-50 hover:text-primary-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap"
                >
                  <Link to="/ansoegning">
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" aria-hidden="true" />
                    <span className="text-xs sm:text-sm">Ny ansøgning</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-xs sm:text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span>Log ind</span>
                </Link>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-xs sm:text-sm min-h-[36px] px-2 sm:px-4 whitespace-nowrap" 
                  asChild
                >
                  <Link to="/signup">Opret konto</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
