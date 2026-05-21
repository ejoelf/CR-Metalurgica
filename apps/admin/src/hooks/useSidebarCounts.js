import { useEffect, useState } from 'react';
import { crmService } from '../services/crmService.js';

const EMPTY_COUNTS = {
  unreadNotifications: 0,
  unreadMessages: 0,
};

export function useSidebarCounts({ enabled = true, intervalMs = 15000 } = {}) {
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;

    async function loadCounts() {
      try {
        setLoading(true);
        const data = await crmService.getSidebarCounts();
        if (!cancelled) setCounts({ ...EMPTY_COUNTS, ...(data || {}) });
      } catch (error) {
        if (!cancelled) setCounts(EMPTY_COUNTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    function handleCountsUpdate() {
      loadCounts();
    }

    loadCounts();
    window.addEventListener('crm:counts-updated', handleCountsUpdate);
    const interval = window.setInterval(loadCounts, intervalMs);

    return () => {
      cancelled = true;
      window.removeEventListener('crm:counts-updated', handleCountsUpdate);
      window.clearInterval(interval);
    };
  }, [enabled, intervalMs]);

  return { counts, loading };
}
