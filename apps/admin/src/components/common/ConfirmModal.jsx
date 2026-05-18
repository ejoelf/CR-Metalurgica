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
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button className="crm-button ghost" type="button" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={`crm-button ${danger ? 'danger' : 'primary'}`} type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </>
      }
    />
  );
}
