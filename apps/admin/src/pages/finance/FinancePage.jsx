import { useEffect, useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, CalendarDays, Download, Plus, Search, WalletCards } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx';
import MovementDrawer from './MovementDrawer.jsx';
import { financeService } from '../../services/financeService.js';
import { clientsService } from '../../services/clientsService.js';
import { jobsService } from '../../services/jobsService.js';
import { quotesService } from '../../services/quotesService.js';
import { formatDate, formatMoney } from '../../utils/formatters.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
function currentMonth() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; }
function parseMonth(value) { const [year, month] = String(value || currentMonth()).split('-'); return { year, month }; }
function buildPublicPdfUrl(pdfUrl) { if (!pdfUrl) return ''; return pdfUrl.startsWith('http') ? pdfUrl : `${API_BASE}${pdfUrl}`; }

export default function FinancePage() {
  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [viewMode, setViewMode] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');
  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [success, setSuccess] = useState(null);

  const queryParams = useMemo(() => viewMode === 'day' ? { date: selectedDate, type: typeFilter } : { ...parseMonth(selectedMonth), type: typeFilter }, [viewMode, selectedMonth, selectedDate, typeFilter]);

  async function loadFinance() {
    try { setLoading(true); setError(''); const [summaryData, movementsData] = await Promise.all([financeService.summary(queryParams), financeService.movements(queryParams)]); setSummary(summaryData); setMovements(Array.isArray(movementsData) ? movementsData : []); }
    catch (err) { setError(err.message || 'No se pudieron cargar las finanzas'); setSummary(null); setMovements([]); }
    finally { setLoading(false); }
  }
  async function loadRelated() { try { const [clientsData, jobsData, quotesData] = await Promise.all([clientsService.list(), jobsService.list(), quotesService.list()]); setClients(Array.isArray(clientsData) ? clientsData.filter((client) => client.status !== 'archived') : []); setJobs(Array.isArray(jobsData) ? jobsData.filter((job) => job.status !== 'cancelled') : []); setQuotes(Array.isArray(quotesData) ? quotesData.filter((quote) => quote.status !== 'cancelled') : []); } catch { setClients([]); setJobs([]); setQuotes([]); } }
  useEffect(() => { loadRelated(); }, []);
  useEffect(() => { loadFinance(); }, [queryParams]);

  const visibleMovements = useMemo(() => { const term = search.trim().toLowerCase(); if (!term) return movements; return movements.filter((item) => [item.title, item.description, item.client?.fullName, item.job?.title, item.quote?.title, item.paymentMethod, item.category].filter(Boolean).some((value) => String(value).toLowerCase().includes(term))); }, [movements, search]);
  function openCreate() { setSelectedMovement(null); setDrawerMode('create'); }
  async function openMovement(movement) { try { setLoading(true); const detail = await financeService.movementDetail(movement.movementType, movement.id); setSelectedMovement(detail); setDrawerMode('edit'); } catch (err) { setError(err.message || 'No se pudo abrir el movimiento'); } finally { setLoading(false); } }
  function closeDrawer() { setDrawerMode(null); setSelectedMovement(null); }
  async function handleSave(payload) {
    try {
      setSaving(true);
      if (drawerMode === 'create') { const created = await financeService.createMovement(payload); closeDrawer(); setSuccess({ title: 'Movimiento creado', description: `El movimiento "${created.title}" se guardó correctamente.` }); }
      else if (selectedMovement?.id) { const updated = await financeService.updateMovement(selectedMovement.movementType, selectedMovement.id, payload); closeDrawer(); setSuccess({ title: 'Movimiento actualizado', description: `El movimiento "${updated.title}" se modificó correctamente.` }); }
      await loadFinance();
    } catch (err) { setError(err.message || 'No se pudo guardar el movimiento'); }
    finally { setSaving(false); }
  }
  async function handleDelete(movement) { if (!movement?.id) return; try { setSaving(true); await financeService.deleteMovement(movement.movementType, movement.id); closeDrawer(); await loadFinance(); setSuccess({ title: 'Movimiento eliminado', description: `El movimiento "${movement.title}" se eliminó correctamente.` }); } catch (err) { setError(err.message || 'No se pudo eliminar el movimiento'); } finally { setSaving(false); } }
  async function handleDownloadReport() { try { setReportLoading(true); setError(''); const data = await financeService.generateReportPdf(queryParams); const url = buildPublicPdfUrl(data.publicUrl); if (url) window.open(url, '_blank', 'noopener,noreferrer'); setSuccess({ title: 'Reporte generado', description: 'El PDF financiero se generó correctamente.' }); } catch (err) { setError(err.message || 'No se pudo generar el reporte PDF'); } finally { setReportLoading(false); } }

  return <div>
    <PageHeader eyebrow="Finanzas" title="Ingresos, egresos y balance" description="Control de caja, pagos parciales, señas, gastos, filtros por fecha y relación con clientes, trabajos y presupuestos." action={<button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Nuevo movimiento</button>} />
    <section className="kpi-grid finance-kpis"><article className="kpi-card green"><ArrowUpCircle size={24} /><div><span>Ingresos cobrados</span><strong>{formatMoney(summary?.totalIncome || 0)}</strong></div></article><article className="kpi-card red"><ArrowDownCircle size={24} /><div><span>Egresos</span><strong>{formatMoney(summary?.totalExpenses || 0)}</strong></div></article><article className="kpi-card blue"><WalletCards size={24} /><div><span>Balance</span><strong>{formatMoney(summary?.balance || 0)}</strong></div></article></section>
    <section className="toolbar-card finance-toolbar-v2"><div className="finance-mode-toggle"><button className={viewMode === 'month' ? 'is-active' : ''} type="button" onClick={() => setViewMode('month')}>Mensual</button><button className={viewMode === 'day' ? 'is-active' : ''} type="button" onClick={() => setViewMode('day')}>Diario</button></div>{viewMode === 'month' ? <input type="month" value={selectedMonth} max={currentMonth()} onChange={(event) => setSelectedMonth(event.target.value)} /> : <input type="date" value={selectedDate} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setSelectedDate(event.target.value)} />}<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="">Ingresos y egresos</option><option value="income">Solo ingresos</option><option value="expense">Solo egresos</option></select><div className="search-input"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar movimiento" /></div><button className="crm-button finance-report-button" type="button" onClick={handleDownloadReport} disabled={reportLoading}><Download size={16} /> {reportLoading ? 'Generando...' : 'Descargar PDF'}</button></section>
    {error && <p className="warning-box">{error}</p>}{loading && <LoadingState label="Cargando finanzas..." />}
    {!loading && !visibleMovements.length && <EmptyState icon={CalendarDays} title="No hay movimientos en este período" description="Registrá ingresos o egresos desde el botón Nuevo movimiento." action={<button className="crm-button primary" type="button" onClick={openCreate}><Plus size={16} /> Nuevo movimiento</button>} />}
    {!loading && visibleMovements.length > 0 && <section className="finance-list-card"><header><h2>Movimientos</h2><span>{visibleMovements.length} registros</span></header><div className="finance-movement-list">{visibleMovements.map((item) => <button key={`${item.movementType}-${item.id}`} className={`finance-movement-row is-${item.movementType}`} type="button" onClick={() => openMovement(item)}><span className="finance-type-dot" /><span><strong>{item.title}</strong><small>{formatDate(item.movementDate)} · {item.client?.fullName || 'Sin cliente'} {item.job?.title ? `· ${item.job.title}` : ''}</small></span><b>{item.movementType === 'income' ? '+' : '-'} {formatMoney(item.amount)}</b></button>)}</div></section>}
    <MovementDrawer isOpen={Boolean(drawerMode)} mode={drawerMode || 'create'} movement={selectedMovement} clients={clients} jobs={jobs} quotes={quotes} saving={saving} onClose={closeDrawer} onSave={handleSave} onDelete={handleDelete} />
    <SuccessModal isOpen={Boolean(success)} title={success?.title} description={success?.description} onClose={() => setSuccess(null)} />
  </div>;
}
