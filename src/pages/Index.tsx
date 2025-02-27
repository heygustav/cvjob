
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Sparkles, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-black bg-gray-100 rounded-full">
              <span className="inline-flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                AI-drevet Jobansøgningssystem
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              <span className="block">Få dit drømmejob med</span>
              <span className="block">Personlige Ansøgninger</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              JobMagic hjælper dig med at skabe perfekte danske ansøgninger ved hjælp af AI, tilpasset hvert jobopslag. Forenkl din jobsøgning og øg dine chancer for at blive bemærket.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                Kom i gang gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 font-medium text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Log ind
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sådan fungerer JobMagic</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Vores AI-drevne platform effektiviserer din ansøgningsproces med disse enkle trin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-gray-800" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Indtast jobdetaljer</h3>
                <p className="text-gray-600">
                  Indsæt blot jobopslaget, du er interesseret i at søge, og vores system vil automatisk udtrække nøgleinformation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-gray-800" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Ansøgningsgenerering</h3>
                <p className="text-gray-600">
                  Vores avancerede AI analyserer jobopslaget og kombinerer det med din profil for at generere en skræddersyet, professionel dansk ansøgning.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-gray-800" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Spar tid og ansøg</h3>
                <p className="text-gray-600">
                  Rediger den genererede ansøgning efter behov, gem den til fremtidig reference, og send den med din ansøgning for at øge dine chancer for at få en samtale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial/CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto glass-morphism rounded-2xl p-8 md:p-12 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-3/5">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  Klar til at forenkle din jobansøgningsproces?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Bliv en del af de tusindvis af jobsøgende, der har effektiviseret deres ansøgningsproces med JobMagics AI-drevne ansøgningsgenerator.
                </p>
                <Link
                  to="/signup"
                  className="px-6 py-3 inline-flex items-center font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Opret din gratis konto
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-2/5 relative md:-right-12 animate-float">
                <div className="bg-white rounded-xl p-6 shadow-lg transform rotate-2 neo-morphism">
                  <blockquote className="text-gray-700 italic">
                    "JobMagic sparede mig timevis af tid på at udarbejde ansøgninger. Jeg modtog flere invitationer til samtaler på to uger, end jeg havde fået de foregående to måneder!"
                  </blockquote>
                  <p className="text-right mt-4 text-sm font-medium">— Sarah K., Softwareudvikler</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-semibold text-gray-900">JobMagic</span>
            <p className="text-sm text-gray-600 mt-1">© 2023 JobMagic. Alle rettigheder forbeholdes.</p>
          </div>
          <div className="flex space-x-8">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Privatlivspolitik
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Vilkår for brug
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Kontakt os
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
