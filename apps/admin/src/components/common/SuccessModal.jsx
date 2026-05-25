import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import BaseModal from './BaseModal.jsx';

export default function SuccessModal({
  isOpen,
  title = 'Acción realizada',
  description = 'La operación se completó correctamente.',
  autoCloseMs = 2400,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => onClose?.(), autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <BaseModal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
      size="sm"
      closeOnBackdrop={false}
    >
      <div className="success-modal-content success-modal-content-pro">
        <span className="success-modal-icon"><CheckCircle2 size={42} /></span>
        <span className="success-modal-progress" aria-hidden="true" />
      </div>
    </BaseModal>
  );
}
