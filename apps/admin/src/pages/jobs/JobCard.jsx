import { CalendarDays, UserRound, Wrench } from 'lucide-react';
import PriorityBadge from '../../components/common/PriorityBadge.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { JOB_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/statusLabels.js';
import { formatDate, formatMoney, formatPercent } from '../../utils/formatters.js';

function statusOptionsFor(job) {
  if (job.status === 'completed') return [['completed', JOB_STATUS_LABELS.completed], ['delivered', JOB_STATUS_LABELS.delivered]];
  return Object.entries(JOB_STATUS_LABELS);
}

export default function JobCard({ job, onOpen, onStatusChange }) {
  const isClosed = ['cancelled', 'delivered'].includes(job.status);

  return (
    <article className="job-card" onClick={() => onOpen(job)} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen(job)}>
      <header>
        <span className="job-card-icon"><Wrench size={20} /></span>
        <div>
          <h3>{job.title}</h3>
          <p><UserRound size={14} /> {job.client?.fullName || 'Sin cliente'}</p>
        </div>
      </header>

      <div className="job-card-badges">
        <StatusBadge value={job.status} labels={JOB_STATUS_LABELS} />
        <PriorityBadge value={job.priority} />
      </div>

      <div className="job-card-meta">
        <span><CalendarDays size={14} /> {job.estimatedDeliveryDate ? formatDate(job.estimatedDeliveryDate) : 'Sin fecha de entrega'}</span>
        <span>{job.serviceType || 'Servicio general'}</span>
      </div>

      <div className="job-card-money">
        <div><small>Total</small><strong>{formatMoney(job.finalPrice || job.estimatedPrice || 0)}</strong></div>
        <div><small>Pagado</small><strong>{formatMoney(job.paidAmount || 0)}</strong></div>
      </div>

      <div className="job-progress"><span style={{ width: `${Math.min(Number(job.paymentPercent || 0), 100)}%` }} /></div>
      <footer><StatusBadge value={job.paymentStatus || 'none'} labels={PAYMENT_STATUS_LABELS} /><small>{formatPercent(job.paymentPercent || 0, 0)} pagado</small></footer>

      <select className="job-card-status-select" value={job.status} onClick={(event) => event.stopPropagation()} onChange={(event) => onStatusChange(job, event.target.value)} aria-label="Cambiar estado del trabajo" disabled={isClosed}>
        {statusOptionsFor(job).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </article>
  );
}
