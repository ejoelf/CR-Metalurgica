import { LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input placeholder="Buscar clientes, trabajos o presupuestos..." />
      </div>
      <div className="topbar-user">
        <div>
          <strong>{user?.name || 'Usuario'}</strong>
          <small>{user?.role || 'admin'}</small>
        </div>
        <button type="button" onClick={logout} title="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
