import { Inbox, UserPlus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { messagesService } from '../../services/resourceService.js';

const fallbackMessages = [
  { id: '1', fullName: 'Consulta de ejemplo', phone: '3580000000', email: 'consulta@ejemplo.com', serviceInterest: 'Metalúrgica', message: 'Necesito presupuesto para un portón.', status: 'new' },
];

export default function MessagesPage() {
  const { items, loading, error } = useApiResource(messagesService, fallbackMessages);

  return (
    <div>
      <PageHeader
        eyebrow="Consultas web"
        title="Mensajes recibidos"
        description="Consultas entrantes desde la web pública listas para convertir en clientes."
      />

      {loading && <p className="muted">Cargando mensajes...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="data-grid">
        {items.map((message) => (
          <article className="record-card message-card" key={message.id}>
            <div className="record-icon"><Inbox size={22} /></div>
            <div>
              <h3>{message.fullName}</h3>
              <p>{message.message}</p>
              <span>{message.phone} · {message.email || 'Sin email'} · {message.serviceInterest || 'Sin servicio'}</span>
            </div>
            <button className="ghost-button"><UserPlus size={16} /> Convertir</button>
          </article>
        ))}
      </div>
    </div>
  );
}
