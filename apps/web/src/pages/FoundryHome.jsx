import { ArrowRight, Check, Hammer, Ruler, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { businessInfo, processSteps, services } from '../data/siteData.js';
import { projectImages } from '../data/projectImages.js';
import { buildWhatsAppUrl, quoteMessage } from '../utils/whatsapp.js';

const stats = [
  ['01', 'Medición en obra'],
  ['02', 'Trabajo a medida'],
  ['03', 'Terminación prolija'],
];

const works = [
  { title: 'Portón levadizo doble', image: projectImages.portonDoble, tag: 'Portones' },
  { title: 'Cochera galería', image: projectImages.cocheraGaleria, tag: 'Estructuras' },
  { title: 'Cartelería metálica', image: projectImages.carteleria, tag: 'Cartelería' },
];

export default function FoundryHome() {
  return (
    <main className="foundry-page">
      <section className="foundry-hero">
        <div className="foundry-hero-image">
          <img src={projectImages.portonDoble} alt="Trabajo metálico CF Metal Pintura" />
        </div>
        <div className="container foundry-hero-content">
          <div className="foundry-hero-left">
            <span className="foundry-kicker"><ShieldCheck size={17} /> Herrería · Pintura · Obra</span>
            <h1>Fabricamos soluciones que se ven firmes antes de tocarlas.</h1>
          </div>
          <div className="foundry-hero-right">
            <p>Portones, estructuras, pintura, durlock y electricidad para viviendas, comercios y obras en Las Higueras y Río Cuarto.</p>
            <a className="foundry-btn primary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
              Pedir presupuesto
            </a>
          </div>
        </div>
      </section>

      <section className="foundry-stats">
        <div className="container foundry-stats-grid">
          {stats.map(([number, label]) => (
            <article key={label}><strong>{number}</strong><span>{label}</span></article>
          ))}
        </div>
      </section>

      <section className="foundry-section foundry-services">
        <div className="container foundry-split">
          <div className="foundry-title-block">
            <span className="foundry-kicker"><Wrench size={17} /> Servicios</span>
            <h2>Un taller flexible para resolver trabajos completos.</h2>
            <p>No vendemos paquetes genéricos. Miramos el lugar, entendemos el uso y armamos una solución posible.</p>
          </div>
          <div className="foundry-service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="foundry-service-card" key={service.slug}>
                  <Icon size={25} />
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="foundry-section foundry-feature">
        <div className="container foundry-feature-grid">
          <div className="foundry-feature-photo">
            <img src={projectImages.cocheraGaleria} alt="Estructura metálica realizada" />
          </div>
          <div className="foundry-feature-copy">
            <span className="foundry-kicker"><Ruler size={17} /> A medida</span>
            <h2>La diferencia está en medir bien antes de fabricar.</h2>
            <ul>
              <li><Check size={18} /> Relevamiento y conversación clara.</li>
              <li><Check size={18} /> Presupuesto con materiales y mano de obra.</li>
              <li><Check size={18} /> Ejecución ordenada y seguimiento.</li>
              <li><Check size={18} /> Terminación pensada para durar.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="foundry-section foundry-work">
        <div className="container">
          <div className="foundry-work-head">
            <div>
              <span className="foundry-kicker"><Hammer size={17} /> Trabajos</span>
              <h2>Proyectos recientes</h2>
            </div>
            <a className="foundry-btn secondary" href="/galeria">Ver galería <ArrowRight size={18} /></a>
          </div>
          <div className="foundry-work-grid">
            {works.map((work, index) => (
              <article className={`foundry-work-card work-${index + 1}`} key={work.title}>
                <img src={work.image} alt={work.title} />
                <div><span>{work.tag}</span><h3>{work.title}</h3></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="foundry-section foundry-process">
        <div className="container foundry-process-grid">
          <div className="foundry-title-block">
            <span className="foundry-kicker"><Sparkles size={17} /> Proceso</span>
            <h2>Simple para el cliente, ordenado para el taller.</h2>
          </div>
          <div className="foundry-steps">
            {processSteps.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
