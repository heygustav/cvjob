
import React, { lazy, Suspense } from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';

// Lazy load non-critical components to improve initial load time
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const CTASection = lazy(() => import('../components/home/CTASection'));
const FooterSection = lazy(() => import('../components/home/FooterSection'));
const IconDemo = lazy(() => import('../components/IconDemo'));

// Simple loading placeholder for lazy-loaded components
const SectionPlaceholder = () => (
  <div className="w-full py-16 bg-muted/30 animate-pulse flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="bg-background">
      {/* Critical components loaded eagerly */}
      <HeroSection session={session} />
      <FeaturesSection />
      
      {/* Non-critical components loaded lazily */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Optimized Icon System</h2>
        <p className="text-center text-muted-foreground mb-8">
          We use a highly efficient icon loading system with both static and dynamic loading strategies for optimal performance.
        </p>
        <Suspense fallback={<SectionPlaceholder />}>
          <IconDemo />
        </Suspense>
      </div>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <HowItWorksSection session={session} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <CTASection session={session} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <FooterSection />
      </Suspense>
    </div>
  );
};

export default Index;
