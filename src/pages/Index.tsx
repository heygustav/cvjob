
import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import { Session } from '@supabase/supabase-js';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

// Lazy load non-critical components with better error handling
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

// Optimized LazyComponent with IntersectionObserver
const LazyComponent = ({ component: Component, threshold = 0.1, rootMargin = '100px', ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true); // Fallback for browsers that don't support IntersectionObserver
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className="min-h-[100px]">
      {isVisible ? (
        <Suspense fallback={<SectionPlaceholder />}>
          <Component {...props} />
        </Suspense>
      ) : <SectionPlaceholder />}
    </div>
  );
};

// Interface for section props
interface SectionProps {
  session?: Session | null;
}

const Index = () => {
  const { session } = useAuth() || {};
  const { logTiming } = usePerformanceMonitoring({
    componentName: 'IndexPage',
    logRender: true,
    logMount: true
  });

  // Simplified SEO updates
  useEffect(() => {
    logTiming('Starting SEO updates');
    document.title = "CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger";
    
    const metaTags = [
      { selector: 'meta[name="description"]', attr: 'content', value: 'Skab professionelle, personlige jobansøgninger på få minutter med CVJob\'s AI-drevne værktøj. Få flere jobsamtaler med mindre indsats.' },
      { selector: 'link[rel="canonical"]', attr: 'href', value: 'https://cvjob.dk' },
      { selector: 'meta[property="og:title"]', attr: 'content', value: 'CVJob | AI-Drevet Jobansøgningsgenerator til Personlige Ansøgninger' },
      { selector: 'meta[property="og:description"]', attr: 'content', value: 'Skab professionelle, personlige jobansøgninger på få minutter med CVJob\'s AI-drevne værktøj. Spild mindre tid på ansøgninger, få flere jobsamtaler.' },
      { selector: 'meta[property="og:url"]', attr: 'content', value: 'https://cvjob.dk' }
    ];
    
    // Apply meta tags in a more efficient way
    metaTags.forEach(({ selector, attr, value }) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement(selector.includes('link') ? 'link' : 'meta');
        if (selector.includes('property=')) {
          tag.setAttribute('property', selector.match(/property="([^"]+)"/)![1]);
        } else if (selector.includes('name=')) {
          tag.setAttribute('name', selector.match(/name="([^"]+)"/)![1]);
        } else if (selector.includes('rel=')) {
          tag.setAttribute('rel', 'canonical');
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    });
    
    logTiming('SEO updates completed');
  }, [logTiming]);

  // Memoize session for performance
  const memoizedSession = useMemo(() => session, [session]);

  return (
    <div className="bg-background">
      <main>
        {/* Critical components loaded eagerly */}
        <HeroSection session={memoizedSession} />
        <FeaturesSection />
        
        {/* Non-critical components loaded lazily with optimized loader */}
        <LazyComponent component={HowItWorksSection} session={memoizedSession} />
        <LazyComponent component={TestimonialsSection} />
        <LazyComponent component={CTASection} session={memoizedSession} />
      </main>
      <LazyComponent component={FooterSection} rootMargin="200px" />
    </div>
  );
};

export default Index;
