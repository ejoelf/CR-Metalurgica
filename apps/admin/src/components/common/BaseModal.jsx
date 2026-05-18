import { X } from 'lucide-react';

export default function BaseModal({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
}) {
  if (!isOpen) return null;

  function handleBackdropClick(event) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div className="crm-modal-backdrop" onMouseDown={handleBackdropClick} role="presentation">
      <section className={`crm-modal crm-modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={title ? 'crm-modal-title' : undefined}>
        <header className="crm-modal-header">
          <div>
            {title && <h2 id="crm-modal-title">{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          <button className="crm-icon-button" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className="crm-modal-body">{children}</div>

        {footer && <footer className="crm-modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}
