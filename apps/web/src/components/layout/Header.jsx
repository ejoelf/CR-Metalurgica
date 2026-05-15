import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { cfBrandName, cfLogoDataUrl } from '../../../../../packages/branding/cfLogo.js';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Trabajos', to: '/trabajos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Presupuestos', to: '/presupuestos' },
  { label: 'Contacto', to: '/contacto' },
];

const adminLoginUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174/login';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header editorial-header">
      <div className="container header-inner editorial-header-inner">
        <Link className="brand editorial-brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark editorial-brand-mark logo-brand-mark">
            <img src={cfLogoDataUrl} alt={`${cfBrandName} logo`} />
          </span>
          <span>
            <strong>{cfBrandName}</strong>
            <small>Metalúrgica · Pintura · Obra</small>
          </span>
        </Link>

        <nav className={`main-nav editorial-nav ${open ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions-mobile navbar-actions">
          <a className="navbar-login-link" href={adminLoginUrl} aria-label="Ingresar al panel CRM">
            <LogIn size={19} />
          </a>
          <button className="menu-button editorial-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
