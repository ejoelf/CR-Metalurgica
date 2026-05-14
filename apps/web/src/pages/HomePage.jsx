import { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import ServicesSection from '../components/sections/ServicesSection.jsx';
import WorksSection from '../components/sections/WorksSection.jsx';
import ProcessSection from '../components/sections/ProcessSection.jsx';
import BenefitsSection from '../components/sections/BenefitsSection.jsx';
import TestimonialsSection from '../components/sections/TestimonialsSection.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import LocationSection from '../components/sections/LocationSection.jsx';
import { updateSeo } from '../utils/seo.js';

export default function HomePage() {
  useEffect(() => {
    updateSeo({
      title: 'CF Metal Pintura | Soluciones integrales para tu obra',
      description: 'Herrería, metalúrgica, pintura, durlock y electricidad en Las Higueras y Río Cuarto.',
    });
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WorksSection />
      <ProcessSection />
      <BenefitsSection />
      <TestimonialsSection />
      <ContactSection />
      <LocationSection />
    </>
  );
}
