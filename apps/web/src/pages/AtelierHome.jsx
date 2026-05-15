import { ArrowRight, CheckCircle2, Hammer, MapPin, MessageCircle, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { businessInfo, processSteps, services } from '../data/siteData.js';
import { projectImages } from '../data/projectImages.js';
import { buildWhatsAppUrl, quoteMessage } from '../utils/whatsapp.js';

const serviceDetails = [
  { label: 'Portones', value: 'fabricación e instalación' },
  { label: 'Estructuras', value: 'metal a medida' },
  { label: 'Pintura', value: 'terminación y protección' },
  { label: 'Durlock', value: 'obra seca y detalles' },
  { label: 'Electricidad', value: 'ajustes e instalación' },
  { label: 'Reparaciones', value: 'mantenimiento real' },
];

const featuredProjects = [
  { title: 'Portón levadizo doble', image: projectImages.portonDoble, tag: 'Metalúrgica', size: 'large' },
  { title: 'Cochera galería', image: projectImages.cocheraGaleria, tag: 'Estructura', size: 'medium' },
  { title: 'Cartelería metálica', image: projectImages.carteleria, tag: 'Terminación', size: 'small' },
  { title: 'Portón estándar', image: projectImages.portonEstandar, tag: 'Portones', size: 'medium' },
];

export default function AtelierHome() {
  return (
    <main className="atelier-page">
      <section className="atelier-hero">
        <div className="atelier-hero-bg" />
        <div className="container atelier-hero-grid">
          <aside className="atelier-rail">
            <span>CF</span>
            <strong>Metal / Pintura</strong>
            <small>Las Higueras · Río Cuarto</small>
          </aside>

          <div className="atelier-hero-copy">
            <span className="atelier-kicker"><ShieldCheck size={18} /> Trabajo real, hecho a medida</span>
            <h1>Obra, metal y terminación con criterio de taller.</h1>
            <p>
              Fabricación, pintura, durlock y soluciones eléctricas para proyectos que necesitan algo más que una respuesta rápida: necesitan oficio, medición y entrega responsable.
            </p>
            <div className="atelier-actions">
              <a className="atelier-button primary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
                Cotizar por WhatsApp <MessageCircle size={18} />
              </a>
              <a className="atelier-button ghost" href="#trabajos">
                Ver trabajos <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="atelier-hero-visual">
            <img src={projectImages.cocheraGaleria} alt="Trabajo de estructura metálica CF Metal Pintura" />
            <div className="atelier-floating-card top-card"><Ruler size={18} /><span>Medición + fabricación</span></div>
            <div className="atelier-floating-card bottom-card"><Sparkles size={18} /><span>Terminación cuidada</span></div>
          </div>
        </div>
      </section>

      <section className="atelier-strip" aria-label="Especialidades principales">
        <div className="container atelier-strip-inner">
          {serviceDetails.map((item) => (
            <div className="strip-item" key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="atelier-section services-atelier">
        <div className="container atelier-two-col">
          <div className="atelier-section-title sticky-title">
            <span className="atelier-kicker"><Hammer size={18} /> Qué resolvemos</span>
            <h2>Un solo oficio, varias formas de resolver una obra.</h2>
            <p>La página deja de hablar como catálogo y empieza a mostrar cómo se piensa el trabajo: necesidad, material, ejecución y terminación.</p>
          </div>

          <div className="atelier-service-list">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article className="atelier-service-row" key={service.slug}>
                  <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="service-icon-box"><Icon size={24} /></div>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="atelier-section atelier-projects" id="trabajos">
        <div className="container">
          <div className="atelier-section-title wide-title">
            <span className="atelier-kicker"><CheckCircle2 size={18} /> Muestra de trabajos</span>
            <h2>No mostramos decoración. Mostramos piezas hechas para usarse.</h2>
          </div>

          <div className="atelier-project-grid">
            {featuredProjects.map((project) => (
              <article className={`atelier-project-card ${project.size}`} key={project.title}>
                <img src={project.image} alt={project.title} />
                <div><span>{project.tag}</span><h3>{project.title}</h3></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-section atelier-method">
        <div className="container method-board">
          <div className="method-intro">
            <span className="atelier-kicker"><MapPin size={18} /> Método simple</span>
            <h2>Antes de fabricar, se entiende el problema.</h2>
            <p>El sistema profesionaliza el recorrido: consulta, visita, presupuesto, ejecución y entrega.</p>
          </div>

          <div className="method-steps">
            {processSteps.map((step, index) => (
              <article className="method-step" key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-final-cta">
        <div className="container final-cta-card">
          <div><span className="atelier-kicker">Presupuesto claro</span><h2>Contanos qué necesitás hacer y coordinamos el próximo paso.</h2></div>
          <a className="atelier-button primary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">Hablar ahora <MessageCircle size={18} /></a>
        </div>
      </section>
    </main>
  );
}
