
import React, { lazy, Suspense, useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import Navbar from '../components/navbar/Navbar';
import { Session } from '@supabase/supabase-js';

// Lazy load non-critical components
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
const createLazyComponent = (Component: React.LazyExoticComponent<any>) => {
  return memo(({ ...props }: Record<string, any>) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    // Setup intersection observer only once
    useEffect(() => {
      if (!ref.current) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { 
          threshold: 0.1,
          rootMargin: '100px' // Load when element is 100px from viewport
        }
      );
      
      observer.observe(ref.current);
      
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={ref} className="min-h-[100px]">
        {isVisible ? (
          <Suspense fallback={<SectionPlaceholder />}>
            <Component {...props} />
          </Suspense>
        ) : <SectionPlaceholder />}
      </div>
    );
  });
};

// Create optimized lazy components
const LazyHowItWorksSection = createLazyComponent(HowItWorksSection);
const LazyTestimonialsSection = createLazyComponent(TestimonialsSection);
const LazyCTASection = createLazyComponent(CTASection);
const LazyFooterSection = createLazyComponent(FooterSection);

// Define props interfaces for components
interface SectionProps {
  session?: Session | null;
}

// Memoize the entire component for better performance
const Index = memo(() => {
  // Use optional chaining with session to prevent errors
  const { session } = useAuth() || {};

  // Set document title, meta description and canonical for SEO
  useEffect(() => {
    // SEO updates - only run once
    document.title = "CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger";
    
    // Set meta tags in a more efficient way
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement(selector === 'link[rel="canonical"]' ? 'link' : 'meta');
        if (selector.includes('property=')) {
          tag.setAttribute('property', selector.match(/property="([^"]+)"/)![1]);
        } else if (selector.includes('name=')) {
          tag.setAttribute('name', selector.match(/name="([^"]+)"/)![1]);
        } else if (selector.includes('rel=')) {
          tag.setAttribute('rel', 'canonical');
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attribute, value);
    };
    
    // Update all meta tags at once
    updateMetaTag('meta[name="description"]', 'content', 'Skab professionelle, personlige jobansøgninger på få minutter med CVJob\'s AI-drevne værktøj. Få flere jobsamtaler med mindre indsats.');
    updateMetaTag('link[rel="canonical"]', 'href', 'https://cvjob.dk');
    updateMetaTag('meta[property="og:title"]', 'content', 'CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger');
    updateMetaTag('meta[property="og:description"]', 'content', 'Skab professionelle, personlige jobansøgninger på få minutter med CVJob\'s AI-drevne værktøj. Spild mindre tid på ansøgninger, få flere jobsamtaler.');
    updateMetaTag('meta[property="og:url"]', 'content', 'https://cvjob.dk');
  }, []);

  // Memoize the session prop to prevent unnecessary re-renders
  const sessionProp = useMemo(() => session, [session]);

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        {/* Critical components loaded eagerly */}
        <HeroSection session={sessionProp} />
        <FeaturesSection />
        
        {/* Non-critical components loaded lazily with intersection observer */}
        <LazyHowItWorksSection session={sessionProp} />
        <LazyTestimonialsSection />
        <LazyCTASection session={sessionProp} />
      </main>
      <LazyFooterSection />
    </div>
  );
});

// Add displayName for debugging
Index.displayName = 'IndexPage';

export default Index;
