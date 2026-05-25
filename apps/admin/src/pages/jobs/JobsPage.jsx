import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Wrench } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx';
import JobCard from './JobCard.jsx';
import JobFormDrawer from './JobFormDrawer.jsx';
import { jobsService } from '../../services/jobsService.js';
import { clientsService } from '../../services/clientsService.js';
import { JOB_STATUS_LABELS, PRIORITY_LABELS } from '../../utils/statusLabels.js';

const statusOrder = ['pending', 'quoted', 'approved', 'production', 'painted', 'on_hold', 'rescheduled', 'completed', 'delivered', 'cancelled'];
const priorityWeight = { urgent: 0, high: 1, normal: 2, low: 3 };

function groupJobsByStatus(jobs) {
  return statusOrder.map((status) => ({
    status,
    label: JOB_STATUS_LABELS[status] || status,
    jobs: jobs.filter((job) => job.status === status).sort((a, b) => {
      const priorityDiff = (priorityWeight[a.priority] ?? 2) - (priorityWeight[b.priority] ?? 2);
      if (priorityDiff !== 0) return priorityDiff;
      const aDate = a.estimatedDeliveryDate ? new Date(a.estimatedDeliveryDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.estimatedDeliveryDate ? new Date(b.estimatedDeliveryDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    }),
  }));
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [success, setSuccess] = useState(null);

  async function loadJobs(params = {}) {
    try {
      setLoading(true); setError('');
      const data = await jobsService.list({ search, status: statusFilter, priority: priorityFilter, ...params });
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message || 'No se pudieron cargar los trabajos'); setJobs([]); }
    finally { setLoading(false); }
  }

  async function loadClients() {
    try { const data = await clientsService.list(); setClients(Array.isArray(data) ? data.filter((client) => client.status !== 'archived') : []); } catch { setClients([]); }
  }

  useEffect(() => { loadClients(); }, []);
  useEffect(() => { const timer = window.setTimeout(() => loadJobs(), 280); return () => window.clearTimeout(timer); }, [search, statusFilter, priorityFilter]);

  const groupedJobs = useMemo(() => groupJobsByStatus(jobs), [jobs]);
  const totalActive = jobs.filter((job) => job.status !== 'cancelled').length;

  function openCreate() { setSelectedJob(null); setDrawerMode('create'); }
  async function openJob(job) { try { setLoading(true); const detail = await jobsService.getById(job.id); setSelectedJob(detail); setDrawerMode('edit'); } catch (err) { setError(err.message || 'No se pudo abrir el trabajo'); } finally { setLoading(false); } }
  function closeDrawer() { setDrawerMode(null); setSelectedJob(null); }

  async function handleSave(payload) {
    try {
      setSaving(true);
      if (drawerMode === 'create') {
        const created = await jobsService.create(payload);
        closeDrawer();
        setSuccess({ title: 'Trabajo creado', description: `El trabajo "${created.title}" se creó correctamente.` });
      } else if (selectedJob?.id) {
        const updated = await jobsService.update(selectedJob.id, payload);
        closeDrawer();
        setSuccess({ title: 'Trabajo actualizado', description: `El trabajo "${updated.title}" se actualizó correctamente.` });
      }
      await loadJobs();
    } catch (err) { setError(err.message || 'No se pudo guardar el trabajo'); }
    finally { setSaving(false); }
  }

  async function handleDelete(job, closurePayload = {}) {
    if (!job?.id) return;
    try {
      setSaving(true);
      await jobsService.remove(job.id, closurePayload);
      closeDrawer(); await loadJobs();
      setSuccess({ title: 'Trabajo eliminado', description: `El trabajo "${job.title}" se eliminó correctamente.` });
    } catch (err) { setError(err.message || 'No se pudo eliminar el trabajo'); }
    finally { setSaving(false); }
  }

  async function handleStatusChange(job, status) {
    try {
      setSaving(true); const updated = await jobsService.updateStatus(job.id, status); await loadJobs();
      if (selectedJob?.id === job.id) setSelectedJob(await jobsService.getById(job.id));
      setSuccess({ title: 'Estado actualizado', description: `El trabajo "${updated.title}" pasó a ${JOB_STATUS_LABELS[status] || status}.` });
    } catch (err) { setError(err.message || 'No se pudo cambiar el estado'); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <PageHeader eyebrow="Operación" title="Trabajos" description="Seguimiento por estado, prioridad, cliente, fechas, pagos y presupuesto asociado." action={<button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Nuevo trabajo</button>} />
      <div className="toolbar-card jobs-toolbar"><div className="search-input"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, cliente o tipo de trabajo" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">Todos los estados</option>{Object.entries(JOB_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="">Todas las prioridades</option>{Object.entries(PRIORITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><span>{totalActive} trabajos activos</span></div>
      {error && <p className="warning-box">{error}</p>}{loading && <LoadingState label="Cargando trabajos..." />}
      {!loading && !jobs.length && <EmptyState icon={Wrench} title="Todavía no hay trabajos" description="Creá el primer trabajo asociándolo a un cliente existente." action={<button className="crm-button primary" type="button" onClick={openCreate}><Plus size={16} /> Nuevo trabajo</button>} />}
      {!loading && jobs.length > 0 && <div className="jobs-status-stack">{groupedJobs.map((group) => <section className={`jobs-status-section jobs-status-${group.status}`} key={group.status}><header><div><h2>{group.label}</h2><p>{group.jobs.length} trabajos en este estado</p></div><span>{group.jobs.length}</span></header>{group.jobs.length ? <div className="jobs-grid">{group.jobs.map((job) => <JobCard key={job.id} job={job} onOpen={openJob} onStatusChange={handleStatusChange} />)}</div> : <div className="jobs-empty-line">Sin trabajos en {(group.label || 'este estado').toLowerCase()}.</div>}</section>)}</div>}
      <JobFormDrawer isOpen={Boolean(drawerMode)} mode={drawerMode || 'create'} job={selectedJob} clients={clients} saving={saving} onClose={closeDrawer} onSave={handleSave} onDelete={handleDelete} />
      <SuccessModal isOpen={Boolean(success)} title={success?.title} description={success?.description} onClose={() => setSuccess(null)} />
    </div>
  );
}
