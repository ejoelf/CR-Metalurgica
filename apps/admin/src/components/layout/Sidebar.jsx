import { NavLink } from 'react-router-dom';
import { Bell, CalendarDays, FileClock, GalleryHorizontal, Inbox, LayoutDashboard, LogOut, Menu, Receipt, Settings, Users, WalletCards, Wrench } from 'lucide-react';
import { cfBrandName, cfLogoDataUrl } from '../../../../../packages/branding/cfLogo.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSidebarCounts } from '../../hooks/useSidebarCounts.js';

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Trabajos', to: '/trabajos', icon: Wrench },
  { label: 'Presupuestos', to: '/presupuestos', icon: Receipt },
  { label: 'Finanzas', to: '/finanzas', icon: WalletCards },
  { label: 'Agenda', to: '/agenda', icon: CalendarDays },
  { label: 'Galería', to: '/galeria', icon: GalleryHorizontal },
  { label: 'Mensajes', to: '/mensajes', icon: Inbox, countKey: 'unreadMessages' },
  { label: 'Notificaciones', to: '/notificaciones', icon: Bell, countKey: 'unreadNotifications' },
  { label: 'Auditoría', to: '/auditoria', icon: FileClock },
  { label: 'Configuración', to: '/configuracion', icon: Settings },
];

function SidebarBadge({ value }) {
  const numericValue = Number(value || 0);
  if (numericValue <= 0) return null;

  return <span className="sidebar-count-badge" aria-label={`${numericValue} pendientes`}>{numericValue > 99 ? '99+' : numericValue}</span>;
}

export default function Sidebar({ collapsed = false, onToggle, onNavigate }) {
  const { logout, isAuthenticated } = useAuth();
  const { counts } = useSidebarCounts({ enabled: isAuthenticated });

  function handleLogout() {
    onNavigate?.();
    logout();
  }

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar-brand-row">
        <div className="sidebar-brand">
          <span className="sidebar-logo-mark"><img src={cfLogoDataUrl} alt={`${cfBrandName} logo`} /></span>
          <div className="sidebar-label">
            <strong>{cfBrandName}</strong>
          </div>
        </div>
        <button className="sidebar-toggle" type="button" onClick={onToggle} aria-label="Alternar menú lateral">
          <Menu size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const count = item.countKey ? counts[item.countKey] : 0;
          return (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined} onClick={onNavigate}>
              <span className="sidebar-icon-wrap">
                <Icon size={18} />
                {collapsed && <SidebarBadge value={count} />}
              </span>
              <span className="sidebar-label">{item.label}</span>
              {!collapsed && <SidebarBadge value={count} />}
            </NavLink>
          );
        })}
      </nav>

      <button className="sidebar-public-link sidebar-logout-link" type="button" onClick={handleLogout} title={collapsed ? 'Cerrar sesión' : undefined}>
        <LogOut size={18} /> <span className="sidebar-label">Cerrar sesión</span>
      </button>
    </aside>
  );
}
