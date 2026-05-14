import { BarChart3, BriefcaseBusiness, CircleDollarSign, FileText, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../../components/common/PageHeader.jsx';

const chartData = [
  { name: 'Ene', ingresos: 120000, egresos: 60000 },
  { name: 'Feb', ingresos: 180000, egresos: 85000 },
  { name: 'Mar', ingresos: 240000, egresos: 105000 },
  { name: 'Abr', ingresos: 210000, egresos: 92000 },
];

const kpis = [
  { label: 'Clientes activos', value: '24', icon: Users, tone: 'blue' },
  { label: 'Trabajos activos', value: '9', icon: BriefcaseBusiness, tone: 'orange' },
  { label: 'Presupuestos pendientes', value: '7', icon: FileText, tone: 'purple' },
  { label: 'Balance mensual', value: '$ 118.000', icon: CircleDollarSign, tone: 'green' },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Panel principal"
        title="Dashboard operativo"
        description="Resumen general de clientes, trabajos, presupuestos, finanzas y productividad."
      />

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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
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
            <span>Pendiente <b>3</b></span>
            <span>Presupuestado <b>4</b></span>
            <span>Aprobado <b>2</b></span>
            <span>Producción <b>5</b></span>
            <span>Pintado <b>1</b></span>
            <span>Entregado <b>12</b></span>
          </div>
        </article>
      </section>
    </div>
  );
}
