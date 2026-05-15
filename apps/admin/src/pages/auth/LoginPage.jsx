import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { cfBrandName, cfLogoDataUrl } from '../../../../../packages/branding/cfLogo.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      <section className="login-card">
        <div className="login-brand">
          <span className="login-logo-mark"><img src={cfLogoDataUrl} alt={`${cfBrandName} logo`} /></span>
          <div>
            <strong>{cfBrandName} PRO</strong>
            <small>Panel CRM privado</small>
          </div>
        </div>

        <h1>Ingresar al sistema</h1>
        <p>Gestioná clientes, trabajos, presupuestos, finanzas, agenda y galería desde un único panel.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="admin@cfmetalpintura.com" />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Tu contraseña" />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
          {error && <p className="error-box">{error}</p>}
        </form>
      </section>
    </main>
  );
}
