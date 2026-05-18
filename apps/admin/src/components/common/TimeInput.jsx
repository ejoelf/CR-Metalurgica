export default function TimeInput({ label, value, onChange, name, disabled = false, required = false }) {
  return (
    <label className="crm-field">
      {label && <span>{label}</span>}
      <input
        name={name}
        type="time"
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
    </label>
  );
}
