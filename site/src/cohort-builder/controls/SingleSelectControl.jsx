export default function SingleSelectControl({ value = '', options = [], onChange }) {
  return (
    <div className="cb-control">
      <select
        className="cb-control-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
