export default function MultiSelectControl({ value = [], options = [], onChange }) {
  function toggle(opt) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  }

  return (
    <div className="cb-control cb-control-checkbox-list">
      {options.map((opt) => (
        <label key={opt} className="cb-control-checkbox-label">
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
