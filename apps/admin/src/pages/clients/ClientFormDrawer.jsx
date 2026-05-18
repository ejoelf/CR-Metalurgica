import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Save, Trash2 } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import ActionModal from '../../components/common/ActionModal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { JOB_STATUS_LABELS, QUOTE_STATUS_LABELS } from '../../utils/statusLabels.js';
import { formatDate, formatMoney } from '../../utils/formatters.js';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: '',
  source: 'crm',
  status: 'active',
};

function splitName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
}

function toForm(client) {
  if (!client) return EMPTY_FORM;
  const name = splitName(client.fullName);
  return {
    firstName: client.firstName || name.firstName,
    lastName: client.lastName || name.lastName,
    phone: client.phone || '',
    email: client.email || '',
    address: client.address || '',
    city: client.city || '',
    notes: client.notes || '',
    source: client.source || 'crm',
    status: client.status || 'active',
  };
}

function normalizePhone(phone = '') {
  return String(phone).replace(/[^0-9]/g, '');
}

export default function ClientFormDrawer({ isOpen, mode = 'create', client, onClose, onSave, onDelete, saving = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [contactAction, setContactAction] = useState(null);

  useEffect(() => {
    setForm(toForm(client));
  }, [client, isOpen]);

  const original = useMemo(() => JSON.stringify(toForm(client)), [client]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((state) => ({ ...state, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave?.(form);
  }

  function openPhoneActions() {
    if (!form.phone) return;
    const phone = normalizePhone(form.phone);
    setContactAction({
      title: 'Acciones de teléfono',
      description: `¿Qué querés hacer con ${form.phone}?`,
      actions: [
        { label: `Llamar a ${form.phone}`, description: 'Abrir llamada del dispositivo', icon: Phone, onClick: () => { window.open(`tel:${phone}`, '_self'); setContactAction(null); } },
        { label: 'Enviar WhatsApp', description: 'Abrir WhatsApp Web o la app', icon: Phone, onClick: () => { window.open(`https://wa.me/${phone}`, '_blank', 'noopener,noreferrer'); setContactAction(null); } },
      ],
    });
  }

  function openEmailAction() {
    if (!form.email) return;
    setContactAction({
      title: 'Enviar email',
      description: `¿Querés redactar un email para ${form.email}?`,
      actions: [
        { label: `Enviar a ${form.email}`, description: 'Abrir redacción de email', icon: Mail, onClick: () => { window.open(`mailto:${form.email}`, '_self'); setContactAction(null); } },
      ],
    });
  }

  const footer = (
    <>
      {mode === 'edit' && (
        <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={16} /> Eliminar
        </button>
      )}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="client-form" disabled={saving || !hasChanges}>
        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </>
  );

  return (
    <>
      <BaseDrawer
        isOpen={isOpen}
        title={mode === 'create' ? 'Nuevo cliente' : client?.fullName || 'Detalle del cliente'}
        description="Gestioná datos, contacto, trabajos, presupuestos y actividad del cliente."
        onClose={onClose}
        size="xl"
        footer={footer}
      >
        <form id="client-form" className="client-detail-grid" onSubmit={handleSubmit}>
          <section className="client-panel">
            <h3>Datos del cliente</h3>
            <div className="client-form-grid">
              <label className="crm-field"><span>Nombre</span><input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Nombre" /></label>
              <label className="crm-field"><span>Apellido</span><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Apellido" /></label>
              <label className="crm-field"><span>Teléfono</span><input name="phone" value={form.phone} onChange={handleChange} required placeholder="3580000000" /></label>
              <label className="crm-field"><span>Email</span><input name="email" value={form.email} onChange={handleChange} placeholder="cliente@email.com" /></label>
              <label className="crm-field"><span>Dirección</span><input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" /></label>
              <label className="crm-field"><span>Ciudad</span><input name="city" value={form.city} onChange={handleChange} placeholder="Ciudad" /></label>
              <label className="crm-field"><span>Estado</span><select name="status" value={form.status} onChange={handleChange}><option value="active">Activo</option><option value="lead">Potencial</option><option value="inactive">Inactivo</option><option value="archived">Archivado</option></select></label>
              <label className="crm-field client-span-2"><span>Notas internas</span><textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notas, referencias o detalles importantes" /></label>
            </div>
          </section>

          {mode === 'edit' && (
            <section className="client-panel client-actions-panel">
              <h3>Acciones rápidas</h3>
              <div className="client-actions-row">
                <button className="crm-button" type="button" onClick={openPhoneActions} disabled={!form.phone}><Phone size={16} /> Teléfono / WhatsApp</button>
                <button className="crm-button" type="button" onClick={openEmailAction} disabled={!form.email}><Mail size={16} /> Email</button>
              </div>
            </section>
          )}

          {mode === 'edit' && (
            <section className="client-panel client-span-2">
              <h3>Trabajos del cliente</h3>
              {client?.jobs?.length ? (
                <div className="client-related-list">
                  {client.jobs.map((job) => (
                    <article key={job.id}>
                      <div>
                        <strong>{job.title}</strong>
                        <small>{job.estimatedDeliveryDate ? `Entrega estimada: ${formatDate(job.estimatedDeliveryDate)}` : 'Sin fecha de entrega'}</small>
                      </div>
                      <StatusBadge value={job.status} labels={JOB_STATUS_LABELS} />
                    </article>
                  ))}
                </div>
              ) : <EmptyState title="Sin trabajos asociados" description="Cuando este cliente tenga trabajos, aparecerán en esta sección." />}
            </section>
          )}

          {mode === 'edit' && (
            <section className="client-panel client-span-2">
              <h3>Presupuestos</h3>
              {client?.quotes?.length ? (
                <div className="client-related-list">
                  {client.quotes.map((quote) => (
                    <article key={quote.id}>
                      <div>
                        <strong>{quote.quoteNumber} · {quote.title}</strong>
                        <small>{formatDate(quote.createdAt)} · {formatMoney(quote.total)}</small>
                      </div>
                      <StatusBadge value={quote.status} labels={QUOTE_STATUS_LABELS} />
                    </article>
                  ))}
                </div>
              ) : <EmptyState title="Sin presupuestos" description="Los presupuestos vinculados al cliente aparecerán acá." />}
            </section>
          )}
        </form>
      </BaseDrawer>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Eliminar cliente"
        description={`¿Estás seguro de querer eliminar/archivar a ${client?.fullName || 'este cliente'}?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={saving}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete?.(client)}
      />

      <ActionModal
        isOpen={Boolean(contactAction)}
        title={contactAction?.title}
        description={contactAction?.description}
        actions={contactAction?.actions || []}
        onClose={() => setContactAction(null)}
      />
    </>
  );
}
