
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { FileText } from 'lucide-react';
import { Button } from '../ui/button';

const Header: React.FC = () => {
  const { session } = useAuth();

  return (
    <header className="w-full py-4 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">CVJob</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
            Hjem
          </Link>
          <Link to="#how-it-works" className="text-sm text-foreground hover:text-primary transition-colors">
            Sådan virker det
          </Link>
          <Link to="#features" className="text-sm text-foreground hover:text-primary transition-colors">
            Funktioner
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link to="/dashboard" className="text-sm text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Button variant="outline" asChild>
                <Link to="/cover-letter">Ny ansøgning</Link>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-foreground hover:text-primary transition-colors">
                Log ind
              </Link>
              <Button asChild>
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
