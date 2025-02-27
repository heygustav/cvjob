
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Sparkles, ChevronRight, FileUp, Briefcase, PenTool } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import CavalierDog from '../components/CavalierDog';

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="bg-background">
      {/* Hero section - with adjusted background color */}
      <div className="relative isolate pt-6 bg-background">
        <div className="py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex justify-center items-center mb-6">
                <CavalierDog className="w-20 h-20 text-primary-700" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-primary-800 sm:text-6xl">
                Ansøgninger skrevet med kunstig intelligens
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Winston AI hjælper dig med at generere personlige og overbevisende ansøgninger
                til job, du er interesseret i. Kom i gang på få minutter.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {session ? (
                  <Link
                    to="/generator"
                    className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Opret ansøgning
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Kom i gang
                  </Link>
                )}
                <Link
                  to={session ? "/dashboard" : "#how-it-works"}
                  className="text-sm font-semibold leading-6 text-primary hover:text-primary-700 transition-colors"
                >
                  {session ? "Gemte ansøgninger" : "Se hvordan det virker"} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section - with softgray background and improved contrast */}
      <div className="py-16 sm:py-24 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-left">
            <h2 className="text-base font-semibold leading-7 text-primary-700">
              Spar tid på jobsøgningen
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">
              Fokusér på de rigtige jobs, ikke på at skrive ansøgninger
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Med vores avancerede AI-teknologi kan du hurtigt generere målrettede ansøgninger,
              der matcher jobopslaget og fremhæver dine relevante kompetencer.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-primary-800">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Skræddersyede ansøgninger
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  Vores AI analyserer jobopslaget og genererer en personlig ansøgning,
                  der matcher virksomhedens behov og fremhæver dine relevante kompetencer.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-primary-800">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                    <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Simpel og intuitiv
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  Kopier og indsæt jobopslaget, angiv din profil, og få en færdig
                  ansøgning på få sekunder. Det har aldrig været nemmere.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-primary-800">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                    <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Avanceret AI-teknologi
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  Vi anvender de nyeste modeller inden for kunstig intelligens til at
                  generere overbevisende og personlige ansøgninger i høj kvalitet.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-primary-800">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  Organisér dine ansøgninger
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  Gem alle dine jobopslag og ansøgninger ét sted, så du nemt kan følge
                  med i din jobsøgningsproces og genbruge indhold.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it works section - Primary background with center-aligned items */}
      <div id="how-it-works" className="bg-primary-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-100">
              Sådan fungerer det
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tre simple trin til din næste jobansøgning
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <ol className="grid gap-10 lg:grid-cols-3">
              <li className="relative flex flex-col items-center">
                <div className="rounded-full bg-white p-4 text-primary-800">
                  <FileUp className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white text-center">
                  Indsæt jobopslaget
                </h3>
                <p className="mt-2 text-base text-primary-100 text-center">
                  Kopier og indsæt hele jobopslaget eller de vigtigste dele. Vores AI vil
                  automatisk identificere nøgleoplysninger.
                </p>
              </li>
              <li className="relative flex flex-col items-center">
                <div className="rounded-full bg-white p-4 text-primary-800">
                  <Briefcase className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white text-center">
                  Tilpas din profil
                </h3>
                <p className="mt-2 text-base text-primary-100 text-center">
                  Udfyld din profil med dine kvalifikationer, erfaringer og kompetencer.
                  Jo mere detaljeret, desto bedre bliver din ansøgning.
                </p>
              </li>
              <li className="relative flex flex-col items-center">
                <div className="rounded-full bg-white p-4 text-primary-800">
                  <PenTool className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white text-center">
                  Modtag din ansøgning
                </h3>
                <p className="mt-2 text-base text-primary-100 text-center">
                  Vores AI genererer en skræddersyet ansøgning, som du kan redigere,
                  gemme og downloade. Klar til at sende til din næste potentielle arbejdsgiver.
                </p>
              </li>
            </ol>
            <div className="mt-16 text-center">
              <Link
                to={session ? "/generator" : "/auth"}
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-800 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {session ? "Opret ansøgning" : "Opret konto og start"} <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials section - White background with centered content */}
      <div className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary-800 text-center">
              Hvad vores brugere siger
            </h2>
            <figure className="mt-12">
              <blockquote className="text-center text-xl font-semibold leading-8 text-foreground sm:text-2xl sm:leading-9">
                <p>
                  "Efter at have brugt Winston AI fik jeg tre jobsamtaler på en uge.
                  Ansøgningerne var så personlige og relevante, at rekrutteringsansvarlige
                  troede, jeg havde brugt timer på at skrive dem."
                </p>
              </blockquote>
              <figcaption className="mt-10">
                <div className="mx-auto flex items-center justify-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary-700 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">ML</span>
                  </div>
                  <div className="text-left">
                    <div className="text-base font-semibold text-primary-800">Mette L.</div>
                    <div className="text-sm text-muted-foreground">Digital Marketing Manager</div>
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* CTA section - Primary background with centered content */}
      <div className="bg-primary-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Klar til at skrive din næste jobansøgning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Kom i gang med Winston AI i dag og lad vores AI hjælpe dig med at få dit drømmejob.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to={session ? "/generator" : "/auth"}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-800 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {session ? "Lav din første ansøgning" : "Tilmeld dig gratis"}
              </Link>
              <Link
                to="#how-it-works"
                className="text-sm font-semibold leading-6 text-primary-100 hover:text-white transition-colors"
              >
                Læs mere <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - White background */}
      <footer className="bg-background py-16">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 lg:px-8">
          <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div className="pb-6">
              <Link to="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                Om os
              </Link>
            </div>
            <div className="pb-6">
              <Link to="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                Privatlivspolitik
              </Link>
            </div>
            <div className="pb-6">
              <Link to="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                Vilkår og betingelser
              </Link>
            </div>
            <div className="pb-6">
              <Link to="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
            </div>
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
            &copy; 2023 Winston AI. Alle rettigheder forbeholdes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
