export default function TextSearchControl({ value = '', onChange }) {
  return (
    <div className="cb-control">
      <input
        className="cb-control-text"
        type="text"
        value={value}
        placeholder="Type to search…"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
