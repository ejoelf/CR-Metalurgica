import BaseModal from './BaseModal.jsx';

export default function ActionModal({
  isOpen,
  title = 'Elegí una acción',
  description,
  actions = [],
  onClose,
}) {
  return (
    <BaseModal isOpen={isOpen} title={title} description={description} onClose={onClose} size="sm">
      <div className="crm-action-list">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`crm-action-item ${action.danger ? 'is-danger' : ''}`}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {Icon && <Icon size={18} />}
              <span>
                <strong>{action.label}</strong>
                {action.description && <small>{action.description}</small>}
              </span>
            </button>
          );
        })}
      </div>
    </BaseModal>
  );
}
