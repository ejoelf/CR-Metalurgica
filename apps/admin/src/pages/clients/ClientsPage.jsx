import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, UsersRound } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx';
import ClientCard from './ClientCard.jsx';
import ClientFormDrawer from './ClientFormDrawer.jsx';
import { clientsService } from '../../services/clientsService.js';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [success, setSuccess] = useState(null);

  async function loadClients(searchValue = search) {
    try {
      setLoading(true); setError('');
      const data = await clientsService.list({ search: searchValue });
      setClients(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message || 'No se pudieron cargar los clientes'); setClients([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { const timer = window.setTimeout(() => loadClients(search), 280); return () => window.clearTimeout(timer); }, [search]);
  const activeClients = useMemo(() => clients.filter((client) => client.status !== 'archived'), [clients]);

  async function openClient(client) { try { setLoading(true); const detail = await clientsService.getById(client.id); setSelectedClient(detail); setDrawerMode('edit'); } catch (err) { setError(err.message || 'No se pudo abrir el cliente'); } finally { setLoading(false); } }
  function openCreate() { setSelectedClient(null); setDrawerMode('create'); }
  function closeDrawer() { setDrawerMode(null); setSelectedClient(null); }

  async function handleSave(payload) {
    try {
      setSaving(true);
      if (drawerMode === 'create') {
        const created = await clientsService.create(payload);
        setSelectedClient(created); setDrawerMode('edit');
        setSuccess({ title: 'Cliente creado', description: `El cliente "${created.fullName}" se guardó correctamente.` });
      } else if (selectedClient?.id) {
        const updated = await clientsService.update(selectedClient.id, payload);
        setSelectedClient(updated);
        setSuccess({ title: 'Cliente actualizado', description: `El cliente "${updated.fullName}" se modificó correctamente.` });
      }
      await loadClients();
    } catch (err) { setError(err.message || 'No se pudo guardar el cliente'); }
    finally { setSaving(false); }
  }

  async function handleDelete(client) {
    if (!client?.id) return;
    try {
      setSaving(true); await clientsService.archive(client.id); closeDrawer(); await loadClients();
      setSuccess({ title: 'Cliente eliminado', description: `El cliente "${client.fullName}" se eliminó correctamente.` });
    } catch (err) { setError(err.message || 'No se pudo eliminar el cliente'); }
    finally { setSaving(false); }
  }

  return <div>
    <PageHeader eyebrow="CRM" title="Clientes" description="Alta, búsqueda, contacto rápido, historial y relación con trabajos y presupuestos." action={<button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Nuevo cliente</button>} />
    <div className="toolbar-card clients-toolbar"><div className="search-input"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, apellido, inicial, teléfono o email" /></div><span>{activeClients.length} clientes activos</span></div>
    {error && <p className="warning-box">{error}</p>}{loading && <LoadingState label="Cargando clientes..." />}
    {!loading && !activeClients.length && <EmptyState icon={UsersRound} title="Todavía no hay clientes" description="Creá el primer cliente desde el botón Nuevo cliente." action={<button className="crm-button primary" type="button" onClick={openCreate}><Plus size={16} /> Nuevo cliente</button>} />}
    {!loading && activeClients.length > 0 && <div className="clients-grid">{activeClients.map((client) => <ClientCard key={client.id} client={client} onOpen={openClient} />)}</div>}
    <ClientFormDrawer isOpen={Boolean(drawerMode)} mode={drawerMode || 'create'} client={selectedClient} saving={saving} onClose={closeDrawer} onSave={handleSave} onDelete={handleDelete} />
    <SuccessModal isOpen={Boolean(success)} title={success?.title} description={success?.description} onClose={() => setSuccess(null)} />
  </div>;
}
