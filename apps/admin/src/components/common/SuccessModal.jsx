import { CheckCircle2 } from 'lucide-react';
import BaseModal from './BaseModal.jsx';

export default function SuccessModal({
  isOpen,
  title = 'Acción realizada',
  description = 'La operación se completó correctamente.',
  confirmLabel = 'Aceptar',
  onClose,
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
      size="sm"
      footer={
        <button className="crm-button primary" type="button" onClick={onClose}>
          {confirmLabel}
        </button>
      }
    >
      <div className="success-modal-content">
        <span className="success-modal-icon"><CheckCircle2 size={38} /></span>
      </div>
    </BaseModal>
  );
}
