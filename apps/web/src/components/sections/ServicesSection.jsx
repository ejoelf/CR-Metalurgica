import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '../../data/siteData.js';

const serviceSpecs = {
  metalurgica: ['Portones', 'Rejas', 'Estructuras', 'Cerramientos'],
  pintura: ['Interior', 'Exterior', 'Estructuras', 'Terminación'],
  durlock: ['Tabiques', 'Cielorrasos', 'Revestimientos', 'Divisiones'],
  electricidad: ['Instalaciones', 'Reparaciones', 'Adecuaciones', 'Obra'],
};

export default function ServicesSection() {
  return (
    <section className="section blueprint-services-section">
      <div className="container">
        <div className="split-section-heading">
          <span className="industrial-kicker">Especialidades</span>
          <h2>No son servicios sueltos. Son piezas de una misma obra.</h2>
          <p>CF Metal Pintura combina oficio, medición y ejecución para resolver trabajos completos sin vueltas.</p>
        </div>

        <div className="technical-services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article className="technical-service-card" key={service.slug}>
                <div className="service-card-head">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={26} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {(serviceSpecs[service.slug] || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="section-action blueprint-action">
          <Link className="btn btn-secondary" to="/servicios">Ver detalle técnico <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
