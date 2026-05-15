import PageHeader from '../../components/common/PageHeader.jsx';
import BusinessSettingsPanel from './BusinessSettingsPanel.jsx';
import AccountSettingsPanel from './AccountSettingsPanel.jsx';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Datos del negocio, parámetros comerciales, usuario activo y seguridad del CRM."
      />

      <div className="settings-stack">
        <BusinessSettingsPanel />
        <AccountSettingsPanel />
      </div>
    </div>
  );
}
