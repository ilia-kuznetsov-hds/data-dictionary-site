import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import anznnLogo from './assets/anznn-logo-nano-banana.png';

export default function HomePage({ fields }) {
  const directoryRows = useMemo(() => {
    return Object.values(fields)
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 14);
  }, [fields]);

  return (
    <div className="home-page">
      <div className="home-hero">
        <img src={anznnLogo} alt="" className="home-logo" />
        <div>
          <h1>ANZNN 2026 Data Dictionary</h1>
          <p className="home-subtitle">
            Browse and search the Australian &amp; New Zealand Neonatal Network data dictionary.
          </p>
        </div>
      </div>

      <h2>Getting Started</h2>
      <p>
        Use the sidebar to browse fields by section, or type in the search box to find a
        specific field by name or definition.
      </p>

      <h2>Field Directory</h2>
      <div className="home-table-wrap">
        <table className="home-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Section</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {directoryRows.map((field) => (
              <tr key={field.field_id}>
                <td>
                  <Link to={`/fields/${field.field_id}`} className="home-table-link">
                    {field.label}
                  </Link>
                </td>
                <td>{field.section}</td>
                <td>{field.data_type ?? 'Not specified'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="home-table-note">Showing the first 14 fields in alphabetical order.</p>
    </div>
  );
}
