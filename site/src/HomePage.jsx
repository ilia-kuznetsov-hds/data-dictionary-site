import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import anznnLogo from './assets/anznn-logo-nano-banana.png';
import { activateTileOnSpace, buildDirectorySections } from './fieldDirectoryUtils';

export default function HomePage({ fields, sections }) {
  const sectionDirectory = useMemo(() => buildDirectorySections(fields, sections), [fields, sections]);

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>ANZNN 2026 Data Dictionary</h1>
        <p className="home-subtitle">
          Browse and search the Australian &amp; New Zealand Neonatal Network data dictionary.
        </p>
        <img src={anznnLogo} alt="ANZNN logo" className="home-logo" />
      </div>

      <h2>Getting Started</h2>
      <p>
        Use the section gallery below or the left sidebar to browse fields by section. The sidebar
        search is still available for quick lookup by field name or definition.
      </p>

      <h2>Section Gallery</h2>
      <div className="directory-gallery-grid" role="list">
        {sectionDirectory.sections.map((section) => (
          <Link
            key={section.id}
            role="listitem"
            to={`/sections/${section.id}`}
            className="directory-tile directory-tile--section"
            onKeyDown={activateTileOnSpace}
          >
            <span className="directory-tile-title">{section.label}</span>
            <span className="directory-tile-meta">
              {section.fieldCount} {section.fieldCount === 1 ? 'field' : 'fields'}
            </span>
            <span className="directory-tile-subtitle">Browse fields</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
