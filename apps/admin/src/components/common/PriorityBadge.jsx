import StatusBadge from './StatusBadge.jsx';
import { PRIORITY_LABELS } from '../../utils/statusLabels.js';

export default function PriorityBadge({ value = 'normal' }) {
  return <StatusBadge value={value} labels={PRIORITY_LABELS} className="crm-priority-badge" />;
}
