
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';

// Lazy load non-critical components to improve initial load time
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const CTASection = lazy(() => import('../components/home/CTASection'));
const FooterSection = lazy(() => import('../components/home/FooterSection'));

// Better loading placeholder with clear visual feedback
const SectionPlaceholder = () => (
  <div className="w-full py-16 bg-muted/30 animate-pulse flex justify-center items-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" aria-label="Indlæser indhold"></div>
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

const Index = () => {
  // Use optional chaining with session to prevent errors
  const { session } = useAuth() || {};

  // Set document title, meta description and canonical for SEO
  useEffect(() => {
    document.title = "CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Skab professionelle, personlige jobansøgninger på få minutter med CVJob\'s AI-drevne værktøj. Få flere jobsamtaler med mindre indsats.');
    }
    
    // Add canonical link to prevent duplicate content issues
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://cvjob.dk');
    
    // Update open graph tags to match current content
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Skab professionelle, personlige jobansøgninger på få minutter med CVJob\'s AI-drevne værktøj. Spild mindre tid på ansøgninger, få flere jobsamtaler.');
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://cvjob.dk');
    }
  }, []);

  return (
    <div className="bg-background">
      <main>
        {/* Critical components loaded eagerly */}
        <HeroSection session={session} />
        <FeaturesSection />
        
        {/* Non-critical components loaded lazily with intersection observer */}
        <LazyHowItWorksSection session={session} />
        <LazyTestimonialsSection />
        <LazyCTASection session={session} />
      </main>
      <LazyFooterSection />
    </div>
  );
};

export default Index;
