import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReportPanel from './ReportPanel';

export default function FieldPage({ fields, reportLinks }) {
  const { fieldId } = useParams();
  const field = fields[fieldId];
  const linkedPage = reportLinks?.[fieldId] ?? null;
  const [panelPage, setPanelPage] = useState(null);

  useEffect(() => {
    setPanelPage(null);
  }, [fieldId]);

  if (!field) {
    return (
      <div className="field-page">
        <h1>Field not found</h1>
        <p>No field with ID <code>{fieldId}</code> exists.</p>
        <Link to="/">â† Back to home</Link>
      </div>
    );
  }

  return (
    <div className="field-page">
      {/* Title */}
      <div className="field-page-title-row">
        <h1>{field.label}</h1>
      </div>

      {/* Metadata summary table */}
      <table className="metadata-table">
        <tbody>
          {field.anznn_label && (
            <tr className="metadata-row">
              <td className="metadata-label">ANZNN Label</td>
              <td className="metadata-value">{field.anznn_label}</td>
            </tr>
          )}
          {field.metadata_type && field.metadata_type !== 'DATA ELEMENT' && (
            <tr className="metadata-row">
              <td className="metadata-label">Type</td>
              <td className="metadata-value">{field.metadata_type}</td>
            </tr>
          )}
          {field.data_type && (
            <tr className="metadata-row">
              <td className="metadata-label">Data Type</td>
              <td className="metadata-value">{field.data_type}</td>
            </tr>
          )}
          {field.format && (
            <tr className="metadata-row">
              <td className="metadata-label">Format</td>
              <td className="metadata-value">{field.format}</td>
            </tr>
          )}
          {field.field_size && (
            <tr className="metadata-row">
              <td className="metadata-label">Field Size</td>
              <td className="metadata-value">{field.field_size}</td>
            </tr>
          )}
          {field.admin_status && (
            <tr className="metadata-row">
              <td className="metadata-label">Admin Status</td>
              <td className="metadata-value">{field.admin_status}</td>
            </tr>
          )}
          {field.version_number && (
            <tr className="metadata-row">
              <td className="metadata-label">Version</td>
              <td className="metadata-value">{field.version_number}</td>
            </tr>
          )}
          <tr className="metadata-row">
            <td className="metadata-label">Section</td>
            <td className="metadata-value">{field.section}</td>
          </tr>
          <tr className="metadata-row">
            <td className="metadata-label">Source</td>
            <td className="metadata-value">Page {field.source_page}</td>
          </tr>
        </tbody>
      </table>

      {linkedPage !== null && (
        <section className="related-callout" aria-label="Related reference">
          <div className="related-callout-row">
            <button
              className="related-callout-link"
              onClick={() => setPanelPage(linkedPage)}
              title="View this data element in the 2023 report"
              type="button"
            >
              <span className="related-callout-icon" aria-hidden="true">&#128196;</span>
              <span>View this data element in the 2023 report &rarr;</span>
            </button>
          </div>
          <p className="related-callout-note">Opens the report in a side panel</p>
        </section>
      )}

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
                  <td className="domain-code">{entry.code && entry.code !== 'â€”' ? entry.code : '—'}</td>
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

      <ReportPanel page={panelPage} onClose={() => setPanelPage(null)} />
    </div>
  );
}

