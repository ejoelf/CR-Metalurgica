import { CalendarDays, Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { agendaService } from '../../services/resourceService.js';

const fallbackEvents = [
  { id: '1', title: 'Medición portón', type: 'measurement', status: 'scheduled', startAt: new Date().toISOString(), client: { fullName: 'Cliente de ejemplo' } },
  { id: '2', title: 'Entrega estructura', type: 'delivery', status: 'scheduled', startAt: new Date(Date.now() + 86400000).toISOString(), client: { fullName: 'Obra residencial' } },
];

export default function AgendaPage() {
  const { items, loading, error } = useApiResource(agendaService, fallbackEvents);

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Calendario operativo"
        description="Visitas, mediciones, entregas, cobros y recordatorios internos."
        action={<button className="primary-button"><Plus size={18} /> Nuevo evento</button>}
      />

      {loading && <p className="muted">Cargando agenda...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="timeline-list">
        {items.map((event) => (
          <article className="timeline-item" key={event.id}>
            <div className="record-icon"><CalendarDays size={22} /></div>
            <div>
              <h3>{event.title}</h3>
              <p>{event.client?.fullName || 'Sin cliente'} · {event.type}</p>
              <span>{new Date(event.startAt).toLocaleString('es-AR')} · {event.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
