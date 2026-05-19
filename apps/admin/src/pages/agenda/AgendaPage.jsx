import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EventDrawer from './EventDrawer.jsx';
import { agendaService } from '../../services/agendaService.js';
import { clientsService } from '../../services/clientsService.js';
import { jobsService } from '../../services/jobsService.js';
import { quotesService } from '../../services/quotesService.js';
import { formatDate, formatDateTime } from '../../utils/formatters.js';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const typeLabels = {
  visit: 'Visita',
  measurement: 'Medición',
  production: 'Producción',
  painting: 'Pintura',
  delivery: 'Entrega',
  payment: 'Pago',
  reminder: 'Recordatorio',
  other: 'Otro',
};
const statusLabels = {
  scheduled: 'Programado',
  completed: 'Completado',
  postponed: 'Postergado',
  cancelled: 'Cancelado',
};

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function buildCalendarDays(date) {
  const start = monthStart(date);
  const end = monthEnd(date);
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - start.getDay());

  const days = [];
  const cursor = new Date(gridStart);
  while (days.length < 42) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return { days, start, end };
}

function sameDay(a, b) {
  return toDateInput(new Date(a)) === toDateInput(new Date(b));
}

export default function AgendaPage() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const calendar = useMemo(() => buildCalendarDays(currentDate), [currentDate]);

  async function loadEvents() {
    try {
      setLoading(true);
      setError('');
      const data = await agendaService.list({
        start: calendar.start.toISOString(),
        end: calendar.end.toISOString(),
        search,
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la agenda');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadRelated() {
    try {
      const [clientsData, jobsData, quotesData] = await Promise.all([
        clientsService.list(),
        jobsService.list(),
        quotesService.list(),
      ]);
      setClients(Array.isArray(clientsData) ? clientsData.filter((client) => client.status !== 'archived') : []);
      setJobs(Array.isArray(jobsData) ? jobsData.filter((job) => job.status !== 'cancelled') : []);
      setQuotes(Array.isArray(quotesData) ? quotesData.filter((quote) => quote.status !== 'cancelled') : []);
    } catch {
      setClients([]);
      setJobs([]);
      setQuotes([]);
    }
  }

  useEffect(() => {
    loadRelated();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadEvents, 250);
    return () => window.clearTimeout(timer);
  }, [calendar.start.getTime(), calendar.end.getTime(), search]);

  const selectedDayEvents = useMemo(() => events.filter((event) => sameDay(event.startAt, selectedDate) && event.status !== 'cancelled'), [events, selectedDate]);

  function previousMonth() {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  function goToday() {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(toDateInput(today));
  }

  function openCreate(date = selectedDate) {
    setSelectedEvent(null);
    setSelectedDate(date);
    setDrawerMode('create');
  }

  async function openEvent(event) {
    try {
      setLoading(true);
      const detail = await agendaService.getById(event.id);
      setSelectedEvent(detail);
      setDrawerMode('edit');
    } catch (err) {
      setError(err.message || 'No se pudo abrir el evento');
    } finally {
      setLoading(false);
    }
  }

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedEvent(null);
  }

  async function handleSave(payload) {
    try {
      setSaving(true);
      if (drawerMode === 'create') {
        const created = await agendaService.create(payload);
        setSelectedEvent(created);
        setDrawerMode('edit');
      } else if (selectedEvent?.id) {
        const updated = await agendaService.update(selectedEvent.id, payload);
        setSelectedEvent(updated);
      }
      await loadEvents();
    } catch (err) {
      setError(err.message || 'No se pudo guardar el evento');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    if (!event?.id) return;
    try {
      setSaving(true);
      await agendaService.remove(event.id);
      closeDrawer();
      await loadEvents();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el evento');
    } finally {
      setSaving(false);
    }
  }

  const monthLabel = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(currentDate);

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Calendario operativo"
        description="Visitas, mediciones, entregas, cobros, tareas y recordatorios internos."
        action={<button className="primary-button" type="button" onClick={() => openCreate()}><Plus size={18} /> Nuevo evento</button>}
      />

      <section className="toolbar-card agenda-toolbar">
        <div className="agenda-month-nav">
          <button type="button" onClick={previousMonth} aria-label="Mes anterior"><ChevronLeft size={18} /></button>
          <strong>{monthLabel}</strong>
          <button type="button" onClick={nextMonth} aria-label="Mes siguiente"><ChevronRight size={18} /></button>
        </div>
        <button className="crm-button" type="button" onClick={goToday}>Hoy</button>
        <div className="search-input">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar eventos" />
        </div>
      </section>

      {error && <p className="warning-box">{error}</p>}
      {loading && <LoadingState label="Cargando agenda..." />}

      <section className="agenda-layout">
        <div className="agenda-calendar-card">
          <div className="agenda-weekdays">
            {dayNames.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="agenda-calendar-grid">
            {calendar.days.map((day) => {
              const dateKey = toDateInput(day);
              const dayEvents = events.filter((event) => sameDay(event.startAt, dateKey) && event.status !== 'cancelled');
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = dateKey === selectedDate;
              const isToday = dateKey === toDateInput(new Date());

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={`agenda-day-cell ${isCurrentMonth ? '' : 'is-muted'} ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                  onClick={() => setSelectedDate(dateKey)}
                  onDoubleClick={() => openCreate(dateKey)}
                >
                  <span>{day.getDate()}</span>
                  <small>{dayEvents.length ? `${dayEvents.length} evento${dayEvents.length > 1 ? 's' : ''}` : ''}</small>
                  <i>{dayEvents.slice(0, 2).map((event) => <em key={event.id}>{event.title}</em>)}</i>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="agenda-day-panel">
          <header>
            <div>
              <span>Día seleccionado</span>
              <h2>{formatDate(selectedDate)}</h2>
            </div>
            <button className="crm-button primary" type="button" onClick={() => openCreate(selectedDate)}><Plus size={16} /> Evento</button>
          </header>

          {!selectedDayEvents.length ? (
            <EmptyState
              icon={CalendarDays}
              title="Sin eventos este día"
              description="Podés crear una visita, medición, entrega, pago o recordatorio."
            />
          ) : (
            <div className="agenda-event-list">
              {selectedDayEvents.map((event) => (
                <button className={`agenda-event-card is-${event.type}`} key={event.id} type="button" onClick={() => openEvent(event)}>
                  <span>{typeLabels[event.type] || event.type} · {statusLabels[event.status] || event.status}</span>
                  <strong>{event.title}</strong>
                  <small>{formatDateTime(event.startAt)} {event.location ? `· ${event.location}` : ''}</small>
                  <p>{event.client?.fullName || event.job?.title || event.quote?.title || 'Sin relación'}</p>
                </button>
              ))}
            </div>
          )}
        </aside>
      </section>

      <EventDrawer
        isOpen={Boolean(drawerMode)}
        mode={drawerMode || 'create'}
        event={selectedEvent}
        defaultDate={selectedDate}
        clients={clients}
        jobs={jobs}
        quotes={quotes}
        saving={saving}
        onClose={closeDrawer}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
