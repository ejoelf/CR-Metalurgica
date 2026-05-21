import { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, FileText, Mail, MessageCircle, Plus, RotateCcw, Save, Trash2, Wrench, X } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import ActionModal from '../../components/common/ActionModal.jsx';
import MoneyInput from '../../components/common/MoneyInput.jsx';
import PercentInput from '../../components/common/PercentInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { QUOTE_STATUS_LABELS } from '../../utils/statusLabels.js';
import { formatDate, formatDateTime, formatMoney, toInputDate } from '../../utils/formatters.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const LOCAL_DRAFT_KEY = 'cf-metal-quote-local-draft-v2';
const EMPTY_ITEM = { name: '', description: '', quantity: 1, unit: 'unidad', unitPrice: 0, note: '' };
const EMPTY_FORM = {
  clientId: '',
  jobId: '',
  title: '',
  description: '',
  status: 'draft',
  validUntil: '',
  recipientName: '',
  recipientCompany: '',
  recipientContactName: '',
  recipientPhone: '',
  recipientEmail: '',
  recipientTaxId: '',
  recipientAddress: '',
  recipientCity: '',
  recipientProvince: '',
  recipientAdminAddress: '',
  workObject: '',
  workLocation: '',
  includedTasks: '',
  excludedTasks: '',
  technicalNotes: '',
  paymentTerms: '',
  executionTime: '',
  warranty: '',
  commercialConditions: '',
  materialsCost: 0,
  laborCost: 0,
  paintCost: 0,
  extraCost: 0,
  discount: 0,
  profitMargin: 15,
  internalNotes: '',
  items: [{ ...EMPTY_ITEM }],
};

function toForm(quote) {
  if (!quote) return EMPTY_FORM;
  return {
    clientId: quote.clientId || quote.client?.id || '',
    jobId: quote.jobId || quote.job?.id || '',
    title: quote.title || '',
    description: quote.description || '',
    status: quote.status || 'draft',
    validUntil: toInputDate(quote.validUntil),
    recipientName: quote.recipientName || '',
    recipientCompany: quote.recipientCompany || '',
    recipientContactName: quote.recipientContactName || '',
    recipientPhone: quote.recipientPhone || '',
    recipientEmail: quote.recipientEmail || '',
    recipientTaxId: quote.recipientTaxId || '',
    recipientAddress: quote.recipientAddress || '',
    recipientCity: quote.recipientCity || '',
    recipientProvince: quote.recipientProvince || '',
    recipientAdminAddress: quote.recipientAdminAddress || '',
    workObject: quote.workObject || '',
    workLocation: quote.workLocation || '',
    includedTasks: quote.includedTasks || '',
    excludedTasks: quote.excludedTasks || '',
    technicalNotes: quote.technicalNotes || '',
    paymentTerms: quote.paymentTerms || '',
    executionTime: quote.executionTime || '',
    warranty: quote.warranty || '',
    commercialConditions: quote.commercialConditions || '',
    materialsCost: quote.materialsCost ?? 0,
    laborCost: quote.laborCost ?? 0,
    paintCost: quote.paintCost ?? 0,
    extraCost: quote.extraCost ?? 0,
    discount: quote.discount ?? 0,
    profitMargin: quote.profitMargin ?? 15,
    internalNotes: quote.internalNotes || '',
    items: quote.items?.length ? quote.items.map((item) => ({ name: item.name || '', description: item.description || '', quantity: item.quantity ?? 1, unit: item.unit || 'unidad', unitPrice: item.unitPrice ?? 0, note: item.note || '' })) : [{ ...EMPTY_ITEM }],
  };
}

function calculateTotals(form) {
  const itemsTotal = (form.items || []).reduce((acc, item) => acc + Number(item.quantity || 1) * Number(item.unitPrice || 0), 0);
  const subtotal = itemsTotal + Number(form.materialsCost || 0) + Number(form.laborCost || 0) + Number(form.paintCost || 0) + Number(form.extraCost || 0);
  const marginAmount = subtotal * (Number(form.profitMargin || 0) / 100);
  const total = Math.max(subtotal + marginAmount - Number(form.discount || 0), 0);
  return { itemsTotal, subtotal, marginAmount, total };
}

function hasUsefulDraftData(form) {
  return Boolean(
    form.title || form.description || form.clientId || form.jobId || form.recipientName || form.recipientCompany || form.workObject || form.workLocation || form.includedTasks || form.commercialConditions || form.internalNotes ||
    Number(form.materialsCost || 0) > 0 || Number(form.laborCost || 0) > 0 || Number(form.paintCost || 0) > 0 || Number(form.extraCost || 0) > 0 ||
    (form.items || []).some((item) => item.name || item.description || Number(item.unitPrice || 0) > 0)
  );
}

function hasRecipient(form) {
  return Boolean(form.clientId || form.recipientName || form.recipientCompany || form.recipientContactName);
}

function readLocalDraft() {
  try {
    const raw = window.localStorage.getItem(LOCAL_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalDraft(form) {
  window.localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify({ form, savedAt: new Date().toISOString() }));
}

function clearLocalDraft() {
  window.localStorage.removeItem(LOCAL_DRAFT_KEY);
}

function buildPublicPdfUrl(pdfUrl) {
  if (!pdfUrl) return '';
  if (pdfUrl.startsWith('http')) return pdfUrl;
  return `${API_BASE}${pdfUrl}`;
}

export default function QuoteFormDrawer({ isOpen, mode = 'create', quote, clients = [], jobs = [], saving = false, onClose, onSave, onDelete, onMarkSent, onGeneratePdf, onConvertToJob }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sendAction, setSendAction] = useState(null);
  const [draftPrompt, setDraftPrompt] = useState(null);
  const [localSavedAt, setLocalSavedAt] = useState(null);
  const [localDraftStatus, setLocalDraftStatus] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'create') {
      const draft = readLocalDraft();
      if (draft?.form && hasUsefulDraftData(draft.form)) {
        setDraftPrompt(draft);
      } else {
        setForm(EMPTY_FORM);
      }
      return;
    }

    setForm(toForm(quote));
  }, [quote, isOpen, mode]);

  useEffect(() => {
    if (!isOpen || mode !== 'create') return undefined;
    if (!hasUsefulDraftData(form)) return undefined;

    setLocalDraftStatus('Guardando borrador local...');
    const timer = window.setTimeout(() => {
      writeLocalDraft(form);
      const savedAt = new Date().toISOString();
      setLocalSavedAt(savedAt);
      setLocalDraftStatus('Borrador local guardado');
    }, 650);

    return () => window.clearTimeout(timer);
  }, [form, isOpen, mode]);

  const original = useMemo(() => JSON.stringify(toForm(quote)), [quote]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;
  const totals = useMemo(() => calculateTotals(form), [form]);
  const pdfUrl = buildPublicPdfUrl(quote?.pdfUrl);

  const filteredJobs = useMemo(() => {
    if (!form.clientId) return jobs;
    return jobs.filter((job) => job.clientId === form.clientId || job.client?.id === form.clientId);
  }, [jobs, form.clientId]);

  function recoverDraft() {
    if (draftPrompt?.form) {
      setForm({ ...EMPTY_FORM, ...draftPrompt.form });
      setLocalSavedAt(draftPrompt.savedAt || null);
    }
    setDraftPrompt(null);
  }

  function discardDraft() {
    clearLocalDraft();
    setDraftPrompt(null);
    setLocalSavedAt(null);
    setLocalDraftStatus('');
    setForm(EMPTY_FORM);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((state) => ({ ...state, [name]: value }));
  }

  function handleClientChange(event) {
    const clientId = event.target.value;
    const client = clients.find((item) => item.id === clientId);
    setForm((state) => ({
      ...state,
      clientId,
      jobId: '',
      recipientName: client ? client.fullName || '' : state.recipientName,
      recipientPhone: client ? client.phone || '' : state.recipientPhone,
      recipientEmail: client ? client.email || '' : state.recipientEmail,
      recipientAddress: client ? client.address || '' : state.recipientAddress,
      recipientCity: client ? client.city || '' : state.recipientCity,
      recipientTaxId: client ? client.taxId || '' : state.recipientTaxId,
    }));
  }

  function handleItemChange(index, field, value) {
    setForm((state) => ({
      ...state,
      items: state.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  }

  function addItem() {
    setForm((state) => ({ ...state, items: [...state.items, { ...EMPTY_ITEM }] }));
  }

  function removeItem(index) {
    setForm((state) => ({ ...state, items: state.items.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSave?.(form);
    if (mode === 'create') {
      clearLocalDraft();
      setLocalSavedAt(null);
      setLocalDraftStatus('');
    }
  }

  function openPdf() {
    if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }

  function openSendActions() {
    const client = clients.find((item) => item.id === form.clientId) || quote?.client;
    const recipientName = form.recipientName || form.recipientCompany || client?.fullName || '';
    const email = form.recipientEmail || client?.email;
    const phone = String(form.recipientPhone || client?.phone || '').replace(/[^0-9]/g, '');
    const subject = encodeURIComponent(`Presupuesto ${quote?.quoteNumber || ''} - CF Metal-Pintura`);
    const body = encodeURIComponent(`Hola ${recipientName}, te enviamos el presupuesto solicitado.\n\n${pdfUrl ? `PDF: ${pdfUrl}\n\n` : ''}Saludos, CF Metal-Pintura.`);
    const whatsappText = encodeURIComponent(`Hola ${recipientName}, te enviamos el presupuesto solicitado de CF Metal-Pintura.${pdfUrl ? `\nPDF: ${pdfUrl}` : ''}`);

    setSendAction({
      title: 'Enviar presupuesto',
      description: 'Elegí el medio para enviar este presupuesto. Luego se marcará como enviado.',
      actions: [
        { label: 'Enviar por Gmail', description: email ? email : 'No hay email cargado', icon: Mail, disabled: !email, onClick: () => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer'); onMarkSent?.(quote); setSendAction(null); } },
        { label: 'Enviar por WhatsApp', description: phone ? form.recipientPhone || client?.phone : 'No hay teléfono cargado', icon: MessageCircle, disabled: !phone, onClick: () => { window.open(`https://wa.me/${phone}?text=${whatsappText}`, '_blank', 'noopener,noreferrer'); onMarkSent?.(quote); setSendAction(null); } },
      ],
    });
  }

  const footer = (
    <>
      {mode === 'create' && hasUsefulDraftData(form) && <button className="crm-button" type="button" onClick={discardDraft}><RotateCcw size={16} /> Descartar borrador</button>}
      {mode === 'edit' && <button className="crm-button" type="button" onClick={() => onGeneratePdf?.(quote)}><FileText size={16} /> Generar PDF</button>}
      {mode === 'edit' && <button className="crm-button" type="button" onClick={() => onConvertToJob?.(quote)}><Wrench size={16} /> Convertir en trabajo</button>}
      {mode === 'edit' && pdfUrl && <button className="crm-button" type="button" onClick={openPdf}><ExternalLink size={16} /> Ver PDF</button>}
      {mode === 'edit' && pdfUrl && <a className="crm-button" href={pdfUrl} download><Download size={16} /> Descargar</a>}
      {mode === 'edit' && <button className="crm-button" type="button" onClick={openSendActions}>Enviar</button>}
      {mode === 'edit' && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="quote-form" disabled={saving || !hasChanges || !hasRecipient(form) || !form.title}>
        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar borrador'}
      </button>
    </>
  );

  return (
    <>
      <BaseDrawer
        isOpen={isOpen}
        title={mode === 'create' ? 'Nuevo presupuesto' : `${quote?.quoteNumber || ''} · ${quote?.title || 'Presupuesto'}`}
        description="Creá presupuestos completos con cliente existente o destinatario manual, alcance de obra, condiciones e ítems detallados."
        onClose={onClose}
        size="xl"
        footer={footer}
      >
        {mode === 'create' && (
          <div className="quote-autosave-banner">
            <strong>{localDraftStatus || 'Autoguardado local activo'}</strong>
            <span>{localSavedAt ? `Último guardado: ${formatDateTime(localSavedAt)}` : 'El borrador se guarda en este navegador mientras lo completás.'}</span>
          </div>
        )}

        {mode === 'edit' && (
          <div className="quote-pdf-banner">
            <strong>{pdfUrl ? 'PDF disponible' : 'PDF pendiente de generación'}</strong>
            <span>{pdfUrl ? 'Podés verlo, descargarlo o enviarlo al cliente.' : 'Generá el PDF cuando el presupuesto esté listo.'}</span>
          </div>
        )}

        <form id="quote-form" className="quote-detail-grid" onSubmit={handleSubmit}>
          <section className="quote-panel">
            <h3>Destinatario</h3>
            <div className="quote-form-grid">
              <label className="crm-field"><span>Cliente existente</span><select name="clientId" value={form.clientId} onChange={handleClientChange}><option value="">Cliente no registrado / carga manual</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.fullName}</option>)}</select></label>
              <label className="crm-field"><span>Empresa / Razón social</span><input name="recipientCompany" value={form.recipientCompany} onChange={handleChange} placeholder="Globoaves Argentina" /></label>
              <label className="crm-field"><span>Nombre / Destinatario</span><input name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="Nombre del cliente o destinatario" /></label>
              <label className="crm-field"><span>Contacto / Responsable</span><input name="recipientContactName" value={form.recipientContactName} onChange={handleChange} placeholder="Persona de contacto" /></label>
              <label className="crm-field"><span>Teléfono</span><input name="recipientPhone" value={form.recipientPhone} onChange={handleChange} placeholder="Teléfono / WhatsApp" /></label>
              <label className="crm-field"><span>Email</span><input name="recipientEmail" type="email" value={form.recipientEmail} onChange={handleChange} placeholder="email@empresa.com" /></label>
              <label className="crm-field"><span>CUIT / DNI</span><input name="recipientTaxId" value={form.recipientTaxId} onChange={handleChange} placeholder="Opcional" /></label>
              <label className="crm-field"><span>Ciudad / Provincia</span><input name="recipientCity" value={form.recipientCity} onChange={handleChange} placeholder="Río Cuarto, Córdoba" /></label>
              <label className="crm-field quote-span-2"><span>Dirección / Administración central</span><input name="recipientAdminAddress" value={form.recipientAdminAddress} onChange={handleChange} placeholder="Sobremonte 70 - Piso 6, Paseo de la Ribera..." /></label>
            </div>
          </section>

          <section className="quote-panel">
            <h3>Datos generales</h3>
            <div className="quote-form-grid">
              <label className="crm-field"><span>Trabajo relacionado</span><select name="jobId" value={form.jobId} onChange={handleChange}><option value="">Sin trabajo relacionado</option>{filteredJobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
              <label className="crm-field"><span>Título</span><input name="title" value={form.title} onChange={handleChange} required placeholder="Presupuesto para portón, estructura..." /></label>
              <label className="crm-field"><span>Validez hasta</span><input name="validUntil" type="date" value={form.validUntil} onChange={handleChange} /></label>
              <label className="crm-field"><span>Estado</span><select name="status" value={form.status} onChange={handleChange}>{Object.entries(QUOTE_STATUS_LABELS).filter(([value]) => ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'].includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="crm-field quote-span-2"><span>Objeto del presupuesto</span><textarea name="workObject" value={form.workObject} onChange={handleChange} placeholder="Fabricación, armado, pintura, desmontaje y colocación..." /></label>
              <label className="crm-field quote-span-2"><span>Ubicación de obra</span><input name="workLocation" value={form.workLocation} onChange={handleChange} placeholder="A coordinar / dirección de obra" /></label>
              <label className="crm-field quote-span-2"><span>Descripción general</span><textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción general del trabajo presupuestado" /></label>
            </div>
          </section>

          <section className="quote-panel quote-span-2">
            <h3>Alcance y condiciones técnicas</h3>
            <div className="quote-form-grid">
              <label className="crm-field quote-span-2"><span>Tareas incluidas</span><textarea name="includedTasks" value={form.includedTasks} onChange={handleChange} placeholder="Una tarea por línea: fabricación, soldado, pintura, desmontaje..." /></label>
              <label className="crm-field quote-span-2"><span>Exclusiones / No incluye</span><textarea name="excludedTasks" value={form.excludedTasks} onChange={handleChange} placeholder="Ej: No incluye motor reductor, trabajos adicionales..." /></label>
              <label className="crm-field quote-span-2"><span>Notas técnicas</span><textarea name="technicalNotes" value={form.technicalNotes} onChange={handleChange} placeholder="Materiales, medidas, aclaraciones técnicas, CAPER, etc." /></label>
            </div>
          </section>

          <section className="quote-panel quote-span-2">
            <h3>Ítems del presupuesto</h3>
            <div className="quote-items-list">
              {form.items.map((item, index) => (
                <article className="quote-item-row quote-item-row-pro" key={index}>
                  <label className="crm-field"><span>Concepto</span><input value={item.name} onChange={(event) => handleItemChange(index, 'name', event.target.value)} placeholder="Fabricación y montaje" /></label>
                  <label className="crm-field"><span>Detalle</span><input value={item.description} onChange={(event) => handleItemChange(index, 'description', event.target.value)} placeholder="Detalle opcional" /></label>
                  <label className="crm-field"><span>Cant.</span><input type="number" min="0" step="0.01" value={item.quantity} onChange={(event) => handleItemChange(index, 'quantity', event.target.value)} /></label>
                  <label className="crm-field"><span>Unidad</span><input value={item.unit} onChange={(event) => handleItemChange(index, 'unit', event.target.value)} placeholder="unidad / global / m2" /></label>
                  <MoneyInput label="Precio unit." value={item.unitPrice} onChange={(event) => handleItemChange(index, 'unitPrice', event.target.value)} />
                  <label className="crm-field"><span>Nota</span><input value={item.note} onChange={(event) => handleItemChange(index, 'note', event.target.value)} placeholder="Opcional" /></label>
                  <button className="crm-icon-button quote-remove-item" type="button" onClick={() => removeItem(index)} disabled={form.items.length <= 1} aria-label="Quitar ítem"><X size={16} /></button>
                </article>
              ))}
            </div>
            <button className="crm-button" type="button" onClick={addItem}><Plus size={16} /> Agregar ítem</button>
          </section>

          <section className="quote-panel">
            <h3>Costos adicionales</h3>
            <div className="quote-form-grid">
              <MoneyInput label="Materiales" name="materialsCost" value={form.materialsCost} onChange={handleChange} />
              <MoneyInput label="Mano de obra" name="laborCost" value={form.laborCost} onChange={handleChange} />
              <MoneyInput label="Pintura" name="paintCost" value={form.paintCost} onChange={handleChange} />
              <MoneyInput label="Extra / traslado / viáticos" name="extraCost" value={form.extraCost} onChange={handleChange} />
              <MoneyInput label="Descuento" name="discount" value={form.discount} onChange={handleChange} />
              <PercentInput label="Margen" name="profitMargin" value={form.profitMargin} onChange={handleChange} />
            </div>
          </section>

          <section className="quote-panel quote-totals-panel">
            <h3>Totales</h3>
            <div className="quote-totals-list">
              <span>Ítems</span><b>{formatMoney(totals.itemsTotal)}</b>
              <span>Subtotal</span><b>{formatMoney(totals.subtotal)}</b>
              <span>Margen</span><b>{formatMoney(totals.marginAmount)}</b>
              <span>Descuento</span><b>{formatMoney(form.discount)}</b>
              <span>Total final</span><strong>{formatMoney(totals.total)}</strong>
            </div>
            {mode === 'edit' && (
              <div className="quote-current-state">
                <StatusBadge value={quote?.status} labels={QUOTE_STATUS_LABELS} />
                <small>{quote?.validUntil ? `Válido hasta ${formatDate(quote.validUntil)}` : 'Sin fecha de validez'}</small>
              </div>
            )}
          </section>

          <section className="quote-panel quote-span-2">
            <h3>Condiciones comerciales</h3>
            <div className="quote-form-grid">
              <label className="crm-field"><span>Forma de pago</span><textarea name="paymentTerms" value={form.paymentTerms} onChange={handleChange} placeholder="Anticipo, saldo, transferencia, efectivo..." /></label>
              <label className="crm-field"><span>Plazo estimado</span><textarea name="executionTime" value={form.executionTime} onChange={handleChange} placeholder="A coordinar / 15 días hábiles..." /></label>
              <label className="crm-field"><span>Garantía</span><textarea name="warranty" value={form.warranty} onChange={handleChange} placeholder="Opcional" /></label>
              <label className="crm-field"><span>Condiciones adicionales</span><textarea name="commercialConditions" value={form.commercialConditions} onChange={handleChange} placeholder="Una condición por línea" /></label>
            </div>
          </section>

          <section className="quote-panel quote-span-2">
            <h3>Notas internas</h3>
            <label className="crm-field"><textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} placeholder="Notas internas que no necesariamente salen en el PDF" /></label>
          </section>
        </form>
      </BaseDrawer>

      <ConfirmModal
        isOpen={Boolean(draftPrompt)}
        title="Borrador encontrado"
        description={`Encontramos un presupuesto no guardado completamente${draftPrompt?.savedAt ? ` del ${formatDateTime(draftPrompt.savedAt)}` : ''}. ¿Querés recuperarlo?`}
        confirmLabel="Sí, recuperar"
        cancelLabel="No, descartar"
        onConfirm={recoverDraft}
        onClose={discardDraft}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        title="Eliminar presupuesto"
        description={`¿Estás seguro de querer eliminar/cancelar el presupuesto ${quote?.quoteNumber || ''}?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={saving}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete?.(quote)}
      />

      <ActionModal
        isOpen={Boolean(sendAction)}
        title={sendAction?.title}
        description={sendAction?.description}
        actions={sendAction?.actions || []}
        onClose={() => setSendAction(null)}
      />
    </>
  );
}
