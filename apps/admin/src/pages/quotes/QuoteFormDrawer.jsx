import { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, FileText, Plus, Save, Trash2, Wrench, X } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import MoneyInput from '../../components/common/MoneyInput.jsx';
import PercentInput from '../../components/common/PercentInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { QUOTE_STATUS_LABELS } from '../../utils/statusLabels.js';
import { formatDate, formatMoney, toInputDate } from '../../utils/formatters.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const EMPTY_ITEM = { name: '', description: '', quantity: 1, unit: 'unidad', unitPrice: 0, note: '' };
const EMPTY_FORM = {
  clientId: '', jobId: '', title: '', description: '', status: 'draft', validUntil: '', includeDigitalSignature: false,
  recipientName: '', recipientCompany: '', recipientContactName: '', recipientPhone: '', recipientEmail: '', recipientTaxId: '', recipientAddress: '', recipientCity: '', recipientProvince: '', recipientAdminAddress: '',
  workObject: '', workLocation: '', includedTasks: '', excludedTasks: '', technicalNotes: '', paymentTerms: '', executionTime: '', warranty: '', commercialConditions: '',
  materialsCost: 0, laborCost: 0, paintCost: 0, extraCost: 0, discount: 0, profitMargin: 15, internalNotes: '', items: [{ ...EMPTY_ITEM }],
};

function toForm(quote) {
  if (!quote) return { ...EMPTY_FORM, items: [{ ...EMPTY_ITEM }] };
  return {
    ...EMPTY_FORM,
    clientId: quote.clientId || quote.client?.id || '', jobId: quote.jobId || quote.job?.id || '', title: quote.title || '', description: quote.description || '', status: quote.status || 'draft', validUntil: toInputDate(quote.validUntil), includeDigitalSignature: Boolean(quote.includeDigitalSignature),
    recipientName: quote.recipientName || '', recipientCompany: quote.recipientCompany || '', recipientContactName: quote.recipientContactName || '', recipientPhone: quote.recipientPhone || '', recipientEmail: quote.recipientEmail || '', recipientTaxId: quote.recipientTaxId || '', recipientAddress: quote.recipientAddress || '', recipientCity: quote.recipientCity || '', recipientProvince: quote.recipientProvince || '', recipientAdminAddress: quote.recipientAdminAddress || '',
    workObject: quote.workObject || '', workLocation: quote.workLocation || '', includedTasks: quote.includedTasks || '', excludedTasks: quote.excludedTasks || '', technicalNotes: quote.technicalNotes || '', paymentTerms: quote.paymentTerms || '', executionTime: quote.executionTime || '', warranty: quote.warranty || '', commercialConditions: quote.commercialConditions || '',
    materialsCost: quote.materialsCost ?? 0, laborCost: quote.laborCost ?? 0, paintCost: quote.paintCost ?? 0, extraCost: quote.extraCost ?? 0, discount: quote.discount ?? 0, profitMargin: quote.profitMargin ?? 15, internalNotes: quote.internalNotes || '',
    items: quote.items?.length ? quote.items.map((item) => ({ name: item.name || '', description: item.description || '', quantity: item.quantity ?? 1, unit: item.unit || 'unidad', unitPrice: item.unitPrice ?? 0, note: item.note || '' })) : [{ ...EMPTY_ITEM }],
  };
}

function totals(form) {
  const itemsTotal = (form.items || []).reduce((acc, item) => acc + Number(item.quantity || 1) * Number(item.unitPrice || 0), 0);
  const subtotal = itemsTotal + Number(form.materialsCost || 0) + Number(form.laborCost || 0) + Number(form.paintCost || 0) + Number(form.extraCost || 0);
  const marginAmount = subtotal * (Number(form.profitMargin || 0) / 100);
  const total = Math.max(subtotal + marginAmount - Number(form.discount || 0), 0);
  return { itemsTotal, subtotal, marginAmount, total };
}

function hasRecipient(form) { return Boolean(form.clientId || form.recipientName || form.recipientCompany || form.recipientContactName); }
function buildPdfUrl(pdfUrl) { if (!pdfUrl) return ''; return pdfUrl.startsWith('http') ? pdfUrl : `${API_BASE}${pdfUrl}`; }

export default function QuoteFormDrawer({ isOpen, mode = 'create', quote, clients = [], jobs = [], saving = false, onClose, onSave, onDelete, onMarkSent, onGeneratePdf, onConvertToJob }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { if (isOpen) setForm(toForm(quote)); }, [quote, isOpen]);

  const currentTotals = useMemo(() => totals(form), [form]);
  const pdfUrl = buildPdfUrl(quote?.pdfUrl);
  const filteredJobs = useMemo(() => form.clientId ? jobs.filter((job) => job.clientId === form.clientId || job.client?.id === form.clientId) : jobs, [jobs, form.clientId]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((state) => ({ ...state, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleClientChange(event) {
    const clientId = event.target.value;
    const client = clients.find((item) => item.id === clientId);
    setForm((state) => ({
      ...state, clientId, jobId: '',
      recipientName: client ? client.fullName || '' : state.recipientName,
      recipientPhone: client ? client.phone || '' : state.recipientPhone,
      recipientEmail: client ? client.email || '' : state.recipientEmail,
      recipientAddress: client ? client.address || '' : state.recipientAddress,
      recipientCity: client ? client.city || '' : state.recipientCity,
      recipientTaxId: client ? client.taxId || '' : state.recipientTaxId,
    }));
  }

  function handleItemChange(index, field, value) {
    setForm((state) => ({ ...state, items: state.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  }

  function addItem() { setForm((state) => ({ ...state, items: [...state.items, { ...EMPTY_ITEM }] })); }
  function removeItem(index) { setForm((state) => ({ ...state, items: state.items.filter((_, itemIndex) => itemIndex !== index) })); }
  async function handleSubmit(event) { event.preventDefault(); await onSave?.(form); }
  function openPdf() { if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer'); }

  const footer = (
    <>
      {mode === 'edit' && <button className="crm-button" type="button" onClick={() => onGeneratePdf?.(quote)}><FileText size={16} /> Generar PDF</button>}
      {mode === 'edit' && <button className="crm-button" type="button" onClick={() => onConvertToJob?.(quote)}><Wrench size={16} /> Convertir en trabajo</button>}
      {mode === 'edit' && pdfUrl && <button className="crm-button" type="button" onClick={openPdf}><ExternalLink size={16} /> Ver PDF</button>}
      {mode === 'edit' && pdfUrl && <a className="crm-button" href={pdfUrl} download><Download size={16} /> Descargar</a>}
      {mode === 'edit' && <button className="crm-button" type="button" onClick={() => onMarkSent?.(quote)}>Marcar enviado</button>}
      {mode === 'edit' && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="quote-form" disabled={saving || !hasRecipient(form) || !form.title}><Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}</button>
    </>
  );

  return (
    <>
      <BaseDrawer isOpen={isOpen} title={mode === 'create' ? 'Nuevo presupuesto' : `${quote?.quoteNumber || ''} · ${quote?.title || 'Presupuesto'}`} description="Presupuesto completo con cliente existente o destinatario manual, condiciones, firma opcional y PDF profesional." onClose={onClose} size="xl" footer={footer}>
        {mode === 'edit' && <div className="quote-pdf-banner"><strong>{pdfUrl ? 'PDF disponible' : 'PDF pendiente de generación'}</strong><span>{pdfUrl ? 'Podés verlo o descargarlo.' : 'Generá el PDF cuando el presupuesto esté listo.'}</span></div>}
        <form id="quote-form" className="quote-detail-grid" onSubmit={handleSubmit}>
          <section className="quote-panel"><h3>Destinatario</h3><div className="quote-form-grid">
            <label className="crm-field"><span>Cliente existente</span><select name="clientId" value={form.clientId} onChange={handleClientChange}><option value="">Cliente no registrado / carga manual</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.fullName}</option>)}</select></label>
            <label className="crm-field"><span>Empresa / Razón social</span><input name="recipientCompany" value={form.recipientCompany} onChange={handleChange} /></label>
            <label className="crm-field"><span>Nombre / Destinatario</span><input name="recipientName" value={form.recipientName} onChange={handleChange} /></label>
            <label className="crm-field"><span>Contacto / Responsable</span><input name="recipientContactName" value={form.recipientContactName} onChange={handleChange} /></label>
            <label className="crm-field"><span>Teléfono</span><input name="recipientPhone" value={form.recipientPhone} onChange={handleChange} /></label>
            <label className="crm-field"><span>Email</span><input name="recipientEmail" type="email" value={form.recipientEmail} onChange={handleChange} /></label>
            <label className="crm-field"><span>CUIT / DNI</span><input name="recipientTaxId" value={form.recipientTaxId} onChange={handleChange} /></label>
            <label className="crm-field"><span>Ciudad / Provincia</span><input name="recipientCity" value={form.recipientCity} onChange={handleChange} /></label>
            <label className="crm-field quote-span-2"><span>Dirección / Administración central</span><input name="recipientAdminAddress" value={form.recipientAdminAddress} onChange={handleChange} /></label>
          </div></section>

          <section className="quote-panel"><h3>Datos generales</h3><div className="quote-form-grid">
            <label className="crm-field"><span>Trabajo relacionado</span><select name="jobId" value={form.jobId} onChange={handleChange}><option value="">Sin trabajo relacionado</option>{filteredJobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
            <label className="crm-field"><span>Título</span><input name="title" value={form.title} onChange={handleChange} required /></label>
            <label className="crm-field"><span>Validez hasta</span><input name="validUntil" type="date" value={form.validUntil} onChange={handleChange} /></label>
            <label className="crm-field"><span>Estado</span><select name="status" value={form.status} onChange={handleChange}>{Object.entries(QUOTE_STATUS_LABELS).filter(([value]) => ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'].includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="quote-signature-toggle quote-span-2"><input type="checkbox" name="includeDigitalSignature" checked={form.includeDigitalSignature} onChange={handleChange} /><span>Incluir firma digital en el PDF</span></label>
            <label className="crm-field quote-span-2"><span>Objeto del presupuesto</span><textarea name="workObject" value={form.workObject} onChange={handleChange} /></label>
            <label className="crm-field quote-span-2"><span>Ubicación de obra</span><input name="workLocation" value={form.workLocation} onChange={handleChange} /></label>
            <label className="crm-field quote-span-2"><span>Descripción general</span><textarea name="description" value={form.description} onChange={handleChange} /></label>
          </div></section>

          <section className="quote-panel quote-span-2"><h3>Alcance y condiciones técnicas</h3><div className="quote-form-grid">
            <label className="crm-field quote-span-2"><span>Tareas incluidas</span><textarea name="includedTasks" value={form.includedTasks} onChange={handleChange} /></label>
            <label className="crm-field quote-span-2"><span>Exclusiones / No incluye</span><textarea name="excludedTasks" value={form.excludedTasks} onChange={handleChange} /></label>
            <label className="crm-field quote-span-2"><span>Notas técnicas</span><textarea name="technicalNotes" value={form.technicalNotes} onChange={handleChange} /></label>
          </div></section>

          <section className="quote-panel quote-span-2"><h3>Ítems del presupuesto</h3><div className="quote-items-list">
            {form.items.map((item, index) => <article className="quote-item-row quote-item-row-pro" key={index}>
              <label className="crm-field"><span>Concepto</span><input value={item.name} onChange={(event) => handleItemChange(index, 'name', event.target.value)} /></label>
              <label className="crm-field"><span>Detalle</span><input value={item.description} onChange={(event) => handleItemChange(index, 'description', event.target.value)} /></label>
              <label className="crm-field"><span>Cant.</span><input type="number" min="0" step="0.01" value={item.quantity} onChange={(event) => handleItemChange(index, 'quantity', event.target.value)} /></label>
              <label className="crm-field"><span>Unidad</span><input value={item.unit} onChange={(event) => handleItemChange(index, 'unit', event.target.value)} /></label>
              <MoneyInput label="Precio unit." value={item.unitPrice} onChange={(event) => handleItemChange(index, 'unitPrice', event.target.value)} />
              <label className="crm-field"><span>Nota</span><input value={item.note} onChange={(event) => handleItemChange(index, 'note', event.target.value)} /></label>
              <button className="crm-icon-button quote-remove-item" type="button" onClick={() => removeItem(index)} disabled={form.items.length <= 1} aria-label="Quitar ítem"><X size={16} /></button>
            </article>)}
          </div><button className="crm-button" type="button" onClick={addItem}><Plus size={16} /> Agregar ítem</button></section>

          <section className="quote-panel"><h3>Costos adicionales</h3><div className="quote-form-grid">
            <MoneyInput label="Materiales" name="materialsCost" value={form.materialsCost} onChange={handleChange} /><MoneyInput label="Mano de obra" name="laborCost" value={form.laborCost} onChange={handleChange} /><MoneyInput label="Pintura" name="paintCost" value={form.paintCost} onChange={handleChange} /><MoneyInput label="Extra / traslado / viáticos" name="extraCost" value={form.extraCost} onChange={handleChange} /><MoneyInput label="Descuento" name="discount" value={form.discount} onChange={handleChange} /><PercentInput label="Margen" name="profitMargin" value={form.profitMargin} onChange={handleChange} />
          </div></section>

          <section className="quote-panel quote-totals-panel"><h3>Totales</h3><div className="quote-totals-list"><span>Ítems</span><b>{formatMoney(currentTotals.itemsTotal)}</b><span>Subtotal</span><b>{formatMoney(currentTotals.subtotal)}</b><span>Margen</span><b>{formatMoney(currentTotals.marginAmount)}</b><span>Descuento</span><b>{formatMoney(form.discount)}</b><span>Total final</span><strong>{formatMoney(currentTotals.total)}</strong></div>{mode === 'edit' && <div className="quote-current-state"><StatusBadge value={quote?.status} labels={QUOTE_STATUS_LABELS} /><small>{quote?.validUntil ? `Válido hasta ${formatDate(quote.validUntil)}` : 'Sin fecha de validez'}</small></div>}</section>

          <section className="quote-panel quote-span-2"><h3>Condiciones comerciales</h3><div className="quote-form-grid"><label className="crm-field"><span>Forma de pago</span><textarea name="paymentTerms" value={form.paymentTerms} onChange={handleChange} /></label><label className="crm-field"><span>Plazo estimado</span><textarea name="executionTime" value={form.executionTime} onChange={handleChange} /></label><label className="crm-field"><span>Garantía</span><textarea name="warranty" value={form.warranty} onChange={handleChange} /></label><label className="crm-field"><span>Condiciones adicionales</span><textarea name="commercialConditions" value={form.commercialConditions} onChange={handleChange} /></label></div></section>
          <section className="quote-panel quote-span-2"><h3>Notas internas</h3><label className="crm-field"><textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} /></label></section>
        </form>
      </BaseDrawer>
      <ConfirmModal isOpen={deleteOpen} title="Eliminar presupuesto" description={`¿Estás seguro de querer eliminar/cancelar el presupuesto ${quote?.quoteNumber || ''}?`} confirmLabel="Sí, eliminar" danger loading={saving} onClose={() => setDeleteOpen(false)} onConfirm={() => onDelete?.(quote)} />
    </>
  );
}
