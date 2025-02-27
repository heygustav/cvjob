
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/" className="inline-flex items-center text-primary hover:text-primary-700 mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Tilbage til forsiden
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tight text-primary-800 mb-6">Om os</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4 text-muted-foreground text-lg">
          Winston AI er en dansk virksomhed, der har specialiseret sig i at hjælpe jobsøgende med at skabe overbevisende jobansøgninger ved hjælp af kunstig intelligens.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Vores mission</h2>
        <p className="mb-4 text-muted-foreground">
          Vi ønsker at gøre jobsøgningsprocessen nemmere og mere effektiv for alle. Med vores AI-drevne platform kan du fokusere på at finde de rigtige job og forberede dig til interviews, i stedet for at bruge timer på at skrive ansøgninger.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Vores team</h2>
        <p className="mb-4 text-muted-foreground">
          Winston AI blev grundlagt i 2023 af en gruppe passionerede teknologientusiaster og HR-specialister, der så et behov for at forbedre jobsøgningsprocessen gennem avanceret teknologi. Vores team består af eksperter inden for kunstig intelligens, naturlig sprogbehandling og rekruttering.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Vores teknologi</h2>
        <p className="mb-4 text-muted-foreground">
          Vi anvender de nyeste modeller inden for sprogbehandling og kunstig intelligens til at analysere jobopslag og skabe personlige ansøgninger, der matcher både jobbet og din profil. Vores system lærer konstant og bliver bedre for hver dag.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Kontakt os</h2>
        <p className="mb-8 text-muted-foreground">
          Har du spørgsmål eller feedback til vores tjeneste? Vi hører gerne fra dig! Du kan kontakte os på <a href="mailto:kontakt@winstonai.dk" className="text-primary hover:underline">kontakt@winstonai.dk</a> eller besøge vores <Link to="/kontakt" className="text-primary hover:underline">kontaktside</Link>.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
