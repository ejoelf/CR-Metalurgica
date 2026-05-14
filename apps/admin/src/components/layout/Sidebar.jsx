import { NavLink } from 'react-router-dom';
import { Bell, CalendarDays, GalleryHorizontal, Home, Inbox, LayoutDashboard, Receipt, Settings, Users, WalletCards, Wrench } from 'lucide-react';

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Trabajos', to: '/trabajos', icon: Wrench },
  { label: 'Presupuestos', to: '/presupuestos', icon: Receipt },
  { label: 'Finanzas', to: '/finanzas', icon: WalletCards },
  { label: 'Agenda', to: '/agenda', icon: CalendarDays },
  { label: 'Galería', to: '/galeria', icon: GalleryHorizontal },
  { label: 'Mensajes', to: '/mensajes', icon: Inbox },
  { label: 'Notificaciones', to: '/notificaciones', icon: Bell },
  { label: 'Configuración', to: '/configuracion', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>CF</span>
        <div>
          <strong>CF Metal</strong>
          <small>CRM PRO</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to}>
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <a className="sidebar-public-link" href="/" target="_blank" rel="noreferrer">
        <Home size={18} /> Ver web pública
      </a>
    </aside>
  );
}
