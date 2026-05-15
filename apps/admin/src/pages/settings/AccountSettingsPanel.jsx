import { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { accountService } from '../../services/accountService.js';

export default function AccountSettingsPanel() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [feedback, setFeedback] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  function handleProfileChange(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handlePasswordChange(event) {
    setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setSavingProfile(true);
    setFeedback(null);

    try {
      await accountService.updateProfile(profile);
      setFeedback('Perfil actualizado correctamente. Volvé a iniciar sesión para refrescar los datos del panel.');
    } catch (error) {
      setFeedback(`No se pudo actualizar el perfil: ${error.message}`);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setSavingPassword(true);
    setFeedback(null);

    try {
      await accountService.changePassword(passwords);
      setFeedback('Contraseña actualizada. Por seguridad se cerrará la sesión.');
      setTimeout(() => logout(), 1200);
    } catch (error) {
      setFeedback(`No se pudo cambiar la contraseña: ${error.message}`);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <section className="settings-section">
      <div className="settings-section-header">
        <div>
          <span className="modal-eyebrow">Cuenta</span>
          <h2>Usuario y seguridad</h2>
          <p>Actualizá los datos del usuario activo y la contraseña de acceso al CRM.</p>
        </div>
      </div>

      {feedback && <p className={feedback.startsWith('No se') ? 'error-box' : 'success-box'}>{feedback}</p>}

      <div className="settings-grid">
        <form className="panel-card" onSubmit={handleProfileSubmit}>
          <h2>Perfil</h2>
          <label>Nombre<input name="name" value={profile.name} onChange={handleProfileChange} /></label>
          <label>Email<input name="email" type="email" value={profile.email} onChange={handleProfileChange} /></label>
          <button className="primary-button" type="submit" disabled={savingProfile}>
            <Save size={18} /> {savingProfile ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>

        <form className="panel-card" onSubmit={handlePasswordSubmit}>
          <h2>Cambiar contraseña</h2>
          <label>Contraseña actual<input name="currentPassword" type="password" value={passwords.currentPassword} onChange={handlePasswordChange} /></label>
          <label>Nueva contraseña<input name="newPassword" type="password" value={passwords.newPassword} onChange={handlePasswordChange} /></label>
          <label>Confirmar nueva contraseña<input name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handlePasswordChange} /></label>
          <button className="primary-button" type="submit" disabled={savingPassword}>
            <KeyRound size={18} /> {savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </section>
  );
}
