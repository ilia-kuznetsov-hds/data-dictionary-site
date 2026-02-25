import { useState } from 'react';

const MAX_VISIBLE = 5;

function formatValue(field, value) {
  if (value === undefined || value === null || value === '') return null;

  switch (field.type) {
    case 'yes-no-unknown':
    case 'yes-no':
    case 'single-select':
      return value || null;

    case 'multi-select':
      return Array.isArray(value) && value.length > 0 ? value.join(', ') : null;

    case 'numeric-range': {
      const from = value.from ?? '';
      const to = value.to ?? '';
      if (!from && !to) return null;
      if (from && to) return `${from} – ${to}`;
      if (from) return `≥ ${from}`;
      return `≤ ${to}`;
    }

    case 'date-range': {
      const from = value.from ?? '';
      const to = value.to ?? '';
      if (!from && !to) return null;
      if (from && to) return `${from} → ${to}`;
      if (from) return `from ${from}`;
      return `until ${to}`;
    }

    case 'text-search':
      return value || null;

    default:
      return null;
  }
}

export default function CriteriaRow({ criterion, suppressed, onRemove, onToggleSuppress }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = criterion.fields.slice(0, MAX_VISIBLE);
  const overflow = criterion.fields.length - MAX_VISIBLE;

  function handleMenuToggle(e) {
    e.stopPropagation();
    setMenuOpen((o) => !o);
  }

  function handleSuppress(e) {
    e.stopPropagation();
    setMenuOpen(false);
    onToggleSuppress?.();
  }

  return (
    <div className={`cb-criteria-row${suppressed ? ' cb-criteria-row--suppressed' : ''}`}>
      <div className="cb-criteria-row-content">
        <span className="cb-criteria-row-domain">{criterion.domainLabel}</span>
        <div className="cb-criteria-row-fields">
          {visible.map(({ field, value }) => {
            const formatted = formatValue(field, value);
            return (
              <div key={field.id} className="cb-criteria-field-line">
                <span className="cb-criteria-field-name">{field.label}</span>
                {formatted && (
                  <span className="cb-criteria-field-value">{formatted}</span>
                )}
              </div>
            );
          })}
          {overflow > 0 && (
            <div className="cb-criteria-overflow">+{overflow} more</div>
          )}
        </div>
      </div>

      <div className="cb-criteria-row-actions">
        <div className="cb-criteria-row-menu-wrap">
          <button
            className="cb-criteria-row-menu-btn"
            type="button"
            aria-label="More options"
            aria-expanded={menuOpen}
            onClick={handleMenuToggle}
          >
            ⋮
          </button>
          {menuOpen && (
            <>
              <div
                className="cb-criteria-row-menu-backdrop"
                onClick={() => setMenuOpen(false)}
              />
              <div className="cb-criteria-row-menu">
                <button
                  className="cb-criteria-row-menu-item"
                  type="button"
                  onClick={handleSuppress}
                >
                  {suppressed ? 'Unsuppress from count' : 'Suppress from total count'}
                </button>
              </div>
            </>
          )}
        </div>

        <button
          className="cb-criteria-row-remove"
          type="button"
          aria-label="Remove criterion"
          onClick={onRemove}
        >
          ×
        </button>
      </div>
    </div>
  );
}
