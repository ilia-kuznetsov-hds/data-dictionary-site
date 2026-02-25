import { FIELD_MODIFIERS } from './domainData';

function formatModifierSummary(fieldId, modValues) {
  if (!modValues) return null;
  const specs = FIELD_MODIFIERS[fieldId];
  if (!specs) return null;

  const parts = specs
    .map((spec) => {
      const v = modValues[spec.id];
      if (!v) return null;
      const from = v.from ?? '';
      const to = v.to ?? '';
      if (!from && !to) return null;
      const label = spec.label.split(' ')[0]; // e.g. "Hours", "Date", "Number", "Lowest", "Year"
      if (from && to) return `${label}: ${from}–${to}`;
      if (from) return `${label}: ≥${from}`;
      return `${label}: ≤${to}`;
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : null;
}

export default function CriterionCart({ cart, modifierValues = {}, onRemove, onSave, onApplyModifiers }) {
  const items = Object.values(cart);
  const isEmpty = items.length === 0;
  const hasModifiableItems = items.some(({ field }) => Boolean(FIELD_MODIFIERS[field.id]));

  return (
    <aside className="cb-cart">
      <p className="cb-cart-title">Add selected criteria to cohort</p>

      <div className="cb-cart-list">
        {isEmpty ? (
          <p className="cb-cart-empty">No criteria selected.</p>
        ) : (
          items.map(({ field }) => {
            const summary = formatModifierSummary(field.id, modifierValues[field.id]);
            return (
              <div key={field.id} className="cb-cart-item">
                <div className="cb-cart-item-info">
                  <span>{field.label}</span>
                  {summary && (
                    <span className="cb-cart-item-modifier-summary">{summary}</span>
                  )}
                </div>
                <button
                  className="cb-cart-item-remove"
                  type="button"
                  aria-label={`Remove ${field.label}`}
                  onClick={() => onRemove(field.id)}
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="cb-cart-actions">
        <button
          className="cb-cart-modifiers-btn"
          type="button"
          disabled={!hasModifiableItems}
          onClick={onApplyModifiers}
        >
          Apply Modifiers
        </button>
        <button
          className="cb-cart-save-btn"
          type="button"
          disabled={isEmpty}
          onClick={onSave}
        >
          Save Criteria
        </button>
      </div>
    </aside>
  );
}
