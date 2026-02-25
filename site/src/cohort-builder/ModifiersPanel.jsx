import { useState } from 'react';
import { FIELD_MODIFIERS } from './domainData';
import NumericRangeControl from './controls/NumericRangeControl';
import DateRangeControl from './controls/DateRangeControl';

function ModifierControl({ spec, value, onChange }) {
  if (spec.type === 'numeric-range') {
    return <NumericRangeControl value={value} onChange={onChange} />;
  }
  if (spec.type === 'date-range') {
    return <DateRangeControl value={value} onChange={onChange} />;
  }
  return null;
}

export default function ModifiersPanel({ cartItems, modifierValues, onBack, onApply }) {
  // Only show cart items that have modifier configs
  const eligibleItems = cartItems.filter(({ field }) => FIELD_MODIFIERS[field.id]);

  // Local editing state, seeded from current modifier values
  const [localMods, setLocalMods] = useState(() => {
    const init = {};
    for (const { field } of eligibleItems) {
      init[field.id] = modifierValues[field.id] ?? {};
    }
    return init;
  });

  function updateMod(fieldId, modId, value) {
    setLocalMods((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], [modId]: value },
    }));
  }

  function handleApply() {
    onApply(localMods);
  }

  return (
    <aside className="cb-modifiers-panel">
      <div className="cb-modifiers-header">
        <button
          className="cb-modifiers-back-btn"
          type="button"
          aria-label="Back to cart"
          onClick={onBack}
        >
          ← Back
        </button>
        <h3 className="cb-modifiers-title">Apply optional Modifiers</h3>
      </div>

      <div className="cb-modifiers-body">
        {eligibleItems.length === 0 ? (
          <p className="cb-modifiers-empty">No selected criteria support modifiers.</p>
        ) : (
          eligibleItems.map(({ field }) => {
            const specs = FIELD_MODIFIERS[field.id];
            return (
              <div key={field.id} className="cb-modifiers-field-section">
                <p className="cb-modifiers-field-label">{field.label}</p>
                {specs.map((spec) => (
                  <div key={spec.id} className="cb-modifiers-control-row">
                    <span className="cb-modifiers-control-label">{spec.label}</span>
                    <ModifierControl
                      spec={spec}
                      value={localMods[field.id]?.[spec.id] ?? {}}
                      onChange={(val) => updateMod(field.id, spec.id, val)}
                    />
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      <div className="cb-modifiers-footer">
        <button className="cb-modifiers-cancel-btn" type="button" onClick={onBack}>
          Back
        </button>
        <button className="cb-modifiers-apply-btn" type="button" onClick={handleApply}>
          Apply Modifiers
        </button>
      </div>
    </aside>
  );
}
