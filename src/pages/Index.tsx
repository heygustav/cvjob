
import React from 'react';
import { useAuth } from '../components/AuthProvider';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import FooterSection from '../components/home/FooterSection';

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="bg-background">
      <HeroSection session={session} />
      <FeaturesSection />
      <HowItWorksSection session={session} />
      <TestimonialsSection />
      <CTASection session={session} />
      <FooterSection />
    </div>
  );
};

export default Index;
