export default function MoneyInput({ label, value, onChange, name, placeholder = '0', disabled = false, required = false }) {
  return (
    <label className="crm-field">
      {label && <span>{label}</span>}
      <input
        name={name}
        type="number"
        min="0"
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
