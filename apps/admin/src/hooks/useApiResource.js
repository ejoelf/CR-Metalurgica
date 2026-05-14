import { useEffect, useState } from 'react';

export function useApiResource(service, fallback = []) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await service.list();
      setItems(Array.isArray(data) ? data : fallback);
    } catch (err) {
      setError(err.message);
      setItems(fallback);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { items, setItems, loading, error, reload: load };
}
