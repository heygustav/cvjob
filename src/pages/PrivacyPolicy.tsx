
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FooterSection from '@/components/home/FooterSection';

const PrivacyPolicy = () => {
  return (
    <div className="w-full">
      <div className="gradient-header text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Privatlivspolitik</h1>
          <p className="text-lg sm:text-xl max-w-3xl">
            Information om hvordan vi beskytter og behandler dine personlige data
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-700 mb-6 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Tilbage til forsiden
        </Link>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Hos Winston AI tager vi beskyttelsen af dine personoplysninger alvorligt. Denne privatlivspolitik forklarer, hvordan vi indsamler, bruger og beskytter dine data.
          </p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Dataansvarlig</h2>
            <p className="text-muted-foreground">
              Winston AI ApS er dataansvarlig for behandlingen af de personoplysninger, som vi har modtaget om dig. Hvis du har spørgsmål til vores behandling af dine personoplysninger, er du altid velkommen til at kontakte os på <a href="mailto:privacy@winstonai.dk" className="text-primary hover:underline">privacy@winstonai.dk</a>.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Hvilke data indsamler vi?</h2>
            <p className="text-muted-foreground mb-2">
              Vi indsamler følgende personoplysninger:
            </p>
            <ul className="space-y-2 text-muted-foreground pl-5">
              <li>Navn og kontaktoplysninger (email, telefonnummer)</li>
              <li>Professionel information (CV, tidligere erfaringer, færdigheder)</li>
              <li>Indholdet af jobopslag, som du uploader</li>
              <li>De genererede ansøgninger</li>
              <li>Information om din brug af vores tjeneste</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Formål med databehandlingen</h2>
            <p className="text-muted-foreground mb-2">
              Vi behandler dine personoplysninger til følgende formål:
            </p>
            <ul className="space-y-2 text-muted-foreground pl-5">
              <li>At levere vores AI-drevne ansøgningstjeneste til dig</li>
              <li>At forbedre og personliggøre vores produkter og tjenester</li>
              <li>At kommunikere med dig om vores tjenester</li>
              <li>At overholde lovmæssige forpligtelser</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Dataopbevaring</h2>
            <p className="text-muted-foreground">
              Vi opbevarer dine personoplysninger, så længe du har en aktiv konto hos os. Hvis du sletter din konto, vil vi slette eller anonymisere dine personoplysninger inden for 30 dage, medmindre lovgivningen kræver, at vi opbevarer dem længere.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Dine rettigheder</h2>
            <p className="text-muted-foreground mb-2">
              Du har følgende rettigheder i forhold til vores behandling af dine personoplysninger:
            </p>
            <ul className="space-y-2 text-muted-foreground pl-5">
              <li>Ret til indsigt i dine personoplysninger</li>
              <li>Ret til berigtigelse af unøjagtige personoplysninger</li>
              <li>Ret til sletning af dine personoplysninger</li>
              <li>Ret til begrænsning af behandling</li>
              <li>Ret til dataportabilitet</li>
              <li>Ret til at gøre indsigelse mod behandling af dine personoplysninger</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Ændringer til privatlivspolitikken</h2>
            <p className="text-muted-foreground">
              Vi opdaterer jævnligt vores privatlivspolitik for at afspejle ændringer i vores praksis og tjenester. Vi opfordrer dig til regelmæssigt at gennemgå denne privatlivspolitik for at holde dig informeret om, hvordan vi beskytter dine oplysninger.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground mt-12 pt-4 border-t border-gray-200">
            Sidst opdateret: 28. juni 2023
          </p>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;
