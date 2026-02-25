import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function HomePage({ fields, sections }) {
  const fieldCount = Object.keys(fields).length;
  const sectionCount = sections.sections.length + sections.appendices.length;

  // Pick a few sample fields to show as quick links
  const sampleFields = useMemo(() => {
    const all = Object.values(fields);
    const picks = [];
    const step = Math.floor(all.length / 5);
    for (let i = 0; i < 5 && i * step < all.length; i++) {
      picks.push(all[i * step]);
    }
    return picks;
  }, [fields]);

  return (
    <div className="home-page">
      <h1>ANZNN 2026 Data Dictionary</h1>
      <p className="home-subtitle">
        Browse and search the Australian &amp; New Zealand Neonatal Network data dictionary.
      </p>

      <div className="home-stats">
        <div className="stat-card">
          <span className="stat-number">{fieldCount}</span>
          <span className="stat-label">Fields</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{sectionCount}</span>
          <span className="stat-label">Sections</span>
        </div>
      </div>

      <h2>Getting Started</h2>
      <p>
        Use the sidebar to browse fields by section, or type in the search box to find a
        specific field by name or definition.
      </p>

      <h2>Sample Fields</h2>
      <ul className="sample-list">
        {sampleFields.map((f) => (
          <li key={f.field_id}>
            <Link to={`/fields/${f.field_id}`}>{f.label}</Link>
            <span className="sample-section">{f.section}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
