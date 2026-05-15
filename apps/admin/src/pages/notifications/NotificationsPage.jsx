import { useState } from 'react';
import { BellRing, CheckCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { notificationsService } from '../../services/resourceService.js';

const fallbackNotifications = [
  { id: '1', title: 'Sistema inicializado', message: 'CF Metal Pintura PRO fue inicializado correctamente.', type: 'success', isRead: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Nueva consulta web', message: 'Entró una nueva consulta desde el formulario público.', type: 'info', isRead: true, createdAt: new Date().toISOString() },
];

export default function NotificationsPage() {
  const { items, setItems, loading, error, reload } = useApiResource(notificationsService, fallbackNotifications);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function handleMarkAsRead(notification) {
    if (notification.isRead) return;
    setActionLoading(notification.id);
    setFeedback(null);

    try {
      await notificationsService.markAsRead(notification.id);
      setItems((current) => current.map((item) => item.id === notification.id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item));
    } catch (err) {
      setFeedback(err.message || 'No se pudo marcar la notificación.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkAllAsRead() {
    setActionLoading('all');
    setFeedback(null);

    try {
      await notificationsService.markAllAsRead();
      setItems((current) => current.map((item) => ({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })));
      setFeedback('Todas las notificaciones fueron marcadas como leídas.');
      await reload();
    } catch (err) {
      setFeedback(err.message || 'No se pudieron marcar las notificaciones.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Alertas internas"
        title="Notificaciones"
        description="Eventos del sistema, mensajes, trabajos, presupuestos y recordatorios internos."
        action={<button className="primary-button" type="button" disabled={actionLoading === 'all'} onClick={handleMarkAllAsRead}><CheckCheck size={18} /> {actionLoading === 'all' ? 'Marcando...' : 'Marcar todas'}</button>}
      />

      {loading && <p className="muted">Cargando notificaciones...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}
      {feedback && <p className={feedback.startsWith('No se') ? 'error-box' : 'success-box'}>{feedback}</p>}

      <div className="timeline-list">
        {items.map((item) => (
          <article className={`timeline-item notification-item ${item.isRead ? 'read' : 'unread'}`} key={item.id}>
            <div className="record-icon"><BellRing size={22} /></div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
              <span>{item.type} · {new Date(item.createdAt).toLocaleString('es-AR')} · {item.isRead ? 'Leída' : 'Pendiente'}</span>
            </div>
            <button className="ghost-button" type="button" disabled={item.isRead || actionLoading === item.id} onClick={() => handleMarkAsRead(item)}>
              <CheckCheck size={16} /> {item.isRead ? 'Leída' : actionLoading === item.id ? 'Marcando...' : 'Marcar'}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
