import { ArrowDownCircle, ArrowUpCircle, Plus, WalletCards } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { expensesService, incomesService } from '../../services/resourceService.js';

const fallbackIncomes = [
  { id: '1', title: 'Seña portón', amount: 80000, status: 'paid', paymentMethod: 'transfer' },
];

const fallbackExpenses = [
  { id: '1', title: 'Materiales hierro', amount: 45000, category: 'materials', paymentMethod: 'cash' },
];

export default function FinancePage() {
  const incomes = useApiResource(incomesService, fallbackIncomes);
  const expenses = useApiResource(expensesService, fallbackExpenses);

  const totalIncome = incomes.items.filter((item) => item.status === 'paid').reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const totalExpenses = expenses.items.reduce((acc, item) => acc + Number(item.amount || 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Finanzas"
        title="Ingresos, egresos y balance"
        description="Control básico de caja, movimientos, métodos de pago, filtros por fecha y rentabilidad futura por trabajo."
        action={<button className="primary-button"><Plus size={18} /> Nuevo movimiento</button>}
      />

      <section className="kpi-grid finance-kpis">
        <article className="kpi-card green"><ArrowUpCircle size={24} /><div><span>Ingresos cobrados</span><strong>$ {totalIncome.toLocaleString('es-AR')}</strong></div></article>
        <article className="kpi-card red"><ArrowDownCircle size={24} /><div><span>Egresos</span><strong>$ {totalExpenses.toLocaleString('es-AR')}</strong></div></article>
        <article className="kpi-card blue"><WalletCards size={24} /><div><span>Balance</span><strong>$ {(totalIncome - totalExpenses).toLocaleString('es-AR')}</strong></div></article>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <h2>Ingresos</h2>
          {incomes.error && <p className="warning-box">Datos de ejemplo. API: {incomes.error}</p>}
          <div className="simple-list">
            {incomes.items.map((item) => <span key={item.id}>{item.title}<b>$ {Number(item.amount).toLocaleString('es-AR')}</b></span>)}
          </div>
        </article>
        <article className="panel-card">
          <h2>Egresos</h2>
          {expenses.error && <p className="warning-box">Datos de ejemplo. API: {expenses.error}</p>}
          <div className="simple-list">
            {expenses.items.map((item) => <span key={item.id}>{item.title}<b>$ {Number(item.amount).toLocaleString('es-AR')}</b></span>)}
          </div>
        </article>
      </section>
    </div>
  );
}
