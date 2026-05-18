export default function DateInput({ label, value, onChange, name, type = 'date', disabled = false, required = false, min, max }) {
  return (
    <label className="crm-field">
      {label && <span>{label}</span>}
      <input
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
      />
    </label>
  );
}
