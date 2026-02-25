import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { activateTileOnSpace, buildDirectorySections } from './fieldDirectoryUtils';

export default function SectionGalleryPage({ fields, sections }) {
  const { sectionId } = useParams();
  const sectionDirectory = useMemo(() => buildDirectorySections(fields, sections), [fields, sections]);
  const section = sectionDirectory.byId[sectionId];

  if (!section) {
    return (
      <div className="section-gallery-page">
        <h1>Section not found</h1>
        <p>
          No section with ID <code>{sectionId}</code> exists.
        </p>
        <Link to="/" className="directory-back-link">
          &larr; Back to all sections
        </Link>
      </div>
    );
  }

  return (
    <div className="section-gallery-page">
      <Link to="/" className="directory-back-link">
        &larr; Back to all sections
      </Link>

      <h1>{section.label}</h1>
      <p className="directory-section-meta">
        {section.fieldCount} {section.fieldCount === 1 ? 'field' : 'fields'}
      </p>

      <div className="directory-gallery-grid directory-gallery-grid--fields" role="list">
        {section.fields.map((field) => (
          <Link
            key={field.field_id}
            role="listitem"
            to={`/fields/${field.field_id}`}
            className="directory-tile directory-tile--field"
            onKeyDown={activateTileOnSpace}
          >
            <span className="directory-tile-title">{field.label}</span>
            {field.data_type && <span className="directory-tile-meta">{field.data_type}</span>}
            {field.anznn_label && (
              <span className="directory-field-shortcode" title={field.anznn_label}>
                {field.anznn_label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
