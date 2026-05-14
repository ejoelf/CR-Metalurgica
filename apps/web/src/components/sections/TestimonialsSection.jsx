import SectionHeader from '../common/SectionHeader.jsx';
import { testimonials } from '../../data/siteData.js';

export default function TestimonialsSection() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <SectionHeader
          eyebrow="Opiniones"
          title="Confianza construida trabajo por trabajo"
          description="Referencias iniciales para mostrar el tipo de experiencia que buscamos sostener en cada proyecto."
        />

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <p>“{testimonial.text}”</p>
              <strong>{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
