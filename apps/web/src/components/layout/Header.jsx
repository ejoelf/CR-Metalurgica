import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { businessInfo } from '../../data/siteData.js';
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
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">CF</span>
          <span>
            <strong>{businessInfo.name}</strong>
            <small>Metalúrgica · Pintura · Obra</small>
          </span>
        </Link>

        <div className="header-actions-mobile">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className={`main-nav ${open ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <button className="theme-toggle desktop-theme-toggle" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <a className="nav-cta" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
