import { GalleryHorizontal, Plus, Star } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { galleryService } from '../../services/resourceService.js';
import { projectImages, resolveProjectImage } from '../../data/projectImages.js';

const fallbackGallery = [
  { id: '1', title: 'Portón levadizo doble', category: 'Portones', mainImageUrl: projectImages.portonDoble, isPublished: true, isFeatured: true },
  { id: '2', title: 'Cochera galería', category: 'Estructuras', mainImageUrl: projectImages.cocheraGaleria, isPublished: true, isFeatured: true },
];

export default function GalleryPage() {
  const { items, loading, error } = useApiResource(galleryService, fallbackGallery);

  return (
    <div>
      <PageHeader
        eyebrow="Contenido público"
        title="Galería administrable"
        description="Carga, eliminación, destacados, categorías y publicación de trabajos en la web pública."
        action={<button className="primary-button"><Plus size={18} /> Nuevo trabajo</button>}
      />

      {loading && <p className="muted">Cargando galería...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="gallery-admin-grid">
        {items.map((item) => (
          <article className="gallery-admin-card" key={item.id}>
            <img src={resolveProjectImage(item.mainImageUrl)} alt={item.title} />
            <div>
              <span>{item.category || 'Sin categoría'}</span>
              <h3>{item.title}</h3>
              <p>{item.isPublished ? 'Publicado' : 'Oculto'} {item.isFeatured ? '· Destacado' : ''}</p>
              <button className="ghost-button"><Star size={16} /> Destacar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
