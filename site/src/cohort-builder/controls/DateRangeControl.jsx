export default function DateRangeControl({ value = {}, onChange }) {
  return (
    <div className="cb-control cb-control-range">
      <span className="cb-control-range-label">From</span>
      <input
        className="cb-control-date"
        type="date"
        value={value.from ?? ''}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
      />
      <span className="cb-control-range-label">to</span>
      <input
        className="cb-control-date"
        type="date"
        value={value.to ?? ''}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
      />
    </div>
  );
}
