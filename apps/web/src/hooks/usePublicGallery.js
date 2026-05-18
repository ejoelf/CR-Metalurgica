import { useEffect, useState } from 'react';
import { getPublicGallery } from '../services/galleryService.js';
import { featuredWorks } from '../data/siteData.js';
import { resolveProjectImage } from '../data/projectImages.js';

function mapGalleryItem(item, index = 0) {
  return {
    id: item.id || item.slug || item.title || `fallback-${index}`,
    slug: item.slug || '',
    title: item.title || 'Trabajo realizado',
    category: item.category || 'Trabajo realizado',
    image: resolveProjectImage(item.mainImageUrl || item.image),
    beforeImage: item.beforeImageUrl ? resolveProjectImage(item.beforeImageUrl) : null,
    afterImage: item.afterImageUrl ? resolveProjectImage(item.afterImageUrl) : null,
    description: item.description || 'Trabajo realizado por CF Metal-Pintura.',
    isFeatured: Boolean(item.isFeatured),
  };
}

export function usePublicGallery() {
  const [items, setItems] = useState(featuredWorks.map(mapGalleryItem));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublicGallery();
        if (active && Array.isArray(data) && data.length) {
          setItems(data.map(mapGalleryItem));
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGallery();

    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}
