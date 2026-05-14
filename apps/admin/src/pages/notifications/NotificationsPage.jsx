import { BellRing, CheckCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { notificationsService } from '../../services/resourceService.js';

const fallbackNotifications = [
  { id: '1', title: 'Sistema inicializado', message: 'CF Metal Pintura PRO fue inicializado correctamente.', type: 'success', isRead: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Nueva consulta web', message: 'Entró una nueva consulta desde el formulario público.', type: 'info', isRead: true, createdAt: new Date().toISOString() },
];

export default function NotificationsPage() {
  const { items, loading, error } = useApiResource(notificationsService, fallbackNotifications);

  return (
    <div>
      <PageHeader
        eyebrow="Alertas internas"
        title="Notificaciones"
        description="Eventos del sistema, mensajes, trabajos, presupuestos y recordatorios internos."
        action={<button className="primary-button"><CheckCheck size={18} /> Marcar todas</button>}
      />

      {loading && <p className="muted">Cargando notificaciones...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="timeline-list">
        {items.map((item) => (
          <article className={`timeline-item notification-item ${item.isRead ? 'read' : 'unread'}`} key={item.id}>
            <div className="record-icon"><BellRing size={22} /></div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
              <span>{item.type} · {new Date(item.createdAt).toLocaleString('es-AR')}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
