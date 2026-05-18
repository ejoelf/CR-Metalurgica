import { useEffect, useMemo, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import MoneyInput from '../../components/common/MoneyInput.jsx';
import DateInput from '../../components/common/DateInput.jsx';
import { formatDateTime, toInputDate } from '../../utils/formatters.js';

const EMPTY_FORM = {
  type: 'income',
  title: '',
  description: '',
  amount: '',
  movementDate: toInputDate(new Date()),
  status: 'paid',
  category: 'general',
  paymentMethod: '',
  supplierName: '',
  clientId: '',
  jobId: '',
  quoteId: '',
};

function toForm(movement) {
  if (!movement) return EMPTY_FORM;
  const type = movement.movementType || movement.type || 'income';
  return {
    type,
    title: movement.title || '',
    description: movement.description || '',
    amount: movement.amount ?? '',
    movementDate: toInputDate(movement.movementDate || movement.paidAt || movement.expenseDate || movement.createdAt),
    status: movement.status || 'paid',
    category: movement.category || 'general',
    paymentMethod: movement.paymentMethod || '',
    supplierName: movement.supplierName || '',
    clientId: movement.clientId || movement.client?.id || '',
    jobId: movement.jobId || movement.job?.id || '',
    quoteId: movement.quoteId || movement.quote?.id || '',
  };
}

export default function MovementDrawer({ isOpen, mode = 'create', movement, clients = [], jobs = [], quotes = [], saving = false, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setForm(toForm(movement));
  }, [movement, isOpen]);

  const original = useMemo(() => JSON.stringify(toForm(movement)), [movement]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;
  const maxDate = toInputDate(new Date());

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((state) => ({ ...state, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave?.(form);
  }

  const filteredJobs = form.clientId ? jobs.filter((job) => job.clientId === form.clientId || job.client?.id === form.clientId) : jobs;
  const filteredQuotes = form.clientId ? quotes.filter((quote) => quote.clientId === form.clientId || quote.client?.id === form.clientId) : quotes;

  const footer = (
    <>
      {mode === 'edit' && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="movement-form" disabled={saving || !hasChanges || !form.title || !form.amount}>
        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </>
  );

  return (
    <>
      <BaseDrawer
        isOpen={isOpen}
        title={mode === 'create' ? 'Nuevo movimiento' : movement?.title || 'Detalle del movimiento'}
        description="Registrá ingresos, egresos, pagos parciales, señas, gastos y movimientos relacionados."
        onClose={onClose}
        size="lg"
        footer={footer}
      >
        <form id="movement-form" className="finance-form-grid" onSubmit={handleSubmit}>
          <section className="finance-panel finance-span-2">
            <h3>Tipo y datos principales</h3>
            <div className="finance-form-inner">
              <label className="crm-field"><span>Tipo</span><select name="type" value={form.type} onChange={handleChange} disabled={mode === 'edit'}><option value="income">Ingreso</option><option value="expense">Egreso</option></select></label>
              <label className="crm-field"><span>Título</span><input name="title" value={form.title} onChange={handleChange} required placeholder="Seña, pago final, materiales..." /></label>
              <MoneyInput label="Monto" name="amount" value={form.amount} onChange={handleChange} required />
              <DateInput label="Fecha" name="movementDate" value={form.movementDate} onChange={handleChange} max={maxDate} />
              {form.type === 'income' && <label className="crm-field"><span>Estado</span><select name="status" value={form.status} onChange={handleChange}><option value="paid">Pagado</option><option value="pending">Pendiente</option><option value="cancelled">Cancelado</option></select></label>}
              {form.type === 'expense' && <label className="crm-field"><span>Categoría</span><select name="category" value={form.category} onChange={handleChange}><option value="general">General</option><option value="materials">Materiales</option><option value="tools">Herramientas</option><option value="transport">Transporte</option><option value="taxes">Impuestos</option><option value="services">Servicios</option></select></label>}
              <label className="crm-field"><span>Método de pago</span><input name="paymentMethod" value={form.paymentMethod} onChange={handleChange} placeholder="Efectivo, transferencia, tarjeta..." /></label>
              {form.type === 'expense' && <label className="crm-field"><span>Proveedor</span><input name="supplierName" value={form.supplierName} onChange={handleChange} placeholder="Proveedor o comercio" /></label>}
            </div>
          </section>

          <section className="finance-panel finance-span-2">
            <h3>Relaciones</h3>
            <div className="finance-form-inner">
              <label className="crm-field"><span>Cliente</span><select name="clientId" value={form.clientId} onChange={handleChange}><option value="">Sin cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.fullName}</option>)}</select></label>
              <label className="crm-field"><span>Trabajo</span><select name="jobId" value={form.jobId} onChange={handleChange}><option value="">Sin trabajo</option>{filteredJobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
              <label className="crm-field"><span>Presupuesto</span><select name="quoteId" value={form.quoteId} onChange={handleChange}><option value="">Sin presupuesto</option>{filteredQuotes.map((quote) => <option key={quote.id} value={quote.id}>{quote.quoteNumber} · {quote.title}</option>)}</select></label>
            </div>
          </section>

          <section className="finance-panel finance-span-2">
            <h3>Descripción</h3>
            <label className="crm-field"><textarea name="description" value={form.description} onChange={handleChange} placeholder="Detalle interno del movimiento" /></label>
            {mode === 'edit' && <p className="finance-muted">Creado/actualizado: {formatDateTime(movement?.createdAt || movement?.updatedAt)}</p>}
          </section>
        </form>
      </BaseDrawer>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Eliminar movimiento"
        description={`¿Estás seguro de querer eliminar ${movement?.title || 'este movimiento'}?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={saving}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete?.(movement)}
      />
    </>
  );
}
