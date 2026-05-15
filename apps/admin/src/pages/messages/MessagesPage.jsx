import { useState } from 'react';
import { Inbox, UserPlus, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { messagesService } from '../../services/resourceService.js';

const fallbackMessages = [
  { id: '1', fullName: 'Consulta de ejemplo', phone: '3580000000', email: 'consulta@ejemplo.com', serviceInterest: 'Metalúrgica', message: 'Necesito presupuesto para un portón.', status: 'new' },
];

export default function MessagesPage() {
  const { items, setItems, loading, error, reload } = useApiResource(messagesService, fallbackMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function handleConvert(message) {
    setActionLoading(message.id);
    setFeedback(null);

    try {
      const client = await messagesService.convertToClient(message.id);
      setItems((current) => current.map((item) => (
        item.id === message.id
          ? { ...item, status: 'converted_to_client', clientId: client.id }
          : item
      )));
      setSelectedMessage((current) => current?.id === message.id
        ? { ...current, status: 'converted_to_client', clientId: client.id }
        : current);
      setFeedback(`Mensaje convertido en cliente: ${client.fullName || message.fullName}`);
      await reload();
    } catch (err) {
      setFeedback(err.message || 'No se pudo convertir el mensaje.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Consultas web"
        title="Mensajes recibidos"
        description="Consultas entrantes desde la web pública listas para convertir en clientes."
      />

      {loading && <p className="muted">Cargando mensajes...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}
      {feedback && <p className={feedback.includes('No se pudo') ? 'error-box' : 'success-box'}>{feedback}</p>}

      <div className="data-grid">
        {items.map((message) => (
          <article className="record-card message-card clickable-card" key={message.id} onClick={() => setSelectedMessage(message)}>
            <div className="record-icon"><Inbox size={22} /></div>
            <div>
              <h3>{message.fullName}</h3>
              <p>{message.message}</p>
              <span>{message.phone} · {message.email || 'Sin email'} · {message.serviceInterest || 'Sin servicio'} · {message.status}</span>
            </div>
            <button
              className="ghost-button"
              type="button"
              disabled={message.status === 'converted_to_client' || actionLoading === message.id}
              onClick={(event) => {
                event.stopPropagation();
                handleConvert(message);
              }}
            >
              <UserPlus size={16} />
              {message.status === 'converted_to_client' ? 'Convertido' : actionLoading === message.id ? 'Convirtiendo...' : 'Convertir'}
            </button>
          </article>
        ))}
      </div>

      {selectedMessage && (
        <div className="modal-backdrop" onClick={() => setSelectedMessage(null)}>
          <article className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close-button" type="button" onClick={() => setSelectedMessage(null)} aria-label="Cerrar detalle">
              <X size={18} />
            </button>
            <span className="modal-eyebrow">Detalle de consulta</span>
            <h2>{selectedMessage.fullName}</h2>
            <p>{selectedMessage.message}</p>
            <div className="detail-list">
              <span><b>Teléfono</b>{selectedMessage.phone}</span>
              <span><b>Email</b>{selectedMessage.email || 'Sin email'}</span>
              <span><b>Servicio</b>{selectedMessage.serviceInterest || 'Sin servicio'}</span>
              <span><b>Estado</b>{selectedMessage.status}</span>
            </div>
            <div className="modal-actions">
              <button
                className="primary-button"
                type="button"
                disabled={selectedMessage.status === 'converted_to_client' || actionLoading === selectedMessage.id}
                onClick={() => handleConvert(selectedMessage)}
              >
                <UserPlus size={16} />
                {selectedMessage.status === 'converted_to_client' ? 'Ya convertido' : 'Convertir en cliente'}
              </button>
              <button className="ghost-button" type="button" onClick={() => setSelectedMessage(null)}>Cerrar</button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
