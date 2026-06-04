import { useEffect, useMemo, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import DateInput from '../../components/common/DateInput.jsx';
import TimeInput from '../../components/common/TimeInput.jsx';
import { buildArgentinaDateTime, formatDateTime, toInputDate } from '../../utils/formatters.js';

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'other',
  status: 'scheduled',
  date: toInputDate(new Date()),
  startTime: '09:00',
  endTime: '',
  reminderDate: '',
  reminderTime: '',
  location: '',
  clientId: '',
  jobId: '',
  quoteId: '',
};

function splitDateTime(value) {
  if (!value) return { date: '', time: '' };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: '', time: '' };

  const inputDate = toInputDate(date);
  const inputDateTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Cordoba',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return {
    date: inputDate,
    time: inputDateTime,
  };
}

function toForm(event, defaultDate) {
  if (!event) return { ...EMPTY_FORM, date: defaultDate || EMPTY_FORM.date };
  const start = splitDateTime(event.startAt);
  const end = splitDateTime(event.endAt);
  const reminder = splitDateTime(event.reminderAt);
  return {
    title: event.title || '',
    description: event.description || '',
    type: event.type || 'other',
    status: event.status || 'scheduled',
    date: start.date || defaultDate || EMPTY_FORM.date,
    startTime: start.time || '09:00',
    endTime: end.time || '',
    reminderDate: reminder.date || '',
    reminderTime: reminder.time || '',
    location: event.location || '',
    clientId: event.clientId || event.client?.id || '',
    jobId: event.jobId || event.job?.id || '',
    quoteId: event.quoteId || event.quote?.id || '',
  };
}

function buildDateTime(date, time) {
  return buildArgentinaDateTime(date, time);
}

export default function EventDrawer({ isOpen, mode = 'create', event, defaultDate, clients = [], jobs = [], quotes = [], saving = false, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(() => toForm(null, defaultDate));
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setForm(toForm(event, defaultDate));
  }, [event, defaultDate, isOpen]);

  const original = useMemo(() => JSON.stringify(toForm(event, defaultDate)), [event, defaultDate]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;

  const filteredJobs = form.clientId ? jobs.filter((job) => job.clientId === form.clientId || job.client?.id === form.clientId) : jobs;
  const filteredQuotes = form.clientId ? quotes.filter((quote) => quote.clientId === form.clientId || quote.client?.id === form.clientId) : quotes;

  function handleChange(eventChange) {
    const { name, value } = eventChange.target;
    setForm((state) => ({ ...state, [name]: value }));
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    onSave?.({
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
      startAt: buildDateTime(form.date, form.startTime),
      endAt: buildDateTime(form.date, form.endTime),
      reminderAt: buildDateTime(form.reminderDate, form.reminderTime),
      location: form.location,
      clientId: form.clientId || null,
      jobId: form.jobId || null,
      quoteId: form.quoteId || null,
    });
  }

  const footer = (
    <>
      {mode === 'edit' && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="event-form" disabled={saving || !hasChanges || !form.title || !form.date || !form.startTime}>
        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </>
  );

  return (
    <>
      <BaseDrawer
        isOpen={isOpen}
        title={mode === 'create' ? 'Nuevo evento' : event?.title || 'Detalle del evento'}
        description="Creá visitas, entregas, mediciones, pagos, recordatorios y tareas relacionadas al trabajo diario."
        onClose={onClose}
        size="lg"
        footer={footer}
      >
        <form id="event-form" className="agenda-form-grid" onSubmit={handleSubmit}>
          <section className="agenda-panel agenda-span-2">
            <h3>Datos principales</h3>
            <div className="agenda-form-inner">
              <label className="crm-field agenda-span-2"><span>Título</span><input name="title" value={form.title} onChange={handleChange} required placeholder="Visita, entrega, medición..." /></label>
              <label className="crm-field"><span>Tipo</span><select name="type" value={form.type} onChange={handleChange}><option value="visit">Visita</option><option value="measurement">Medición</option><option value="production">Producción</option><option value="painting">Pintura</option><option value="delivery">Entrega</option><option value="payment">Pago</option><option value="reminder">Recordatorio</option><option value="other">Otro</option></select></label>
              <label className="crm-field"><span>Estado</span><select name="status" value={form.status} onChange={handleChange}><option value="scheduled">Programado</option><option value="completed">Completado</option><option value="postponed">Postergado</option><option value="cancelled">Cancelado</option></select></label>
              <DateInput label="Fecha" name="date" value={form.date} onChange={handleChange} />
              <TimeInput label="Hora inicio" name="startTime" value={form.startTime} onChange={handleChange} />
              <TimeInput label="Hora fin" name="endTime" value={form.endTime} onChange={handleChange} />
              <label className="crm-field"><span>Ubicación</span><input name="location" value={form.location} onChange={handleChange} placeholder="Dirección o referencia" /></label>
              <label className="crm-field agenda-span-2"><span>Descripción</span><textarea name="description" value={form.description} onChange={handleChange} placeholder="Detalle del evento" /></label>
            </div>
          </section>

          <section className="agenda-panel agenda-span-2">
            <h3>Relaciones</h3>
            <div className="agenda-form-inner">
              <label className="crm-field"><span>Cliente</span><select name="clientId" value={form.clientId} onChange={handleChange}><option value="">Sin cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.fullName}</option>)}</select></label>
              <label className="crm-field"><span>Trabajo</span><select name="jobId" value={form.jobId} onChange={handleChange}><option value="">Sin trabajo</option>{filteredJobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
              <label className="crm-field"><span>Presupuesto</span><select name="quoteId" value={form.quoteId} onChange={handleChange}><option value="">Sin presupuesto</option>{filteredQuotes.map((quote) => <option key={quote.id} value={quote.id}>{quote.quoteNumber} · {quote.title}</option>)}</select></label>
            </div>
          </section>

          <section className="agenda-panel agenda-span-2">
            <h3>Recordatorio interno preparado</h3>
            <div className="agenda-form-inner">
              <DateInput label="Fecha recordatorio" name="reminderDate" value={form.reminderDate} onChange={handleChange} />
              <TimeInput label="Hora recordatorio" name="reminderTime" value={form.reminderTime} onChange={handleChange} />
            </div>
            <p className="agenda-muted">Por ahora queda guardado en el sistema. En una próxima integración se puede disparar notificación push, email o WhatsApp.</p>
            {mode === 'edit' && <p className="agenda-muted">Creado/actualizado: {formatDateTime(event?.createdAt || event?.updatedAt)}</p>}
          </section>
        </form>
      </BaseDrawer>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Eliminar evento"
        description={`¿Estás seguro de querer eliminar ${event?.title || 'este evento'}?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={saving}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete?.(event)}
      />
    </>
  );
}
