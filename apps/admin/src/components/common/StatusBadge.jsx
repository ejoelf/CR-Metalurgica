import { getLabel } from '../../utils/statusLabels.js';

export default function StatusBadge({ value, labels = {}, variant = 'neutral', className = '' }) {
  const label = getLabel(labels, value, value || 'Sin estado');
  const safeValue = String(value || variant || 'neutral').replace(/[^a-zA-Z0-9_-]/g, '-');

  return <span className={`crm-status-badge crm-status-${safeValue} ${className}`}>{label}</span>;
}
