import { useEffect, useRef, useState } from 'react';
import { CreditCard, Landmark, Loader2, Save, UploadCloud } from 'lucide-react';
import { settingsService } from '../../services/settingsService.js';
import { uploadsService } from '../../services/uploadsService.js';

const initialForm = {
  businessName: 'CF Metal Pintura',
  publicName: 'CF Metal Pintura',
  legalName: '',
  taxId: '',
  phone: '(0358) 155719450',
  whatsapp: '5493585719450',
  email: 'cesarromanisio6@gmail.com',
  website: '',
  logoUrl: '',
  address: 'Las Higueras, Río Cuarto, Córdoba',
  city: 'Las Higueras',
  province: 'Córdoba',
  country: 'Argentina',
  instagramUrl: 'https://www.instagram.com/cesarromanisio/',
  facebookUrl: 'https://www.facebook.com/CesarRomanisioHig',
  googleMapsUrl: 'https://maps.app.goo.gl/etKxF4gzr3Wg45W6A',
  quoteValidityDays: 15,
  quoteDefaultValidityDays: 15,
  defaultTaxRate: 21,
  defaultMargin: 15,
  defaultProfitMargin: 15,
};

function normalizePhoneForWhatsapp(value = '') {
  return String(value).replace(/[^0-9]/g, '');
}

function resolveAssetUrl(value = '') {
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  return `http://localhost:4000${value}`;
}

export default function BusinessSettingsPanel() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  useEffect(() => {
    settingsService.getBusinessSettings()
      .then((data) => setForm({ ...initialForm, ...data }))
      .catch((error) => setFeedback(`No se pudo cargar: ${error.message}`));
  }, []);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setUploadingLogo(true);
      setFeedback(null);
      const uploaded = await uploadsService.uploadImage(file);
      setForm((current) => ({ ...current, logoUrl: uploaded.url }));
      setFeedback('Logo cargado correctamente. Recordá guardar la configuración.');
    } catch (error) {
      setFeedback(`No se pudo cargar el logo: ${error.message}`);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const phoneAsWhatsapp = normalizePhoneForWhatsapp(form.phone);
      const data = await settingsService.updateBusinessSettings({
        ...form,
        whatsapp: phoneAsWhatsapp,
        quoteValidityDays: Number(form.quoteValidityDays) || 15,
        quoteDefaultValidityDays: Number(form.quoteDefaultValidityDays) || 15,
        defaultTaxRate: Number(form.defaultTaxRate) || 0,
        defaultMargin: Number(form.defaultMargin) || 0,
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
          <p>Información central del negocio para CRM, web pública, presupuestos, PDF y reportes.</p>
        </div>
        <button className="primary-button" type="submit" disabled={saving || uploadingLogo}>
          <Save size={18} /> {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>

      {feedback && <p className={feedback.startsWith('No se') ? 'error-box' : 'success-box'}>{feedback}</p>}

      <div className="settings-grid settings-grid-wide">
        <article className="panel-card">
          <h2>Identidad</h2>
          <label>Nombre interno del sistema<input name="businessName" value={form.businessName || ''} onChange={handleChange} placeholder="Nombre usado dentro del CRM" /></label>
          <p className="settings-help-text">Se usa internamente en CRM, reportes técnicos y configuración del sistema.</p>
          <label>Nombre público visible<input name="publicName" value={form.publicName || ''} onChange={handleChange} placeholder="Nombre que ve el cliente" /></label>
          <p className="settings-help-text">Se usa en web pública, presupuestos, PDF, emails y comunicaciones.</p>
          <label>Razón social<input name="legalName" value={form.legalName || ''} onChange={handleChange} placeholder="Opcional" /></label>
          <label>CUIT / CUIL<input name="taxId" value={form.taxId || ''} onChange={handleChange} placeholder="Opcional" /></label>
        </article>

        <article className="panel-card">
          <h2>Logo</h2>
          <input ref={logoInputRef} className="hidden-file-input" type="file" accept="image/*" onChange={handleLogoUpload} />
          <div className="settings-logo-preview">
            {form.logoUrl ? <img src={resolveAssetUrl(form.logoUrl)} alt="Logo del negocio" /> : <span>Sin logo cargado</span>}
          </div>
          <button className="crm-button" type="button" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}>
            {uploadingLogo ? <Loader2 size={16} className="spin-icon" /> : <UploadCloud size={16} />} Cargar logo
          </button>
          <label>URL del logo<input name="logoUrl" value={form.logoUrl || ''} onChange={handleChange} placeholder="Se completa automáticamente al cargar archivo" /></label>
          <p className="settings-help-text">El logo queda preparado para PDF, presupuestos, comunicaciones y futuras plantillas.</p>
        </article>

        <article className="panel-card">
          <h2>Contacto</h2>
          <label>Email<input name="email" type="email" value={form.email || ''} onChange={handleChange} /></label>
          <label>Teléfono y WhatsApp<input name="phone" value={form.phone || ''} onChange={handleChange} /></label>
          <p className="settings-help-text">Usamos el mismo número para llamadas y WhatsApp. El sistema lo normaliza internamente al guardar.</p>
          <label>Sitio web<input name="website" value={form.website || ''} onChange={handleChange} placeholder="https://..." /></label>
        </article>

        <article className="panel-card">
          <h2>Ubicación</h2>
          <label>Dirección<input name="address" value={form.address || ''} onChange={handleChange} /></label>
          <label>Ciudad<input name="city" value={form.city || ''} onChange={handleChange} /></label>
          <label>Provincia<input name="province" value={form.province || ''} onChange={handleChange} /></label>
          <label>País<input name="country" value={form.country || ''} onChange={handleChange} /></label>
          <label>Link de ubicación en Google Maps<input name="googleMapsUrl" value={form.googleMapsUrl || ''} onChange={handleChange} /></label>
          <p className="settings-help-text">Sirve por si el taller cambia de ubicación o si se quiere actualizar el link público del mapa.</p>
        </article>

        <article className="panel-card">
          <h2>Redes</h2>
          <label>Instagram<input name="instagramUrl" value={form.instagramUrl || ''} onChange={handleChange} /></label>
          <label>Facebook<input name="facebookUrl" value={form.facebookUrl || ''} onChange={handleChange} /></label>
          <p className="settings-help-text">Estos datos quedan listos para usarse en la web pública, footer, contacto y futuras automatizaciones.</p>
        </article>

        <article className="panel-card">
          <h2>Presupuestos y PDF</h2>
          <label>Validez predeterminada en días<input name="quoteDefaultValidityDays" type="number" min="1" value={form.quoteDefaultValidityDays || 15} onChange={handleChange} /></label>
          <label>Validez alternativa en días<input name="quoteValidityDays" type="number" min="1" value={form.quoteValidityDays || 15} onChange={handleChange} /></label>
          <label>IVA / impuesto %<input name="defaultTaxRate" type="number" min="0" step="0.01" value={form.defaultTaxRate || 0} onChange={handleChange} /></label>
          <label>Margen comercial %<input name="defaultMargin" type="number" min="0" step="0.01" value={form.defaultMargin || 0} onChange={handleChange} /></label>
          <label>Ganancia sugerida %<input name="defaultProfitMargin" type="number" min="0" step="0.01" value={form.defaultProfitMargin || 0} onChange={handleChange} /></label>
          <p className="settings-help-text">Estos valores sirven como base para presupuestos. Al generar uno nuevo se pueden modificar manualmente.</p>
        </article>

        <article className="panel-card settings-integrations-card">
          <h2>Integraciones futuras</h2>
          <p className="settings-help-text">Estas conexiones quedan pensadas para una próxima versión si César decide automatizar pagos, facturación o servicios externos.</p>
          <div className="settings-integration-actions">
            <button className="crm-button" type="button" disabled><CreditCard size={16} /> Conectar Mercado Pago</button>
            <button className="crm-button" type="button" disabled><Landmark size={16} /> Conectar ARCA</button>
          </div>
          <p className="settings-help-text">Próximamente / V2. Por ahora no realizan ninguna acción.</p>
        </article>
      </div>
    </form>
  );
}
