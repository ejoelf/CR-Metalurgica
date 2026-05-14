import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader.jsx';
import { services } from '../../data/siteData.js';

export default function ServicesSection() {
  return (
    <section className="section services-section">
      <div className="container">
        <SectionHeader
          eyebrow="Servicios"
          title="Soluciones integrales para obra y espacios a medida"
          description="Unimos metalúrgica, pintura, durlock y electricidad para resolver proyectos completos con una sola coordinación."
        />

        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-card" key={service.slug}>
                <div className="service-icon"><Icon size={28} /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            );
          })}
        </div>

        <div className="section-action">
          <Link className="btn btn-secondary" to="/servicios">Ver todos los servicios</Link>
        </div>
      </div>
    </section>
  );
}
