import { Plus, Wrench } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { jobsService } from '../../services/resourceService.js';

const fallbackJobs = [
  { id: '1', title: 'Portón levadizo de ejemplo', serviceType: 'Metalúrgica', status: 'pending', priority: 'normal', client: { fullName: 'Cliente de ejemplo' }, estimatedPrice: 250000 },
  { id: '2', title: 'Pintura de estructura', serviceType: 'Pintura', status: 'production', priority: 'high', client: { fullName: 'Obra residencial' }, estimatedPrice: 180000 },
];

const statusLabels = {
  pending: 'Pendiente',
  quoted: 'Presupuestado',
  approved: 'Aprobado',
  production: 'Producción',
  painted: 'Pintado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function JobsPage() {
  const { items, loading, error } = useApiResource(jobsService, fallbackJobs);

  return (
    <div>
      <PageHeader
        eyebrow="Operación"
        title="Trabajos"
        description="Control de estados, costos, fechas, cliente asociado, fotos y seguimiento operativo."
        action={<button className="primary-button"><Plus size={18} /> Nuevo trabajo</button>}
      />

      {loading && <p className="muted">Cargando trabajos...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="kanban-grid">
        {Object.keys(statusLabels).map((status) => (
          <section className="kanban-column" key={status}>
            <h2>{statusLabels[status]}</h2>
            {items.filter((job) => job.status === status).map((job) => (
              <article className="kanban-card" key={job.id}>
                <div className="record-icon"><Wrench size={20} /></div>
                <h3>{job.title}</h3>
                <p>{job.client?.fullName || 'Sin cliente'} · {job.serviceType || 'Servicio'}</p>
                <span>Prioridad: {job.priority}</span>
                {job.estimatedPrice && <strong>$ {Number(job.estimatedPrice).toLocaleString('es-AR')}</strong>}
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
