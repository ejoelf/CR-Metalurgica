import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { auditService } from '../../services/auditService.js';
import { formatDateTime } from '../../utils/formatters.js';
import EmptyState from './EmptyState.jsx';
import LoadingState from './LoadingState.jsx';

function translateAction(action = '') {
  const labels = {
    create: 'Creación',
    update: 'Actualización',
    delete: 'Eliminación',
    login: 'Inicio de sesión',
    logout: 'Cierre de sesión',
    status_change: 'Cambio de estado',
    pdf_generated: 'PDF generado',
    sent: 'Envío',
  };

  return labels[action] || action.replaceAll('_', ' ');
}

export default function RecentActivityList({ entityType, entityId, take = 12, title = 'Actividad reciente' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        setLoading(true);
        const data = await auditService.list({ entityType, entityId, take });
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, [entityType, entityId, take]);

  if (loading) return <LoadingState label="Cargando actividad..." />;

  if (!items.length) {
    return (
      <EmptyState
        icon={Clock3}
        title="Sin actividad registrada"
        description="Cuando el sistema registre acciones importantes, van a aparecer acá."
      />
    );
  }

  return (
    <section className="crm-activity-card">
      <header>
        <h3>{title}</h3>
        <span>{items.length} registros</span>
      </header>
      <div className="crm-activity-list">
        {items.map((item) => (
          <article className="crm-activity-item" key={item.id}>
            <span className="crm-activity-dot" />
            <div>
              <strong>{translateAction(item.action)}</strong>
              <p>{item.entityType || 'Sistema'} {item.entityId ? `· ${item.entityId}` : ''}</p>
              <small>{formatDateTime(item.createdAt)} {item.user?.name ? `· ${item.user.name}` : ''}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
