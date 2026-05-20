import { useEffect, useState } from 'react';
import { BarChart3, BriefcaseBusiness, CalendarDays, CircleDollarSign, FileText, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { dashboardService } from '../../services/dashboardService.js';
import { formatCurrency, formatDateTime } from '../../utils/formatters.js';

const jobStatusLabels = {
  pending: 'Pendiente',
  quoted: 'Presupuestado',
  approved: 'Aprobado',
  production: 'Producción',
  painted: 'Pintado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const emptyDashboard = {
  kpis: {
    activeClients: 0,
    activeJobs: 0,
    pendingQuotes: 0,
    monthlyBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  },
  chart: [],
  jobStatuses: [],
  latestMovements: [],
  nextEvents: [],
  recentQuotes: [],
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardService.getDashboard();
        setDashboard({ ...emptyDashboard, ...data, kpis: { ...emptyDashboard.kpis, ...(data?.kpis || {}) } });
      } catch (err) {
        setError(err.message || 'No se pudo cargar el dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const kpis = [
    { label: 'Clientes activos', value: dashboard.kpis.activeClients, icon: Users, tone: 'blue' },
    { label: 'Trabajos activos', value: dashboard.kpis.activeJobs, icon: BriefcaseBusiness, tone: 'orange' },
    { label: 'Presupuestos pendientes', value: dashboard.kpis.pendingQuotes, icon: FileText, tone: 'purple' },
    { label: 'Balance mensual', value: formatCurrency(dashboard.kpis.monthlyBalance), icon: CircleDollarSign, tone: dashboard.kpis.monthlyBalance >= 0 ? 'green' : 'red' },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Panel principal"
        title="Dashboard operativo"
        description="Resumen general conectado a clientes, trabajos, presupuestos, finanzas y agenda."
      />

      {error && <p className="warning-box">{error}</p>}
      {loading && <LoadingState label="Cargando dashboard..." />}

      {!loading && (
        <>
          <section className="kpi-grid">
            {kpis.map((item) => {
              const Icon = item.icon;
              return (
                <article className={`kpi-card ${item.tone}`} key={item.label}>
                  <Icon size={24} />
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="dashboard-grid">
            <article className="panel-card chart-card">
              <div className="panel-title">
                <BarChart3 size={20} />
                <h2>Ingresos vs egresos</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboard.chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="ingresos" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="egresos" fill="#64748b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </article>

            <article className="panel-card">
              <div className="panel-title">
                <BriefcaseBusiness size={20} />
                <h2>Estados de trabajos</h2>
              </div>
              <div className="status-list">
                {dashboard.jobStatuses.map((item) => (
                  <span key={item.status}>{jobStatusLabels[item.status] || item.status} <b>{item.count}</b></span>
                ))}
              </div>
            </article>
          </section>

          <section className="dashboard-lists-grid">
            <article className="panel-card">
              <div className="panel-title">
                <CircleDollarSign size={20} />
                <h2>Últimos ingresos</h2>
              </div>
              <div className="simple-list">
                {dashboard.latestMovements.length ? dashboard.latestMovements.map((item) => (
                  <span key={item.id}>{item.title}<b>{formatCurrency(item.amount)}</b></span>
                )) : <span>Sin ingresos registrados <b>-</b></span>}
              </div>
            </article>

            <article className="panel-card">
              <div className="panel-title">
                <CalendarDays size={20} />
                <h2>Próximos eventos</h2>
              </div>
              <div className="simple-list">
                {dashboard.nextEvents.length ? dashboard.nextEvents.map((item) => (
                  <span key={item.id}>{item.title}<b>{formatDateTime(item.startAt)}</b></span>
                )) : <span>Sin eventos próximos <b>-</b></span>}
              </div>
            </article>

            <article className="panel-card">
              <div className="panel-title">
                <FileText size={20} />
                <h2>Presupuestos recientes</h2>
              </div>
              <div className="simple-list">
                {dashboard.recentQuotes.length ? dashboard.recentQuotes.map((item) => (
                  <span key={item.id}>{item.quoteNumber} · {item.title}<b>{formatCurrency(item.total)}</b></span>
                )) : <span>Sin presupuestos recientes <b>-</b></span>}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
