import { useParams, Link } from 'react-router-dom';

export default function FieldPage({ fields }) {
  const { fieldId } = useParams();
  const field = fields[fieldId];

  if (!field) {
    return (
      <div className="field-page">
        <h1>Field not found</h1>
        <p>No field with ID <code>{fieldId}</code> exists.</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  function copyFieldId() {
    navigator.clipboard.writeText(field.field_id);
  }

  return (
    <div className="field-page">
      {/* Title */}
      <h1>{field.label}</h1>

      {/* Metadata summary table */}
      <table className="metadata-table">
        <tbody>
          {field.anznn_label && (
            <tr><td className="meta-key">ANZNN Label</td><td>{field.anznn_label}</td></tr>
          )}
          {field.metadata_type && (
            <tr><td className="meta-key">Type</td><td>{field.metadata_type}</td></tr>
          )}
          {field.data_type && (
            <tr><td className="meta-key">Data Type</td><td>{field.data_type}</td></tr>
          )}
          {field.format && (
            <tr><td className="meta-key">Format</td><td>{field.format}</td></tr>
          )}
          {field.field_size && (
            <tr><td className="meta-key">Field Size</td><td>{field.field_size}</td></tr>
          )}
          {field.admin_status && (
            <tr><td className="meta-key">Admin Status</td><td>{field.admin_status}</td></tr>
          )}
          {field.version_number && (
            <tr><td className="meta-key">Version</td><td>{field.version_number}</td></tr>
          )}
          <tr><td className="meta-key">Section</td><td>{field.section}</td></tr>
          <tr>
            <td className="meta-key">Source</td>
            <td>Page {field.source_page}</td>
          </tr>
          <tr>
            <td className="meta-key">Field ID</td>
            <td>
              <code>{field.field_id}</code>
              <button className="copy-btn" onClick={copyFieldId} title="Copy field ID">
                📋
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Definition */}
      {field.definition && (
        <section className="field-section">
          <h2>Definition</h2>
          <p>{field.definition}</p>
        </section>
      )}

      {/* Context */}
      {field.context && (
        <section className="field-section">
          <h2>Context</h2>
          <p>{field.context}</p>
        </section>
      )}

      {/* Data Domain */}
      {field.data_domain && field.data_domain.length > 0 && (
        <section className="field-section">
          <h2>Data Domain</h2>
          <table className="domain-table">
            <thead>
              <tr><th>Code</th><th>Meaning</th></tr>
            </thead>
            <tbody>
              {field.data_domain.map((entry, i) => (
                <tr key={i}>
                  <td className="domain-code">{entry.code ?? '—'}</td>
                  <td>{entry.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {field.data_domain_text && (
        <section className="field-section">
          <h2>Data Domain</h2>
          <p>{field.data_domain_text}</p>
        </section>
      )}

      {/* Guide for Use */}
      {field.guide_for_use && (
        <section className="field-section">
          <h2>Guide for Use</h2>
          <p>{field.guide_for_use}</p>
        </section>
      )}

      {/* Verification Rules */}
      {field.verification_rules && (
        <section className="field-section">
          <h2>Verification Rules</h2>
          <p>{field.verification_rules}</p>
        </section>
      )}

      {/* Related Metadata */}
      {field.related_metadata && (
        <section className="field-section">
          <h2>Related Metadata</h2>
          <p>{field.related_metadata}</p>
        </section>
      )}

      {/* Comments */}
      {field.comments && (
        <section className="field-section">
          <h2>Comments</h2>
          <p>{field.comments}</p>
        </section>
      )}
    </div>
  );
}
