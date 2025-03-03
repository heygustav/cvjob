
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FooterSection from '@/components/home/FooterSection';

const AboutUs = () => {
  // Set document title for SEO
  useEffect(() => {
    document.title = "Om CVJob | Vores Mission og Team | AI-Drevet Jobansøgningsgenerator";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Lær mere om CVJob\'s mission, team og teknologi. Vi hjælper jobsøgende med at skabe overbevisende ansøgninger med kunstig intelligens.');
    }
  }, []);

  return (
    <div className="w-full">
      {/* Semantic header with proper heading hierarchy */}
      <header className="gradient-header text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Om os</h1>
          <p className="text-lg sm:text-xl max-w-3xl">
            Lær mere om vores mission og hvordan vi hjælper jobsøgende med at skabe overbevisende ansøgninger
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <nav aria-label="Brødkrummesti" className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-700 transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            <span>Tilbage til forsiden</span>
          </Link>
        </nav>
        
        <article className="prose prose-lg max-w-none">
          <section className="mb-10" aria-labelledby="mission-heading">
            <h2 id="mission-heading" className="text-2xl font-semibold text-primary-800 mb-4">Vores mission</h2>
            <p className="text-muted-foreground">
              Vi ønsker at gøre jobsøgningsprocessen nemmere og mere effektiv for alle. Med vores AI-drevne platform kan du fokusere på at finde de rigtige job og forberede dig til interviews, i stedet for at bruge timer på at skrive ansøgninger.
            </p>
          </section>
          
          <section className="mb-10" aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-2xl font-semibold text-primary-800 mb-4">Vores team</h2>
            <p className="text-muted-foreground">
              CVJob blev grundlagt i 2023 af en gruppe passionerede teknologientusiaster og HR-specialister, der så et behov for at forbedre jobsøgningsprocessen gennem avanceret teknologi. Vores team består af eksperter inden for kunstig intelligens, naturlig sprogbehandling og rekruttering.
            </p>
          </section>
          
          <section className="mb-10" aria-labelledby="technology-heading">
            <h2 id="technology-heading" className="text-2xl font-semibold text-primary-800 mb-4">Vores teknologi</h2>
            <p className="text-muted-foreground">
              Vi anvender de nyeste modeller inden for sprogbehandling og kunstig intelligens til at analysere jobopslag og skabe personlige ansøgninger, der matcher både jobbet og din profil. Vores system lærer konstant og bliver bedre for hver dag.
            </p>
          </section>
          
          <section className="mb-10" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-2xl font-semibold text-primary-800 mb-4">Kontakt os</h2>
            <p className="text-muted-foreground">
              Har du spørgsmål eller feedback til vores tjeneste? Vi hører gerne fra dig! Du kan kontakte os på <a href="mailto:kontakt@cvjob.dk" className="text-primary hover:underline">kontakt@cvjob.dk</a> eller besøge vores <Link to="/contact" className="text-primary hover:underline">kontaktside</Link>.
            </p>
          </section>
        </article>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default AboutUs;
