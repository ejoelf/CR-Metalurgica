import { useEffect, useState } from 'react';
import { Plus, Receipt, Search } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import QuoteCard from './QuoteCard.jsx';
import QuoteFormDrawer from './QuoteFormDrawer.jsx';
import { quotesService } from '../../services/quotesService.js';
import { clientsService } from '../../services/clientsService.js';
import { jobsService } from '../../services/jobsService.js';
import { QUOTE_STATUS_LABELS } from '../../utils/statusLabels.js';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  async function loadQuotes() {
    try {
      setLoading(true);
      setError('');
      const data = await quotesService.list({ search, status: statusFilter });
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los presupuestos');
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadRelatedData() {
    try {
      const [clientsData, jobsData] = await Promise.all([
        clientsService.list(),
        jobsService.list(),
      ]);
      setClients(Array.isArray(clientsData) ? clientsData.filter((client) => client.status !== 'archived') : []);
      setJobs(Array.isArray(jobsData) ? jobsData.filter((job) => job.status !== 'cancelled') : []);
    } catch (err) {
      setClients([]);
      setJobs([]);
    }
  }

  useEffect(() => {
    loadRelatedData();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadQuotes, 280);
    return () => window.clearTimeout(timer);
  }, [search, statusFilter]);

  function openCreate() {
    setSelectedQuote(null);
    setDrawerMode('create');
  }

  async function openQuote(quote) {
    try {
      setLoading(true);
      const detail = await quotesService.getById(quote.id);
      setSelectedQuote(detail);
      setDrawerMode('edit');
    } catch (err) {
      setError(err.message || 'No se pudo abrir el presupuesto');
    } finally {
      setLoading(false);
    }
  }

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedQuote(null);
  }

  async function handleSave(payload) {
    try {
      setSaving(true);
      if (drawerMode === 'create') {
        const created = await quotesService.create(payload);
        setSelectedQuote(created);
        setDrawerMode('edit');
      } else if (selectedQuote?.id) {
        const updated = await quotesService.update(selectedQuote.id, payload);
        setSelectedQuote(updated);
      }
      await loadQuotes();
    } catch (err) {
      setError(err.message || 'No se pudo guardar el presupuesto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(quote) {
    if (!quote?.id) return;
    try {
      setSaving(true);
      await quotesService.remove(quote.id);
      closeDrawer();
      await loadQuotes();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el presupuesto');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(quote, status) {
    try {
      setSaving(true);
      await quotesService.updateStatus(quote.id, status);
      await loadQuotes();
      if (selectedQuote?.id === quote.id) {
        const detail = await quotesService.getById(quote.id);
        setSelectedQuote(detail);
      }
    } catch (err) {
      setError(err.message || 'No se pudo cambiar el estado del presupuesto');
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkSent(quote) {
    if (!quote?.id) return;
    try {
      setSaving(true);
      const updated = await quotesService.markAsSent(quote.id);
      setSelectedQuote(updated);
      await loadQuotes();
    } catch (err) {
      setError(err.message || 'No se pudo marcar como enviado');
    } finally {
      setSaving(false);
    }
  }

  async function handleGeneratePdf(quote) {
    if (!quote?.id) return;
    try {
      setSaving(true);
      const result = await quotesService.generatePdf(quote.id);
      const detail = await quotesService.getById(result.quoteId || quote.id);
      setSelectedQuote(detail);
      await loadQuotes();
    } catch (err) {
      setError(err.message || 'No se pudo generar el PDF');
    } finally {
      setSaving(false);
    }
  }

  async function handleConvertToJob(quote) {
    if (!quote?.id) return;
    try {
      setSaving(true);
      const result = await quotesService.convertToJob(quote.id);
      const detail = await quotesService.getById(result.quote?.id || quote.id);
      setSelectedQuote(detail);
      await Promise.all([loadQuotes(), loadRelatedData()]);
    } catch (err) {
      setError(err.message || 'No se pudo convertir el presupuesto en trabajo');
    } finally {
      setSaving(false);
    }
  }

  const activeQuotes = quotes.filter((quote) => quote.status !== 'cancelled');

  return (
    <div>
      <PageHeader
        eyebrow="Comercial"
        title="Presupuestos"
        description="Creación, edición, cálculo de totales, borradores, estados y envío simple por Gmail o WhatsApp."
        action={<button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Nuevo presupuesto</button>}
      />

      <div className="toolbar-card quotes-toolbar">
        <div className="search-input">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por número, título, cliente o trabajo" />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(QUOTE_STATUS_LABELS)
            .filter(([value]) => ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'].includes(value))
            .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <span>{activeQuotes.length} presupuestos activos</span>
      </div>

      {error && <p className="warning-box">{error}</p>}
      {loading && <LoadingState label="Cargando presupuestos..." />}

      {!loading && !activeQuotes.length && (
        <EmptyState
          icon={Receipt}
          title="Todavía no hay presupuestos"
          description="Creá el primer presupuesto desde el botón Nuevo presupuesto."
          action={<button className="crm-button primary" type="button" onClick={openCreate}><Plus size={16} /> Nuevo presupuesto</button>}
        />
      )}

      {!loading && activeQuotes.length > 0 && (
        <div className="quotes-grid-v2">
          {activeQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} onOpen={openQuote} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      <QuoteFormDrawer
        isOpen={Boolean(drawerMode)}
        mode={drawerMode || 'create'}
        quote={selectedQuote}
        clients={clients}
        jobs={jobs}
        saving={saving}
        onClose={closeDrawer}
        onSave={handleSave}
        onDelete={handleDelete}
        onMarkSent={handleMarkSent}
        onGeneratePdf={handleGeneratePdf}
        onConvertToJob={handleConvertToJob}
      />
    </div>
  );
}
