import { useMemo, useState } from 'react';
import { Plus, Search, UserRound } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { clientsService } from '../../services/resourceService.js';

const fallbackClients = [
  { id: '1', fullName: 'Cliente de ejemplo', phone: '3580000000', email: 'cliente@ejemplo.com', status: 'lead', city: 'Las Higueras' },
];

export default function ClientsPage() {
  const { items, loading, error } = useApiResource(clientsService, fallbackClients);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return items.filter((client) => `${client.fullName} ${client.phone} ${client.email || ''}`.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  return (
    <div>
      <PageHeader
        eyebrow="CRM"
        title="Clientes"
        description="Listado, búsqueda, historial, notas y relación con trabajos y presupuestos."
        action={<button className="primary-button"><Plus size={18} /> Nuevo cliente</button>}
      />

      <div className="toolbar-card">
        <div className="search-input"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, teléfono o email" /></div>
      </div>

      {loading && <p className="muted">Cargando clientes...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="data-grid">
        {filtered.map((client) => (
          <article className="record-card" key={client.id}>
            <div className="record-icon"><UserRound size={22} /></div>
            <div>
              <h3>{client.fullName}</h3>
              <p>{client.phone}</p>
              <span>{client.email || 'Sin email'} · {client.city || 'Sin ciudad'}</span>
            </div>
            <strong className={`status-pill ${client.status}`}>{client.status}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
