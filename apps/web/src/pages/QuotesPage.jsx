import { useEffect } from 'react';
import { ClipboardCheck, Clock, FileText, MessageCircle } from 'lucide-react';
import ContactSection from '../components/sections/ContactSection.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import { businessInfo } from '../data/siteData.js';
import { buildWhatsAppUrl, quoteMessage } from '../utils/whatsapp.js';
import { updateSeo } from '../utils/seo.js';

const quoteSteps = [
  { icon: MessageCircle, title: '1. Consulta', text: 'Contanos qué necesitás, medidas aproximadas, zona y detalles importantes.' },
  { icon: Clock, title: '2. Revisión', text: 'Evaluamos materiales, tiempos, mano de obra y complejidad del trabajo.' },
  { icon: FileText, title: '3. Presupuesto', text: 'Preparamos una propuesta clara, lista para enviarse por WhatsApp o email.' },
  { icon: ClipboardCheck, title: '4. Aprobación', text: 'Cuando se aprueba, el trabajo pasa a planificación y producción.' },
];

export default function QuotesPage() {
  useEffect(() => {
    updateSeo({ title: 'Presupuestos | CF Metal Pintura', description: 'Solicitá presupuesto para herrería, pintura, durlock y electricidad.' });
  }, []);

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Presupuestos</span>
          <h1>Solicitá tu presupuesto de forma clara y ordenada</h1>
          <p>La web queda preparada para conectar cada consulta con el CRM y transformar mensajes en clientes, trabajos y presupuestos.</p>
          <a className="btn btn-primary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
            Pedir por WhatsApp
          </a>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Cómo funciona" description="Un proceso simple para que cada trabajo tenga datos, costos y tiempos bien definidos." />
          <div className="quote-steps-grid">
            {quoteSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article className="quote-step-card" key={step.title}>
                  <Icon size={28} />
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
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
