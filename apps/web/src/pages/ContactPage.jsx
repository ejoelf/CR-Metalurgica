import { useEffect } from 'react';
import ContactSection from '../components/sections/ContactSection.jsx';
import LocationSection from '../components/sections/LocationSection.jsx';
import { updateSeo } from '../utils/seo.js';

export default function ContactPage() {
  useEffect(() => {
    updateSeo({ title: 'Contacto | CF Metal Pintura', description: 'Contacto, WhatsApp, email y ubicación de CF Metal Pintura.' });
  }, []);

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Contacto</span>
          <h1>Hablemos de tu próximo trabajo</h1>
          <p>Dejanos tu consulta o escribinos directo por WhatsApp para coordinar presupuesto, visita o medición.</p>
        </div>
      </section>
      <ContactSection compact />
      <LocationSection />
    </>
  );
}
