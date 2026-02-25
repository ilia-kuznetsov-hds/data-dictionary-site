import { useState, useEffect, useRef } from 'react';
import { PROGRAM_DATA_LIST, CLINICAL_DOMAIN_LIST } from './domainData';

export default function AddCriteriaPanel({ isOpen, onClose, onSelectDomain }) {
  const [search, setSearch] = useState('');
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, onClose]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = search.trim().toLowerCase();

  const filteredProgram = q
    ? PROGRAM_DATA_LIST.filter((d) => d.label.toLowerCase().includes(q))
    : PROGRAM_DATA_LIST;

  const filteredDomains = q
    ? CLINICAL_DOMAIN_LIST.filter((d) => d.label.toLowerCase().includes(q))
    : CLINICAL_DOMAIN_LIST;

  const hasResults = filteredProgram.length > 0 || filteredDomains.length > 0;

  return (
    <div className="cb-criteria-panel" ref={panelRef} role="dialog" aria-label="Add Criteria">
      <div className="cb-criteria-panel-search-wrap">
        <input
          ref={searchRef}
          className="cb-criteria-panel-search"
          type="search"
          placeholder="Search or browse all domains"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="cb-criteria-panel-list">
        {!hasResults && (
          <p className="cb-criteria-no-results">No results for "{search}"</p>
        )}

        {filteredProgram.length > 0 && (
          <>
            <div className="cb-criteria-section-header">Program Data</div>
            {filteredProgram.map((domain) => (
              <button
                key={domain.key}
                className="cb-criteria-item"
                type="button"
                onClick={() => { onSelectDomain(domain.key); onClose(); }}
              >
                <span>{domain.label}</span>
                <span className="cb-criteria-item-arrow">›</span>
              </button>
            ))}
          </>
        )}

        {filteredDomains.length > 0 && (
          <>
            <div className="cb-criteria-section-header">Domains</div>
            {filteredDomains.map((domain) => (
              <button
                key={domain.key}
                className="cb-criteria-item"
                type="button"
                onClick={() => { onSelectDomain(domain.key); onClose(); }}
              >
                <span>{domain.label}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
