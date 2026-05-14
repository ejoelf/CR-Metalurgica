import SectionHeader from '../common/SectionHeader.jsx';
import { processSteps } from '../../data/siteData.js';

export default function ProcessSection() {
  return (
    <section className="section process-section">
      <div className="container">
        <SectionHeader
          eyebrow="Proceso"
          title="Un flujo claro desde la consulta hasta la entrega"
          description="Ordenamos cada etapa para que el cliente sepa qué se va a hacer, cuánto cuesta y cómo avanza el trabajo."
        />

        <div className="process-timeline">
          {processSteps.map((step, index) => (
            <article className="process-step" key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
