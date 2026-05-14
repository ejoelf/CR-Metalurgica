import { useEffect, useState } from 'react';
import { getPublicGallery } from '../services/galleryService.js';
import { featuredWorks } from '../data/siteData.js';

export function usePublicGallery() {
  const [items, setItems] = useState(featuredWorks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublicGallery();
        if (active && data.length) {
          setItems(data.map((item) => ({
            title: item.title,
            category: item.category,
            image: item.mainImageUrl,
            description: item.description,
          })));
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
