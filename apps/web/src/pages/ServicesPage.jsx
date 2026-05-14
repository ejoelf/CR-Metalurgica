import { useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import { services } from '../data/siteData.js';
import { updateSeo } from '../utils/seo.js';

export default function ServicesPage() {
  useEffect(() => {
    updateSeo({ title: 'Servicios | CF Metal Pintura', description: 'Servicios de metalúrgica, pintura, durlock y electricidad.' });
  }, []);

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Servicios</span>
          <h1>Soluciones completas para obra, hogar y comercio</h1>
          <p>Trabajos a medida, fabricación, mantenimiento, terminaciones y soporte técnico en distintas áreas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Áreas de trabajo" description="Cada servicio puede combinarse para resolver proyectos integrales." />
          <div className="services-grid detailed">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.slug}>
                  <div className="service-icon"><Icon size={30} /></div>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <ul>
                    <li>Relevamiento y asesoramiento inicial.</li>
                    <li>Presupuesto claro según materiales y mano de obra.</li>
                    <li>Coordinación de tiempos y entrega.</li>
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ContactSection compact />
    </>
  );
}
