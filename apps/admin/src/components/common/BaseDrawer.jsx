import { X } from 'lucide-react';

export default function BaseDrawer({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  size = 'lg',
}) {
  if (!isOpen) return null;

  return (
    <div className="crm-drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <aside className={`crm-drawer crm-drawer-${size}`} role="dialog" aria-modal="true" aria-labelledby={title ? 'crm-drawer-title' : undefined}>
        <header className="crm-drawer-header">
          <div>
            {title && <h2 id="crm-drawer-title">{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          <button className="crm-icon-button" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>
        <div className="crm-drawer-body">{children}</div>
        {footer && <footer className="crm-drawer-footer">{footer}</footer>}
      </aside>
    </div>
  );
}
