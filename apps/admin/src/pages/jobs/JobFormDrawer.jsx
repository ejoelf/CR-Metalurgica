import { useEffect, useMemo, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import PriorityBadge from '../../components/common/PriorityBadge.jsx';
import MoneyInput from '../../components/common/MoneyInput.jsx';
import DateInput from '../../components/common/DateInput.jsx';
import { JOB_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/statusLabels.js';
import { formatDate, formatMoney, formatPercent, toInputDate } from '../../utils/formatters.js';

const EMPTY_FORM = { clientId: '', title: '', description: '', serviceType: '', status: 'pending', priority: 'normal', estimatedStartDate: '', estimatedDeliveryDate: '', realStartDate: '', realDeliveryDate: '', estimatedPrice: '', finalPrice: '', internalNotes: '' };
const EMPTY_CLOSE = { refundMoney: false, refundAmount: '', refundMethod: 'cash', refundNote: '' };
const CLOSED_STATUSES = ['cancelled', 'delivered'];

function toForm(job) {
  if (!job) return EMPTY_FORM;
  return { clientId: job.clientId || job.client?.id || '', title: job.title || '', description: job.description || '', serviceType: job.serviceType || '', status: job.status || 'pending', priority: job.priority || 'normal', estimatedStartDate: toInputDate(job.estimatedStartDate), estimatedDeliveryDate: toInputDate(job.estimatedDeliveryDate), realStartDate: toInputDate(job.realStartDate), realDeliveryDate: toInputDate(job.realDeliveryDate), estimatedPrice: job.estimatedPrice ?? '', finalPrice: job.finalPrice ?? '', internalNotes: job.internalNotes || '' };
}

export default function JobFormDrawer({ isOpen, mode = 'create', job, clients = [], saving = false, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [closePayload, setClosePayload] = useState(EMPTY_CLOSE);

  useEffect(() => { setForm(toForm(job)); setClosePayload(EMPTY_CLOSE); }, [job, isOpen]);

  const original = useMemo(() => JSON.stringify(toForm(job)), [job]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;
  const isClosed = mode === 'edit' && CLOSED_STATUSES.includes(job?.status);

  function handleChange(event) { const { name, value } = event.target; setForm((state) => ({ ...state, [name]: value })); }
  function handleClosePayloadChange(event) { const { name, value, type, checked } = event.target; setClosePayload((state) => ({ ...state, [name]: type === 'checkbox' ? checked : value })); }
  function handleSubmit(event) { event.preventDefault(); if (!isClosed) onSave?.(form); }
  function confirmDelete() { onDelete?.(job, closePayload); }

  const footer = <>{mode === 'edit' && !isClosed && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}<button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>{!isClosed && <button className="crm-button primary" type="submit" form="job-form" disabled={saving || !hasChanges || !form.clientId || !form.title}><Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}</button>}</>;

  return <>
    <BaseDrawer isOpen={isOpen} title={mode === 'create' ? 'Nuevo trabajo' : job?.title || 'Detalle del trabajo'} description={isClosed ? 'Este trabajo está cerrado. Podés consultar la información, pero no modificarlo.' : 'Gestioná estado, prioridad, cliente, fechas, costos, pagos y seguimiento operativo.'} onClose={onClose} size="xl" footer={footer}>
      {isClosed && <p className="warning-box">Este trabajo quedó cerrado como {JOB_STATUS_LABELS[job?.status] || job?.status}. No se permiten cambios operativos.</p>}
      <form id="job-form" className="job-detail-grid" onSubmit={handleSubmit}>
        <section className="job-panel"><h3>Datos principales</h3><div className="job-form-grid">
          <label className="crm-field job-span-2"><span>Cliente</span><select name="clientId" value={form.clientId} onChange={handleChange} required disabled={isClosed}><option value="">Seleccionar cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.fullName}</option>)}</select></label>
          <label className="crm-field"><span>Título</span><input name="title" value={form.title} onChange={handleChange} required placeholder="Portón, estructura, pintura..." disabled={isClosed} /></label>
          <label className="crm-field"><span>Tipo de trabajo</span><input name="serviceType" value={form.serviceType} onChange={handleChange} placeholder="Metalúrgica, pintura, herrería..." disabled={isClosed} /></label>
          <label className="crm-field"><span>Estado</span><select name="status" value={form.status} onChange={handleChange} disabled={isClosed || job?.status === 'completed'}>{Object.entries(JOB_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="crm-field"><span>Prioridad</span><select name="priority" value={form.priority} onChange={handleChange} disabled={isClosed}><option value="low">Baja</option><option value="normal">Normal</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></label>
          <label className="crm-field job-span-2"><span>Descripción</span><textarea name="description" value={form.description} onChange={handleChange} placeholder="Detalle del trabajo a realizar" disabled={isClosed} /></label>
        </div></section>
        <section className="job-panel"><h3>Fechas</h3><div className="job-form-grid"><DateInput label="Inicio estimado" name="estimatedStartDate" value={form.estimatedStartDate} onChange={handleChange} disabled={isClosed} /><DateInput label="Entrega estimada" name="estimatedDeliveryDate" value={form.estimatedDeliveryDate} onChange={handleChange} disabled={isClosed} /><DateInput label="Inicio real" name="realStartDate" value={form.realStartDate} onChange={handleChange} disabled={isClosed} /><DateInput label="Entrega real" name="realDeliveryDate" value={form.realDeliveryDate} onChange={handleChange} disabled={isClosed} /></div></section>
        <section className="job-panel"><h3>Costos y pagos</h3><div className="job-form-grid"><MoneyInput label="Precio estimado" name="estimatedPrice" value={form.estimatedPrice} onChange={handleChange} disabled={isClosed} /><MoneyInput label="Precio final" name="finalPrice" value={form.finalPrice} onChange={handleChange} disabled={isClosed} /></div>{mode === 'edit' && <div className="job-payment-summary"><div><small>Total</small><strong>{formatMoney(job?.finalPrice || job?.estimatedPrice || 0)}</strong></div><div><small>Pagado</small><strong>{formatMoney(job?.paidAmount || 0)}</strong></div><div><small>Saldo</small><strong>{formatMoney(job?.pendingAmount || 0)}</strong></div><div><small>Avance</small><strong>{formatPercent(job?.paymentPercent || 0, 0)}</strong></div><StatusBadge value={job?.paymentStatus || 'none'} labels={PAYMENT_STATUS_LABELS} /></div>}</section>
        <section className="job-panel job-span-2"><h3>Notas internas</h3><label className="crm-field"><textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} placeholder="Notas para el equipo interno" disabled={isClosed} /></label></section>
        {mode === 'edit' && <section className="job-panel job-span-2"><h3>Presupuestos relacionados</h3>{job?.quotes?.length ? <div className="job-related-list">{job.quotes.map((quote) => <article key={quote.id}><div><strong>{quote.quoteNumber} · {quote.title}</strong><small>{formatDate(quote.createdAt)} · {formatMoney(quote.total)}</small></div><StatusBadge value={quote.status} /></article>)}</div> : <EmptyState title="Sin presupuestos" description="Cuando este trabajo tenga presupuestos asociados, aparecerán acá." />}</section>}
        {mode === 'edit' && <section className="job-panel job-span-2"><h3>Resumen operativo</h3><div className="job-summary-chips"><StatusBadge value={job?.status} labels={JOB_STATUS_LABELS} /><PriorityBadge value={job?.priority} /><span>{job?.estimatedDeliveryDate ? `Entrega: ${formatDate(job.estimatedDeliveryDate)}` : 'Sin entrega estimada'}</span><span>{job?.client?.fullName || 'Sin cliente'}</span></div></section>}
      </form>
    </BaseDrawer>
    <ConfirmModal isOpen={deleteOpen} title="Eliminar trabajo" description={`¿Estás seguro de querer eliminar el trabajo ${job?.title || ''}?`} confirmLabel="Sí, eliminar" danger loading={saving} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete}>
      <div className="job-delete-refund-box">
        <label className="job-refund-checkbox"><input type="checkbox" name="refundMoney" checked={closePayload.refundMoney} onChange={handleClosePayloadChange} /><span>¿Registrar devolución de dinero?</span></label>
        {closePayload.refundMoney && <div className="job-form-grid"><MoneyInput label="Monto devuelto" name="refundAmount" value={closePayload.refundAmount} onChange={handleClosePayloadChange} /><label className="crm-field"><span>Método</span><select name="refundMethod" value={closePayload.refundMethod} onChange={handleClosePayloadChange}><option value="cash">Efectivo</option><option value="transfer">Transferencia</option><option value="card">Tarjeta</option><option value="other">Otro</option></select></label><label className="crm-field job-span-2"><span>Nota de devolución</span><textarea name="refundNote" value={closePayload.refundNote} onChange={handleClosePayloadChange} /></label></div>}
      </div>
    </ConfirmModal>
  </>;
}
