import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
