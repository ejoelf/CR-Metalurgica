import { Save } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Datos del negocio, contacto, redes, parámetros de presupuesto, usuarios y categorías."
        action={<button className="primary-button"><Save size={18} /> Guardar cambios</button>}
      />

      <section className="settings-grid">
        <article className="panel-card">
          <h2>Datos del negocio</h2>
          <label>Nombre público<input defaultValue="CF Metal Pintura" /></label>
          <label>Teléfono<input defaultValue="(0358) 155719450" /></label>
          <label>Email<input defaultValue="cesarromanisio6@gmail.com" /></label>
          <label>Dirección<input defaultValue="Las Higueras, Río Cuarto, Córdoba" /></label>
        </article>

        <article className="panel-card">
          <h2>Parámetros comerciales</h2>
          <label>Validez presupuestos<input defaultValue="15 días" /></label>
          <label>Margen sugerido<input defaultValue="0%" /></label>
          <label>WhatsApp<input defaultValue="5493585719450" /></label>
          <label>Estado del sistema<input defaultValue="Activo" /></label>
        </article>
      </section>
    </div>
  );
}
