import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader.jsx';
import { usePublicGallery } from '../../hooks/usePublicGallery.js';

export default function WorksSection() {
  const { items, loading } = usePublicGallery();

  return (
    <section className="section works-section">
      <div className="container">
        <SectionHeader
          eyebrow="Trabajos realizados"
          title="Fabricación, pintura y terminaciones con identidad propia"
          description="Una muestra de trabajos reales y referencias iniciales para mostrar la calidad del oficio."
        />

        {loading && <p className="muted center">Cargando galería...</p>}

        <div className="works-grid">
          {items.slice(0, 4).map((work) => (
            <article className="work-card" key={work.title}>
              <div className="work-image" style={{ backgroundImage: `url(${work.image})` }} />
              <div className="work-content">
                <span>{work.category}</span>
                <h3>{work.title}</h3>
                <p>{work.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="section-action">
          <Link className="btn btn-primary" to="/galeria">Ver galería completa</Link>
        </div>
      </div>
    </section>
  );
}
