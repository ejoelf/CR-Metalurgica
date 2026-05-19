import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const SIDEBAR_KEY = 'cfmp_sidebar_collapsed';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === 'true');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    document.body.classList.toggle('crm-mobile-menu-open', mobileSidebarOpen);
    return () => document.body.classList.remove('crm-mobile-menu-open');
  }, [mobileSidebarOpen]);

  function handleToggleSidebar() {
    if (window.matchMedia('(max-width: 720px)').matches) {
      setMobileSidebarOpen((value) => !value);
      return;
    }

    setSidebarCollapsed((value) => !value);
  }

  function handleCloseMobileSidebar() {
    setMobileSidebarOpen(false);
  }

  return (
    <div className={`admin-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      {mobileSidebarOpen && <button className="mobile-sidebar-backdrop" type="button" aria-label="Cerrar menú" onClick={handleCloseMobileSidebar} />}
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} onNavigate={handleCloseMobileSidebar} />
      <div className="admin-main">
        <Topbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
