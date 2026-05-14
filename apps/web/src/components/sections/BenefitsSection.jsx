import SectionHeader from '../common/SectionHeader.jsx';
import { benefits } from '../../data/siteData.js';

export default function BenefitsSection() {
  return (
    <section className="section benefits-section">
      <div className="container">
        <SectionHeader
          eyebrow="Por qué elegirnos"
          title="Oficio, responsabilidad y terminaciones profesionales"
          description="CF Metal Pintura combina experiencia práctica con una nueva forma de gestión digital preparada para ordenar presupuestos, trabajos y seguimiento."
        />

        <div className="benefits-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article className="benefit-card" key={benefit.title}>
                <Icon size={28} />
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
