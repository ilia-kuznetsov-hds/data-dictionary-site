export default function YesNoControl({ value, onChange }) {
  const options = ['Yes', 'No'];
  return (
    <div className="cb-control cb-control-radio-group">
      {options.map((opt) => (
        <label key={opt} className="cb-control-radio-label">
          <input
            type="radio"
            name={`yn-${Math.random()}`}
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
