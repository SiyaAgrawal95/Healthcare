function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  options,
  min,
  max,
}) {
  const inputId = `input-${name}`;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      {type === "select" ? (
        <select
          id={inputId}
          name={name}
          value={value}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={error ? "error" : ""}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? "error" : ""}
          rows={4}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={error ? "error" : ""}
          min={min}
          max={max}
        />
      )}
      
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default FormInput;
