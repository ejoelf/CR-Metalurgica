import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No hay información para mostrar',
  description = 'Cuando existan registros, los vas a ver en esta sección.',
  action,
}) {
  return (
    <div className="crm-empty-state">
      <span className="crm-empty-icon"><Icon size={26} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div className="crm-empty-action">{action}</div>}
    </div>
  );
}
