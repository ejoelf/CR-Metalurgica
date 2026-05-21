import { CalendarDays, FileText, Receipt, UserRound } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { QUOTE_STATUS_LABELS } from '../../utils/statusLabels.js';
import { formatDate, formatMoney } from '../../utils/formatters.js';

function getRecipientName(quote) {
  return quote.client?.fullName || quote.recipientName || quote.recipientCompany || quote.recipientContactName || 'Destinatario manual';
}

export default function QuoteCard({ quote, onOpen, onStatusChange }) {
  return (
    <article className="quote-card-v2" role="button" tabIndex={0} onClick={() => onOpen(quote)} onKeyDown={(event) => event.key === 'Enter' && onOpen(quote)}>
      <header>
        <span className="quote-card-icon"><Receipt size={22} /></span>
        <div>
          <strong>{quote.quoteNumber || 'Sin número'} · {quote.title || 'Presupuesto sin título'}</strong>
          <p><UserRound size={14} /> {getRecipientName(quote)}</p>
        </div>
      </header>

      <div className="quote-card-meta">
        <span><CalendarDays size={14} /> {formatDate(quote.createdAt)}</span>
        <span><FileText size={14} /> {quote.pdfUrl ? 'PDF generado' : 'PDF pendiente'}</span>
      </div>

      <div className="quote-card-bottom">
        <div>
          <small>Total</small>
          <b>{formatMoney(quote.total || 0)}</b>
        </div>
        <StatusBadge value={quote.status} labels={QUOTE_STATUS_LABELS} />
      </div>

      <select
        className="quote-status-select"
        value={quote.status}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onStatusChange(quote, event.target.value)}
        aria-label="Cambiar estado del presupuesto"
      >
        {Object.entries(QUOTE_STATUS_LABELS)
          .filter(([value]) => ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'].includes(value))
          .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </article>
  );
}
