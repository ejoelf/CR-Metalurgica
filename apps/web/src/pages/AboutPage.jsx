import { useEffect } from 'react';
import BenefitsSection from '../components/sections/BenefitsSection.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import { businessInfo } from '../data/siteData.js';
import { updateSeo } from '../utils/seo.js';

export default function AboutPage() {
  useEffect(() => {
    updateSeo({ title: 'Nosotros | CF Metal-Pintura', description: 'Conoce la historia y forma de trabajo de CF Metal-Pintura.' });
  }, []);

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Nosotros</span>
          <h1>Oficio, compromiso y soluciones integrales para cada obra</h1>
          <p>{businessInfo.description}</p>
        </div>
      </section>

      <section className="section about-page-section">
        <div className="container about-grid about-grid-single">
          <div className="about-copy about-copy-wide">
            <span className="eyebrow">CF Metal-Pintura</span>
            <h2>Una forma de trabajar basada en confianza y responsabilidad</h2>
            <p>
              En CF Metal-Pintura trabajamos brindando soluciones integrales en metalurgica, pintura, durlock y electricidad.
              Cada proyecto se encara con atencion al detalle, comunicacion directa y foco en lograr un resultado funcional y prolijo.
            </p>
            <p>
              El objetivo es acompanar al cliente desde la primera consulta hasta la entrega final, ordenando medidas, materiales,
              tiempos y presupuesto para que cada trabajo avance con claridad.
            </p>
            <p>
              Priorizamos una atencion cercana, presupuestos claros y trabajos realizados con compromiso, cuidando cada etapa para
              entregar soluciones duraderas y adaptadas a la necesidad real de cada cliente.
            </p>
          </div>
        </div>
      </section>

      <BenefitsSection />
      <ContactSection compact />
    </>
  );
}
