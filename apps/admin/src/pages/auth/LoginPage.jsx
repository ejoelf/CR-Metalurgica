import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { cfBrandSlogan } from '../../../../../packages/branding/cfLogo.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBranding } from '../../hooks/useBranding.js';

const publicWebUrl = import.meta.env.VITE_PUBLIC_WEB_URL || 'http://localhost:5173/';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const branding = useBranding();
  const brandName = branding.publicName || branding.businessName;
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <a className="login-back-link ghost-button" href={publicWebUrl}>
        <ArrowLeft size={18} /> Volver a la web
      </a>

      <section className="login-card">
        <div className="login-brand">
          <span className="login-logo-mark"><img src={branding.logoUrl} alt="Logo" /></span>
          <div>
            <strong>{brandName}</strong>
            <small>{cfBrandSlogan}</small>
          </div>
        </div>

        <h1>Ingresar al sistema</h1>
        <p>Gestioná clientes, trabajos, presupuestos, finanzas, agenda y galería desde un único panel.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Usuario
            <input name="identifier" type="text" value={form.identifier} onChange={handleChange} required placeholder="Tu usuario" autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Tu contraseña" autoComplete="current-password" />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
          {error && <p className="error-box">{error}</p>}
        </form>
      </section>
    </main>
  );
}
