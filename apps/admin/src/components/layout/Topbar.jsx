import { Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="topbar topbar-clean">
      <div className="topbar-search">
        <Search size={18} />
        <input placeholder="Buscar clientes, trabajos o presupuestos..." />
      </div>
    </header>
  );
}
