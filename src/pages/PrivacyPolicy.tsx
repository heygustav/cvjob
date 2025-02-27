
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/" className="inline-flex items-center text-primary hover:text-primary-700 mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Tilbage til forsiden
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tight text-primary-800 mb-6">Privatlivspolitik</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4 text-muted-foreground text-lg">
          Hos Winston AI tager vi beskyttelsen af dine personoplysninger alvorligt. Denne privatlivspolitik forklarer, hvordan vi indsamler, bruger og beskytter dine data.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Dataansvarlig</h2>
        <p className="mb-4 text-muted-foreground">
          Winston AI ApS er dataansvarlig for behandlingen af de personoplysninger, som vi har modtaget om dig. Hvis du har spørgsmål til vores behandling af dine personoplysninger, er du altid velkommen til at kontakte os på <a href="mailto:privacy@winstonai.dk" className="text-primary hover:underline">privacy@winstonai.dk</a>.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Hvilke data indsamler vi?</h2>
        <p className="mb-4 text-muted-foreground">
          Vi indsamler følgende personoplysninger:
        </p>
        <ul className="list-disc pl-6 mb-4 text-muted-foreground">
          <li>Navn og kontaktoplysninger (email, telefonnummer)</li>
          <li>Professionel information (CV, tidligere erfaringer, færdigheder)</li>
          <li>Indholdet af jobopslag, som du uploader</li>
          <li>De genererede ansøgninger</li>
          <li>Information om din brug af vores tjeneste</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Formål med databehandlingen</h2>
        <p className="mb-4 text-muted-foreground">
          Vi behandler dine personoplysninger til følgende formål:
        </p>
        <ul className="list-disc pl-6 mb-4 text-muted-foreground">
          <li>At levere vores AI-drevne ansøgningstjeneste til dig</li>
          <li>At forbedre og personliggøre vores produkter og tjenester</li>
          <li>At kommunikere med dig om vores tjenester</li>
          <li>At overholde lovmæssige forpligtelser</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Dataopbevaring</h2>
        <p className="mb-4 text-muted-foreground">
          Vi opbevarer dine personoplysninger, så længe du har en aktiv konto hos os. Hvis du sletter din konto, vil vi slette eller anonymisere dine personoplysninger inden for 30 dage, medmindre lovgivningen kræver, at vi opbevarer dem længere.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Dine rettigheder</h2>
        <p className="mb-4 text-muted-foreground">
          Du har følgende rettigheder i forhold til vores behandling af dine personoplysninger:
        </p>
        <ul className="list-disc pl-6 mb-4 text-muted-foreground">
          <li>Ret til indsigt i dine personoplysninger</li>
          <li>Ret til berigtigelse af unøjagtige personoplysninger</li>
          <li>Ret til sletning af dine personoplysninger</li>
          <li>Ret til begrænsning af behandling</li>
          <li>Ret til dataportabilitet</li>
          <li>Ret til at gøre indsigelse mod behandling af dine personoplysninger</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">Ændringer til privatlivspolitikken</h2>
        <p className="mb-8 text-muted-foreground">
          Vi opdaterer jævnligt vores privatlivspolitik for at afspejle ændringer i vores praksis og tjenester. Vi opfordrer dig til regelmæssigt at gennemgå denne privatlivspolitik for at holde dig informeret om, hvordan vi beskytter dine oplysninger.
        </p>
        
        <p className="text-sm text-muted-foreground">
          Sidst opdateret: 28. juni 2023
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
