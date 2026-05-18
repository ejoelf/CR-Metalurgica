export default function PercentInput({ label, value, onChange, name, placeholder = '0', disabled = false, required = false }) {
  return (
    <label className="crm-field">
      {label && <span>{label}</span>}
      <input
        name={name}
        type="number"
        min="0"
        max="100"
        step="0.01"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        inputMode="decimal"
      />
    </label>
  );
}
