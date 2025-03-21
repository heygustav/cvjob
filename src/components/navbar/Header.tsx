
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Icon from "../ui/icon";
import { Button } from '../ui/button';
import { UserCircle, FileText, LogIn, PlusCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { session } = useAuth();

  return (
    <header className="w-full py-4 bg-background border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors">
          <FileText className="h-6 w-6" aria-hidden="true" />
          <span className="text-xl font-semibold">CVJob</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6" aria-label="Hovedmenu">
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
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:underline focus:underline-offset-4"
              >
                Dashboard
              </Link>
              <Button 
                variant="outline" 
                asChild 
                className="border-primary text-primary hover:bg-primary-50 hover:text-primary-700 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Link to="/ansoegning">
                  <PlusCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                  Ny ansøgning
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>Log ind</span>
              </Link>
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors" 
                asChild
              >
                <Link to="/signup">Opret konto</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
