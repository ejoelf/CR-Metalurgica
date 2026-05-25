import { useState } from 'react';
import BaseModal from './BaseModal.jsx';

export default function ConfirmModal({
  isOpen,
  title = 'Confirmar acción',
  description,
  confirmLabel = 'Sí, confirmar',
  cancelLabel = 'No, cancelar',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
  children,
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isProcessing = loading || internalLoading;

  async function handleConfirm() {
    if (isProcessing) return;
    try {
      setInternalLoading(true);
      await onConfirm?.();
      onClose?.();
    } finally {
      setInternalLoading(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={isProcessing ? undefined : onClose}
      size="sm"
      footer={
        <>
          <button className="crm-button ghost" type="button" onClick={onClose} disabled={isProcessing}>{cancelLabel}</button>
          <button className={`crm-button ${danger ? 'danger' : 'primary'}`} type="button" onClick={handleConfirm} disabled={isProcessing}>{isProcessing ? 'Procesando...' : confirmLabel}</button>
        </>
      }
    >
      {children}
    </BaseModal>
  );
}
