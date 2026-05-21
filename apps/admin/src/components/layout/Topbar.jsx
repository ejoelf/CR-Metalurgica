import { Menu, Search } from 'lucide-react';

export default function Topbar({ onOpenMobileSidebar }) {
  return (
    <header className="topbar topbar-clean">
      <button className="crm-mobile-menu-button" type="button" onClick={onOpenMobileSidebar} aria-label="Abrir menú del panel">
        <Menu size={20} />
      </button>
      <div className="topbar-search">
        <Search size={18} />
        <input placeholder="Buscar clientes, trabajos o presupuestos..." />
      </div>
    </header>
  );
}
