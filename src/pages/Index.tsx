
import React from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import FooterSection from '../components/home/FooterSection';
import IconDemo from '../components/IconDemo';

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="bg-background">
      <HeroSection session={session} />
      <FeaturesSection />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Optimized Icon System</h2>
        <p className="text-center text-muted-foreground mb-8">
          We use a highly efficient icon loading system with both static and dynamic loading strategies for optimal performance.
        </p>
        <IconDemo />
      </div>
      <HowItWorksSection session={session} />
      <TestimonialsSection />
      <CTASection session={session} />
      <FooterSection />
    </div>
  );
};

export default Index;
