export default function NumericRangeControl({ value = {}, min, max, onChange }) {
  return (
    <div className="cb-control cb-control-range">
      <span className="cb-control-range-label">From</span>
      <input
        className="cb-control-number"
        type="number"
        min={min}
        max={max}
        value={value.from ?? ''}
        placeholder={min !== undefined ? String(min) : ''}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
      />
      <span className="cb-control-range-label">to</span>
      <input
        className="cb-control-number"
        type="number"
        min={min}
        max={max}
        value={value.to ?? ''}
        placeholder={max !== undefined ? String(max) : ''}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
      />
    </div>
  );
}
