import { processSteps } from '../../data/siteData.js';

export default function ProcessSection() {
  return (
    <section className="section fabrication-line-section">
      <div className="container">
        <div className="fabrication-header">
          <span className="industrial-kicker">Método de trabajo</span>
          <h2>De la consulta al montaje, cada etapa tiene control.</h2>
          <p>Un proceso simple para que el cliente sepa qué se hace, cuánto cuesta y en qué estado está su trabajo.</p>
        </div>

        <div className="fabrication-line">
          {processSteps.map((step, index) => (
            <article className="fabrication-step" key={step.title}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="step-pin" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
