import { useEffect, useMemo, useState } from 'react';
import { Archive, Inbox, Mail, MessageCircle, Search, Trash2, UserPlus, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ActionModal from '../../components/common/ActionModal.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { messagesService } from '../../services/messagesService.js';
import { formatDateTime } from '../../utils/formatters.js';

const folders = [
  { key: 'inbox', label: 'Recibidos' },
  { key: 'converted', label: 'Convertidos' },
  { key: 'archived', label: 'Archivados' },
  { key: 'sent', label: 'Enviados' },
  { key: 'drafts', label: 'Borradores' },
];

const statusLabels = {
  new: 'Nuevo',
  contacted: 'Contactado',
  converted_to_client: 'Convertido',
  dismissed: 'Archivado',
};

function normalizePhone(value = '') {
  return String(value).replace(/[^0-9]/g, '');
}

export default function MessagesPage() {
  const [items, setItems] = useState([]);
  const [folder, setFolder] = useState('inbox');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyAction, setReplyAction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadMessages() {
    try {
      setLoading(true);
      setError('');
      const [data, countData] = await Promise.all([
        messagesService.list({ folder, search }),
        messagesService.unreadCount(),
      ]);
      setItems(Array.isArray(data) ? data : []);
      setUnreadCount(Number(countData?.count || 0));
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los mensajes');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadMessages, 250);
    return () => window.clearTimeout(timer);
  }, [folder, search]);

  const selected = useMemo(() => selectedMessage, [selectedMessage]);

  async function openMessage(message) {
    try {
      setActionLoading(true);
      const detail = await messagesService.getById(message.id);
      const readMessage = detail.status === 'new' ? await messagesService.markAsRead(message.id) : detail;
      setSelectedMessage(readMessage);
      setItems((state) => state.map((item) => item.id === readMessage.id ? readMessage : item));
      if (message.status === 'new') setUnreadCount((count) => Math.max(count - 1, 0));
    } catch (err) {
      setError(err.message || 'No se pudo abrir el mensaje');
    } finally {
      setActionLoading(false);
    }
  }

  function openReplyActions(message) {
    const phone = normalizePhone(message.phone);
    const email = message.email;
    const subject = encodeURIComponent(`Respuesta a tu consulta - CF Metal-Pintura`);
    const body = encodeURIComponent(`Hola ${message.fullName || ''}, gracias por comunicarte con CF Metal-Pintura.\n\nTe respondemos por tu consulta: "${message.serviceInterest || 'consulta web'}".\n\nSaludos.`);
    const whatsappText = encodeURIComponent(`Hola ${message.fullName || ''}, gracias por comunicarte con CF Metal-Pintura. Te respondemos por tu consulta.`);

    setReplyAction({
      title: 'Responder mensaje',
      description: 'Elegí si querés responder por Gmail o por WhatsApp Web.',
      actions: [
        { label: 'Responder por Gmail', description: email || 'El mensaje no tiene email cargado', icon: Mail, disabled: !email, onClick: () => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer'); setReplyAction(null); } },
        { label: 'Responder por WhatsApp', description: phone ? message.phone : 'El mensaje no tiene teléfono cargado', icon: MessageCircle, disabled: !phone, onClick: () => { window.open(`https://wa.me/${phone}?text=${whatsappText}`, '_blank', 'noopener,noreferrer'); setReplyAction(null); } },
      ],
    });
  }

  async function handleConvert(message) {
    if (!message?.id) return;
    try {
      setActionLoading(true);
      await messagesService.convertToClient(message.id);
      await loadMessages();
      const updated = await messagesService.getById(message.id);
      setSelectedMessage(updated);
    } catch (err) {
      setError(err.message || 'No se pudo convertir el mensaje en cliente');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleArchive(message) {
    if (!message?.id) return;
    try {
      setActionLoading(true);
      const updated = await messagesService.updateStatus(message.id, 'dismissed');
      setSelectedMessage(updated);
      await loadMessages();
    } catch (err) {
      setError(err.message || 'No se pudo archivar el mensaje');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    try {
      setActionLoading(true);
      await messagesService.remove(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedMessage(null);
      await loadMessages();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el mensaje');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Mensajería"
        title="Bandeja de mensajes"
        description="Consultas de la web pública organizadas para responder, archivar o convertir en clientes."
      />

      <section className="toolbar-card messages-toolbar-v2">
        <div className="messages-folder-tabs">
          {folders.map((item) => (
            <button key={item.key} className={folder === item.key ? 'is-active' : ''} type="button" onClick={() => setFolder(item.key)}>
              {item.label}
              {item.key === 'inbox' && unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
          ))}
        </div>
        <div className="search-input">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, teléfono, email o mensaje" />
        </div>
      </section>

      {error && <p className="warning-box">{error}</p>}

      <section className="messages-layout-v2">
        <div className="messages-list-panel">
          {loading && <LoadingState label="Cargando mensajes..." />}
          {!loading && !items.length && (
            <EmptyState icon={Inbox} title="No hay mensajes en esta bandeja" description="Cuando lleguen consultas desde la web pública aparecerán acá." />
          )}
          {!loading && items.map((message) => (
            <button key={message.id} className={`message-row-v2 is-${message.status}`} type="button" onClick={() => openMessage(message)}>
              <span className="message-row-icon"><Inbox size={18} /></span>
              <span>
                <strong>{message.fullName}</strong>
                <small>{message.serviceInterest || 'Consulta web'} · {formatDateTime(message.createdAt)}</small>
                <em>{message.message}</em>
              </span>
              {message.status === 'new' && <b>Nuevo</b>}
            </button>
          ))}
        </div>

        <aside className="message-detail-panel">
          {!selected ? (
            <div className="message-empty-detail">
              <Inbox size={34} />
              <h2>Seleccioná un mensaje</h2>
              <p>Al abrirlo se marca como contactado y podés responder por Gmail o WhatsApp.</p>
            </div>
          ) : (
            <article className="message-detail-card">
              <button className="message-close" type="button" onClick={() => setSelectedMessage(null)} aria-label="Cerrar detalle"><X size={18} /></button>
              <span className="message-status-pill">{statusLabels[selected.status] || selected.status}</span>
              <h2>{selected.fullName}</h2>
              <p>{selected.message}</p>

              <div className="message-info-grid">
                <span><b>Teléfono</b>{selected.phone}</span>
                <span><b>Email</b>{selected.email || 'Sin email'}</span>
                <span><b>Servicio</b>{selected.serviceInterest || 'Sin servicio'}</span>
                <span><b>Fecha</b>{formatDateTime(selected.createdAt)}</span>
              </div>

              <div className="message-actions-v2">
                <button className="crm-button primary" type="button" onClick={() => openReplyActions(selected)} disabled={actionLoading}><Mail size={16} /> Responder</button>
                <button className="crm-button" type="button" onClick={() => handleConvert(selected)} disabled={actionLoading || selected.status === 'converted_to_client'}><UserPlus size={16} /> {selected.status === 'converted_to_client' ? 'Convertido' : 'Convertir'}</button>
                <button className="crm-button" type="button" onClick={() => handleArchive(selected)} disabled={actionLoading || selected.status === 'dismissed'}><Archive size={16} /> Archivar</button>
                <button className="crm-button danger" type="button" onClick={() => setDeleteTarget(selected)} disabled={actionLoading}><Trash2 size={16} /> Eliminar</button>
              </div>
            </article>
          )}
        </aside>
      </section>

      <ActionModal
        isOpen={Boolean(replyAction)}
        title={replyAction?.title}
        description={replyAction?.description}
        actions={replyAction?.actions || []}
        onClose={() => setReplyAction(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Eliminar mensaje"
        description={`¿Estás seguro de querer eliminar/archivar el mensaje de ${deleteTarget?.fullName || 'este contacto'}?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={actionLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
