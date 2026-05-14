import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import SectionHeader from '../common/SectionHeader.jsx';
import { businessInfo, services } from '../../data/siteData.js';
import { sendContactMessage } from '../../services/contactService.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  serviceInterest: '',
  message: '',
};

export default function ContactSection({ compact = false }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await sendContactMessage(form);
      setStatus({ type: 'success', message: 'Consulta enviada correctamente. Te respondemos a la brevedad.' });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: 'No se pudo enviar desde la API. También podés escribirnos directo por WhatsApp.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section contact-section">
      <div className="container">
        {!compact && (
          <SectionHeader
            eyebrow="Contacto"
            title="Contanos qué necesitás y armamos tu presupuesto"
            description="Podés escribir por formulario o directamente por WhatsApp para coordinar detalles, medidas y tiempos."
          />
        )}

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Nombre
                <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Tu nombre" />
              </label>
              <label>
                Teléfono
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Tu teléfono" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
              </label>
              <label>
                Servicio
                <select name="serviceInterest" value={form.serviceInterest} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {services.map((service) => (
                    <option key={service.slug} value={service.title}>{service.title}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Mensaje
              <textarea name="message" value={form.message} onChange={handleChange} required rows="5" placeholder="Contanos qué trabajo necesitás, medidas aproximadas, zona y detalles importantes." />
            </label>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar consulta'}
            </button>

            {status.message && <p className={`form-message ${status.type}`}>{status.message}</p>}
          </form>

          <aside className="contact-panel">
            <h3>Contacto directo</h3>
            <p><Phone size={18} /> {businessInfo.phone}</p>
            <p><Mail size={18} /> {businessInfo.email}</p>
            <p><MapPin size={18} /> {businessInfo.location}</p>
            <a className="btn btn-secondary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage(form.serviceInterest || 'trabajo a medida'))} target="_blank" rel="noreferrer">
              Abrir WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
