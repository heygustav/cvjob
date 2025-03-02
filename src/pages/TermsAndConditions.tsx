
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FooterSection from '@/components/home/FooterSection';

const TermsAndConditions = () => {
  return (
    <div className="w-full">
      <div className="gradient-header text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Vilkår og betingelser</h1>
          <p className="text-lg sm:text-xl max-w-3xl">
            Betingelser for brug af vores platform og tjenester
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-700 mb-6 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Tilbage til forsiden
        </Link>
        
        <div className="prose max-w-none">
          <p className="mb-4 text-muted-foreground text-lg">
            Velkommen til Winston AI. Ved at bruge vores tjenester accepterer du følgende vilkår og betingelser.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">1. Acceptering af vilkår</h2>
          <p className="mb-4 text-muted-foreground">
            Ved at oprette en konto og bruge Winston AI's tjenester, accepterer du at være bundet af disse vilkår og betingelser. Hvis du ikke accepterer disse vilkår, bør du ikke bruge vores tjenester.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">2. Tjenestebeskrivelse</h2>
          <p className="mb-4 text-muted-foreground">
            Winston AI leverer en AI-drevet platform til generering af jobansøgninger baseret på brugerens profil og jobopslag. Vi garanterer ikke, at vores tjeneste vil resultere i jobsamtaler eller ansættelse.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">3. Brugeransvar</h2>
          <p className="mb-4 text-muted-foreground">
            Som bruger af Winston AI er du ansvarlig for:
          </p>
          <ul className="list-disc pl-6 mb-4 text-muted-foreground">
            <li>At give nøjagtige og sandfærdige oplysninger om dig selv</li>
            <li>At sikre, at de genererede ansøgninger er korrekte før indsendelse</li>
            <li>At overholde alle gældende love og regler i din jurisdiktion</li>
            <li>At beskytte dine kontooplysninger og adgangskoder</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">4. Intellektuel ejendomsret</h2>
          <p className="mb-4 text-muted-foreground">
            De ansøgninger, der genereres gennem vores tjeneste, tilhører dig. Du må dog ikke kopiere, modificere eller distribuere vores software, kode eller indhold uden vores udtrykkelige tilladelse.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">5. Betaling og abonnement</h2>
          <p className="mb-4 text-muted-foreground">
            Winston AI tilbyder både gratis og betalte abonnementer. For betalte abonnementer gælder følgende:
          </p>
          <ul className="list-disc pl-6 mb-4 text-muted-foreground">
            <li>Betalinger opkræves forud for abonnementsperioden</li>
            <li>Abonnementer fornyes automatisk, medmindre du opsiger dit abonnement</li>
            <li>Du kan opsige dit abonnement når som helst, men refundering gives kun i henhold til vores refunderingspolitik</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">6. Ansvarsbegrænsning</h2>
          <p className="mb-4 text-muted-foreground">
            Winston AI er ikke ansvarlig for eventuelle direkte, indirekte, hændelige, følge- eller særlige skader, der opstår som følge af din brug af vores tjenester, inklusive men ikke begrænset til tab af data, indtægter eller profit.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">7. Opsigelse</h2>
          <p className="mb-4 text-muted-foreground">
            Vi forbeholder os retten til at opsige eller suspendere din adgang til vores tjenester uden varsel ved overtrædelse af disse vilkår eller af andre årsager efter vores skøn.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-800 mt-8 mb-4">8. Ændringer af vilkår</h2>
          <p className="mb-8 text-muted-foreground">
            Vi kan ændre disse vilkår til enhver tid. Fortsætter du med at bruge vores tjenester efter sådanne ændringer, anses det som accept af de nye vilkår.
          </p>
          
          <p className="text-sm text-muted-foreground">
            Sidst opdateret: 28. juni 2023
          </p>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
};

export default TermsAndConditions;
