export default function OptionGroup({
  label,
  hint,
  options,
  value,
  onChange,
  type = "cards",
}) {
  return (
    <fieldset className="option-group">
      <legend>
        {label} <small>{hint}</small>
      </legend>
      <div className={`options ${type}`}>
        {options.map((option) => (
          <label
            className={`option ${value === option.value ? "selected" : ""}`}
            key={option.value}
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value)}
            />
            {option.swatch && (
              <span
                className="swatch"
                style={{ background: option.swatch }}
              ></span>
            )}
            <span className="option-copy">
              <strong>{option.label}</strong>
              {option.detail && <small>{option.detail}</small>}
            </span>
            <span className="option-price">
              {option.price ? `+$${option.price}` : "Included"}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
