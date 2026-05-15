import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { settingsService } from '../../services/settingsService.js';

const initialForm = {
  businessName: 'CF Metal Pintura',
  publicName: 'CF Metal Pintura',
  phone: '(0358) 155719450',
  whatsapp: '5493585719450',
  email: 'cesarromanisio6@gmail.com',
  address: 'Las Higueras, Río Cuarto, Córdoba',
  city: 'Las Higueras',
  province: 'Córdoba',
  country: 'Argentina',
  quoteDefaultValidityDays: 15,
  defaultProfitMargin: 0,
};

export default function BusinessSettingsPanel() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getBusinessSettings()
      .then((data) => setForm({ ...initialForm, ...data }))
      .catch((error) => setFeedback(`No se pudo cargar: ${error.message}`));
  }, []);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const data = await settingsService.updateBusinessSettings({
        ...form,
        quoteDefaultValidityDays: Number(form.quoteDefaultValidityDays) || 15,
        defaultProfitMargin: Number(form.defaultProfitMargin) || 0,
      });
      setForm({ ...initialForm, ...data });
      setFeedback('Configuración del negocio actualizada.');
    } catch (error) {
      setFeedback(`No se pudo guardar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="settings-section" onSubmit={handleSubmit}>
      <div className="settings-section-header">
        <div>
          <span className="modal-eyebrow">Negocio</span>
          <h2>Datos comerciales</h2>
          <p>Información central del negocio para CRM, web y presupuestos.</p>
        </div>
        <button className="primary-button" type="submit" disabled={saving}>
          <Save size={18} /> {saving ? 'Guardando...' : 'Guardar negocio'}
        </button>
      </div>

      {feedback && <p className={feedback.startsWith('No se') ? 'error-box' : 'success-box'}>{feedback}</p>}

      <div className="settings-grid">
        <article className="panel-card">
          <h2>Identidad</h2>
          <label>Nombre interno<input name="businessName" value={form.businessName || ''} onChange={handleChange} /></label>
          <label>Nombre público<input name="publicName" value={form.publicName || ''} onChange={handleChange} /></label>
          <label>Email<input name="email" type="email" value={form.email || ''} onChange={handleChange} /></label>
          <label>Teléfono<input name="phone" value={form.phone || ''} onChange={handleChange} /></label>
        </article>

        <article className="panel-card">
          <h2>Operación</h2>
          <label>WhatsApp<input name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} /></label>
          <label>Dirección<input name="address" value={form.address || ''} onChange={handleChange} /></label>
          <label>Ciudad<input name="city" value={form.city || ''} onChange={handleChange} /></label>
          <label>Provincia<input name="province" value={form.province || ''} onChange={handleChange} /></label>
          <label>País<input name="country" value={form.country || ''} onChange={handleChange} /></label>
        </article>

        <article className="panel-card">
          <h2>Presupuestos</h2>
          <label>Validez en días<input name="quoteDefaultValidityDays" type="number" value={form.quoteDefaultValidityDays || 15} onChange={handleChange} /></label>
          <label>Margen sugerido %<input name="defaultProfitMargin" type="number" value={form.defaultProfitMargin || 0} onChange={handleChange} /></label>
        </article>
      </div>
    </form>
  );
}
