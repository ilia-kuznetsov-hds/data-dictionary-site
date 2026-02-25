import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ fields, sections }) {
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();

  // Build a lookup: section label → array of fields
  const fieldsBySection = useMemo(() => {
    const map = {};
    for (const field of Object.values(fields)) {
      const sec = field.section;
      if (!map[sec]) map[sec] = [];
      map[sec].push(field);
    }
    return map;
  }, [fields]);

  // All sections (main + appendices) in order
  const allSections = useMemo(() => {
    return [...sections.sections, ...sections.appendices];
  }, [sections]);

  // Filtered fields when searching
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return Object.values(fields).filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        (f.definition && f.definition.toLowerCase().includes(q))
    );
  }, [search, fields]);

  function toggleSection(sectionId) {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-title">ANZNN Data Dictionary</Link>
        <input
          type="text"
          className="search-box"
          placeholder="Search fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <nav className="sidebar-nav">
        {searchResults ? (
          // Flat list of search results
          <ul className="field-list">
            {searchResults.length === 0 && (
              <li className="no-results">No fields found</li>
            )}
            {searchResults.map((f) => (
              <li key={f.field_id}>
                <Link
                  to={`/fields/${f.field_id}`}
                  className={`field-link ${location.pathname === `/fields/${f.field_id}` ? 'active' : ''}`}
                >
                  {f.label}
                  <span className="field-section-badge">{f.section}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          // Collapsible section list
          allSections.map((sec) => {
            const sectionFields = fieldsBySection[sec.label] || [];
            const isOpen = openSections[sec.id];

            return (
              <div key={sec.id} className="sidebar-section">
                <button
                  className="section-toggle"
                  onClick={() => toggleSection(sec.id)}
                >
                  {sec.label}
                  <span className={`toggle-arrow ${isOpen ? 'open' : ''}`}>›</span>
                </button>

                {isOpen && (
                  <ul className="field-list">
                    {sectionFields.map((f) => (
                      <li key={f.field_id}>
                        <Link
                          to={`/fields/${f.field_id}`}
                          className={`field-link ${location.pathname === `/fields/${f.field_id}` ? 'active' : ''}`}
                        >
                          {f.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
