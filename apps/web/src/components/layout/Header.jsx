import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Moon, Phone, Sun, X } from 'lucide-react';
import { cfBrandName, cfLogoDataUrl } from '../../../../../packages/branding/cfLogo.js';
import { useTheme } from '../../hooks/useTheme.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Trabajos', to: '/trabajos' },
  { label: 'Galería', to: '/galeria' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Presupuestos', to: '/presupuestos' },
  { label: 'Contacto', to: '/contacto' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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

        <div className="header-actions-mobile">
          <button className="theme-toggle editorial-theme-toggle" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="menu-button editorial-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className={`main-nav editorial-nav ${open ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <button className="theme-toggle editorial-theme-toggle desktop-theme-toggle" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
            <span>{isDark ? 'Claro' : 'Oscuro'}</span>
          </button>
          <a className="nav-cta editorial-call" href={buildWhatsAppUrl('5493585719450', quoteMessage())} target="_blank" rel="noreferrer">
            <Phone size={16} /> Llamar ahora
          </a>
        </nav>
      </div>
    </header>
  );
}
