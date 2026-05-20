import { useEffect, useMemo, useState } from 'react';
import { BellRing, CalendarDays, CheckCheck, ExternalLink, Inbox, MessageCircle, Search, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { notificationsService } from '../../services/notificationsService.js';
import { formatDateTime } from '../../utils/formatters.js';

const typeLabels = {
  info: 'Información',
  success: 'Correcto',
  warning: 'Atención',
  error: 'Error',
  reminder: 'Recordatorio',
};

function getEntityCopy(notification) {
  if (notification?.entityType === 'contactMessage') {
    return {
      icon: Inbox,
      title: 'Mensaje recibido desde la web',
      description: 'Hay una consulta nueva esperando respuesta. Podés abrir el mensaje completo o responder desde la sección Mensajes.',
      primaryLabel: 'Ir al mensaje',
      route: '/mensajes',
    };
  }

  if (notification?.entityType === 'agendaEvent') {
    return {
      icon: CalendarDays,
      title: 'Evento de agenda',
      description: 'Tenés un evento o recordatorio registrado en el calendario operativo.',
      primaryLabel: 'Ir a agenda',
      route: '/agenda',
    };
  }

  if (notification?.entityType === 'client') {
    return { icon: MessageCircle, title: 'Cliente', description: 'Hay una acción relacionada a clientes.', primaryLabel: 'Ir a clientes', route: '/clientes' };
  }

  if (notification?.entityType === 'quote') {
    return { icon: ExternalLink, title: 'Presupuesto', description: 'Hay una acción relacionada a presupuestos.', primaryLabel: 'Ir a presupuestos', route: '/presupuestos' };
  }

  if (notification?.entityType === 'job') {
    return { icon: ExternalLink, title: 'Trabajo', description: 'Hay una acción relacionada a trabajos.', primaryLabel: 'Ir a trabajos', route: '/trabajos' };
  }

  return {
    icon: BellRing,
    title: 'Notificación del CRM',
    description: 'El sistema registró una acción importante para revisar.',
    primaryLabel: '',
    route: '',
  };
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError('');
      const [data, countData] = await Promise.all([
        notificationsService.list({ isRead: filter }),
        notificationsService.unreadCount(),
      ]);
      setItems(Array.isArray(data) ? data : []);
      setUnreadCount(Number(countData?.count || 0));
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las notificaciones');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => [item.title, item.message, item.type, item.entityType]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term)));
  }, [items, search]);

  async function openNotification(notification) {
    try {
      setActionLoading(true);
      const detail = await notificationsService.getById(notification.id);
      const readDetail = detail.isRead ? detail : await notificationsService.markAsRead(detail.id);
      setSelectedNotification(readDetail);
      setItems((state) => state.map((item) => item.id === readDetail.id ? readDetail : item));
      if (!notification.isRead) setUnreadCount((count) => Math.max(count - 1, 0));
    } catch (err) {
      setError(err.message || 'No se pudo abrir la notificación');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setActionLoading(true);
      await notificationsService.markAllAsRead();
      setItems((state) => state.map((item) => ({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || 'No se pudieron marcar las notificaciones');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    try {
      setActionLoading(true);
      await notificationsService.remove(deleteTarget.id);
      setItems((state) => state.filter((item) => item.id !== deleteTarget.id));
      if (selectedNotification?.id === deleteTarget.id) setSelectedNotification(null);
      setDeleteTarget(null);
      await loadNotifications();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la notificación');
    } finally {
      setActionLoading(false);
    }
  }

  function goToEntity(notification) {
    const copy = getEntityCopy(notification);
    if (copy.route) navigate(copy.route);
  }

  const selectedCopy = getEntityCopy(selectedNotification);
  const SelectedIcon = selectedCopy.icon;

  return (
    <div>
      <PageHeader
        eyebrow="Alertas internas"
        title="Notificaciones"
        description="Mensajes nuevos, agenda del día, recordatorios y acciones importantes del CRM."
        action={<button className="primary-button" type="button" disabled={actionLoading || unreadCount === 0} onClick={handleMarkAllAsRead}><CheckCheck size={18} /> Marcar leídas</button>}
      />

      <section className="toolbar-card notifications-toolbar-v2">
        <div className="notifications-filter-tabs">
          <button className={filter === '' ? 'is-active' : ''} type="button" onClick={() => setFilter('')}>Todas</button>
          <button className={filter === 'false' ? 'is-active' : ''} type="button" onClick={() => setFilter('false')}>No leídas {unreadCount > 0 && <span>{unreadCount}</span>}</button>
          <button className={filter === 'true' ? 'is-active' : ''} type="button" onClick={() => setFilter('true')}>Leídas</button>
        </div>
        <div className="search-input">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar notificación" />
        </div>
      </section>

      {error && <p className="warning-box">{error}</p>}
      {loading && <LoadingState label="Cargando notificaciones..." />}

      {!loading && !visibleItems.length && (
        <EmptyState icon={BellRing} title="No hay notificaciones" description="Cuando haya mensajes o eventos importantes aparecerán en esta sección." />
      )}

      {!loading && visibleItems.length > 0 && (
        <section className="notifications-layout-v2">
          <div className="notifications-list-v2">
            {visibleItems.map((item) => {
              const rowCopy = getEntityCopy(item);
              const RowIcon = rowCopy.icon;
              return (
                <button key={item.id} className={`notification-row-v2 ${item.isRead ? 'is-read' : 'is-unread'} is-${item.type}`} type="button" onClick={() => openNotification(item)}>
                  <span className="notification-icon-v2"><RowIcon size={18} /></span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{typeLabels[item.type] || item.type} · {formatDateTime(item.createdAt)}</small>
                    <em>{item.message}</em>
                  </span>
                  {!item.isRead && <b>Nuevo</b>}
                </button>
              );
            })}
          </div>

          <aside className="notification-detail-v2">
            {!selectedNotification ? (
              <div className="notification-empty-detail">
                <BellRing size={34} />
                <h2>Seleccioná una notificación</h2>
                <p>Al abrirla se marca como leída y se muestran sus acciones disponibles.</p>
              </div>
            ) : (
              <article>
                <button className="notification-close" type="button" onClick={() => setSelectedNotification(null)} aria-label="Cerrar detalle"><X size={18} /></button>
                <div className="notification-human-head">
                  <span className="notification-human-icon"><SelectedIcon size={24} /></span>
                  <div>
                    <span className="notification-pill">{typeLabels[selectedNotification.type] || selectedNotification.type}</span>
                    <h2>{selectedCopy.title}</h2>
                  </div>
                </div>

                <div className="notification-human-card">
                  <strong>{selectedNotification.title}</strong>
                  <p>{selectedNotification.message}</p>
                </div>

                <div className="notification-human-summary">
                  <span><b>Recibida</b>{formatDateTime(selectedNotification.createdAt)}</span>
                  <span><b>Estado</b>{selectedNotification.isRead ? 'Leída' : 'No leída'}</span>
                </div>

                <p className="notification-human-help">{selectedCopy.description}</p>

                <div className="notification-actions-v2">
                  {selectedCopy.route && <button className="crm-button primary" type="button" onClick={() => goToEntity(selectedNotification)}><ExternalLink size={16} /> {selectedCopy.primaryLabel}</button>}
                  <button className="crm-button danger" type="button" onClick={() => setDeleteTarget(selectedNotification)}><Trash2 size={16} /> Eliminar</button>
                </div>
              </article>
            )}
          </aside>
        </section>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Eliminar notificación"
        description={`¿Estás seguro de querer eliminar la notificación "${deleteTarget?.title || ''}"?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={actionLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
