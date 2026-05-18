import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import { usePublicGallery } from '../hooks/usePublicGallery.js';
import { updateSeo } from '../utils/seo.js';

export default function GalleryPage() {
  const { items, loading } = usePublicGallery();
  const [category, setCategory] = useState('Todas');

  useEffect(() => {
    updateSeo({ title: 'Galería | CF Metal Pintura', description: 'Galería de trabajos de CF Metal Pintura.' });
  }, []);

  const categories = useMemo(() => ['Todas', ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const filteredItems = category === 'Todas' ? items : items.filter((item) => item.category === category);

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Galería</span>
          <h1>Una vidriera visual para los trabajos de CF Metal Pintura</h1>
          <p>Trabajos publicados y administrados desde el CRM privado, con imágenes, categorías y descripción de cada proyecto.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Trabajos destacados" description="Filtrá por categoría y revisá los trabajos visibles en la web pública." />

          <div className="filter-pills">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>

          {loading && <p className="muted center">Cargando galería...</p>}

          <div className="gallery-grid">
            {filteredItems.map((work) => (
              <article className="gallery-card" key={work.id || work.title}>
                <img src={work.image} alt={work.title} loading="lazy" />
                <div>
                  <span>{work.category}</span>
                  <h2>{work.title}</h2>
                  <p>{work.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactSection compact />
    </>
  );
}
