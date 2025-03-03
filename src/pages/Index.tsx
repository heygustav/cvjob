
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';

// Lazy load non-critical components to improve initial load time
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const CTASection = lazy(() => import('../components/home/CTASection'));
const FooterSection = lazy(() => import('../components/home/FooterSection'));
const IconDemo = lazy(() => import('../components/IconDemo'));

// Better loading placeholder with clear visual feedback
const SectionPlaceholder = () => (
  <div className="w-full py-16 bg-muted/30 animate-pulse flex justify-center items-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Factory function for Intersection Observer based lazy loading
const createLazyComponent = (Component: React.LazyExoticComponent<any>, placeholder = <SectionPlaceholder />) => {
  return ({ ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 } // Start loading when 10% of the element is visible
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.disconnect();
        }
      };
    }, []);

    return (
      <div ref={ref} className="min-h-[100px]">
        {isVisible ? (
          <Suspense fallback={placeholder}>
            <Component {...props} />
          </Suspense>
        ) : placeholder}
      </div>
    );
  };
};

// Create optimized lazy components
const LazyHowItWorksSection = createLazyComponent(HowItWorksSection);
const LazyTestimonialsSection = createLazyComponent(TestimonialsSection);
const LazyCTASection = createLazyComponent(CTASection);
const LazyFooterSection = createLazyComponent(FooterSection);
const LazyIconDemo = createLazyComponent(IconDemo);

const Index = () => {
  const { session } = useAuth();

  // Set document title for SEO
  useEffect(() => {
    document.title = "CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger";
  }, []);

  return (
    <div className="bg-background">
      <main>
        {/* Critical components loaded eagerly */}
        <HeroSection session={session} />
        <FeaturesSection />
        
        {/* Non-critical components loaded lazily with intersection observer */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Vores Optimerede Ikonsystem</h2>
          <p className="text-center text-muted-foreground mb-8">
            Vi anvender et højeffektivt ikonsystem med både statiske og dynamiske indlæsningsstrategier for optimal ydeevne.
          </p>
          <LazyIconDemo />
        </section>
        
        <LazyHowItWorksSection session={session} />
        <LazyTestimonialsSection />
        <LazyCTASection session={session} />
      </main>
      <LazyFooterSection />
    </div>
  );
};

export default Index;
