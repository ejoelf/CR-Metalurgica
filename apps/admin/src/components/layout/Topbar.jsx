import { LogOut, Moon, Search, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../hooks/useTheme.js';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input placeholder="Buscar clientes, trabajos o presupuestos..." />
      </div>
      <div className="topbar-actions">
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
        <div className="topbar-user">
          <div>
            <strong>{user?.name || 'Usuario'}</strong>
            <small>{user?.role || 'admin'}</small>
          </div>
          <button type="button" onClick={logout} title="Cerrar sesión">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
