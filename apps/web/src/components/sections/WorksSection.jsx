import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { usePublicGallery } from '../../hooks/usePublicGallery.js';

export default function WorksSection() {
  const { items, loading } = usePublicGallery();
  const featured = items[0];
  const secondary = items.slice(1, 4);

  return (
    <section className="section industrial-portfolio-section">
      <div className="container">
        <div className="portfolio-header">
          <div>
            <span className="industrial-kicker">Portfolio de obra</span>
            <h2>Trabajos reales con lectura técnica y terminación visible.</h2>
          </div>
          <p>Portones, estructuras, cartelería y soluciones metálicas pensadas para durar, funcionar y verse bien.</p>
        </div>

        {loading && <p className="muted center">Cargando galería...</p>}

        {featured && (
          <div className="portfolio-layout">
            <article className="portfolio-featured-card">
              <img src={featured.image} alt={featured.title} />
              <div className="portfolio-featured-info">
                <span>{featured.category}</span>
                <h3>{featured.title}</h3>
                <p>{featured.description}</p>
              </div>
            </article>

            <div className="portfolio-side-stack">
              <div className="portfolio-spec-card">
                <span className="sheet-code">OBRA / MUESTRA</span>
                <h3>Cómo miramos cada trabajo</h3>
                <ul>
                  <li>Medidas y uso real del espacio</li>
                  <li>Material adecuado para resistencia</li>
                  <li>Terminación pensada para exterior/interior</li>
                  <li>Entrega coordinada con el cliente</li>
                </ul>
              </div>

              {secondary.map((work) => (
                <article className="portfolio-mini-card" key={work.title}>
                  <img src={work.image} alt={work.title} />
                  <div>
                    <span>{work.category}</span>
                    <h3>{work.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="section-action blueprint-action">
          <Link className="btn btn-primary" to="/galeria">Ver galería completa <ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
