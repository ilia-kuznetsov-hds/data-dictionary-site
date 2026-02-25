export default function YesNoUnknownControl({ value, onChange }) {
  const options = ['Yes', 'No', 'Unknown'];
  return (
    <div className="cb-control cb-control-radio-group">
      {options.map((opt) => (
        <label key={opt} className="cb-control-radio-label">
          <input
            type="radio"
            name={`ynu-${Math.random()}`}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
