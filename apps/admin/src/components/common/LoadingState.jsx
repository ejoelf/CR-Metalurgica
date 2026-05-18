export default function LoadingState({ label = 'Cargando información...' }) {
  return (
    <div className="crm-loading-state" role="status" aria-live="polite">
      <span className="crm-loader" />
      <p>{label}</p>
    </div>
  );
}
