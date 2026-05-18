import { useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ProcessSection from '../components/sections/ProcessSection.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import { usePublicGallery } from '../hooks/usePublicGallery.js';
import { updateSeo } from '../utils/seo.js';

export default function WorksPage() {
  const { items, loading } = usePublicGallery();

  useEffect(() => {
    updateSeo({ title: 'Trabajos realizados | CF Metal Pintura', description: 'Trabajos realizados de herrería, portones, estructuras, pintura y cartelería.' });
  }, []);

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Trabajos realizados</span>
          <h1>Proyectos reales, soluciones a medida y terminaciones profesionales</h1>
          <p>Portones, estructuras, cartelería y trabajos integrales desarrollados con oficio y atención al detalle.</p>
        </div>
      </section>

      <section className="section works-section">
        <div className="container">
          <SectionHeader title="Últimos trabajos" description="Trabajos publicados desde el CRM privado de CF Metal-Pintura." />
          {loading && <p className="muted center">Cargando trabajos...</p>}
          <div className="works-grid large">
            {items.map((work) => (
              <article className="work-card" key={work.id || work.title}>
                <div className="work-image" style={{ backgroundImage: `url(${work.image})` }} />
                <div className="work-content">
                  <span>{work.category}</span>
                  <h2>{work.title}</h2>
                  <p>{work.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <ContactSection compact />
    </>
  );
}
