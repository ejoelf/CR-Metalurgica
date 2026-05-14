import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import ClientsPage from '../pages/clients/ClientsPage.jsx';
import JobsPage from '../pages/jobs/JobsPage.jsx';
import QuotesPage from '../pages/quotes/QuotesPage.jsx';
import FinancePage from '../pages/finance/FinancePage.jsx';
import AgendaPage from '../pages/agenda/AgendaPage.jsx';
import GalleryPage from '../pages/gallery/GalleryPage.jsx';
import MessagesPage from '../pages/messages/MessagesPage.jsx';
import NotificationsPage from '../pages/notifications/NotificationsPage.jsx';
import SettingsPage from '../pages/settings/SettingsPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/trabajos" element={<JobsPage />} />
          <Route path="/presupuestos" element={<QuotesPage />} />
          <Route path="/finanzas" element={<FinancePage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/mensajes" element={<MessagesPage />} />
          <Route path="/notificaciones" element={<NotificationsPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
