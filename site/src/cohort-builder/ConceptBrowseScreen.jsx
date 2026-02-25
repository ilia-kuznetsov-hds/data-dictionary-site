import { useState, useMemo } from 'react';
import { getDomainConfig } from './domainData';
import CriterionCart from './CriterionCart';
import ModifiersPanel from './ModifiersPanel';
import YesNoUnknownControl from './controls/YesNoUnknownControl';
import YesNoControl from './controls/YesNoControl';
import MultiSelectControl from './controls/MultiSelectControl';
import SingleSelectControl from './controls/SingleSelectControl';
import NumericRangeControl from './controls/NumericRangeControl';
import DateRangeControl from './controls/DateRangeControl';
import TextSearchControl from './controls/TextSearchControl';

function FieldControl({ field, value, onChange }) {
  const props = { value, onChange };
  switch (field.type) {
    case 'yes-no-unknown': return <YesNoUnknownControl {...props} />;
    case 'yes-no':         return <YesNoControl {...props} />;
    case 'multi-select':   return <MultiSelectControl {...props} options={field.options} />;
    case 'single-select':  return <SingleSelectControl {...props} options={field.options} />;
    case 'numeric-range':  return <NumericRangeControl {...props} min={field.min} max={field.max} />;
    case 'date-range':     return <DateRangeControl {...props} />;
    case 'text-search':    return <TextSearchControl {...props} />;
    default:               return null;
  }
}

export default function ConceptBrowseScreen({ domainKey, onBack, onSave }) {
  const domain = getDomainConfig(domainKey);
  const [search, setSearch] = useState('');
  // cart: { [fieldId]: { field, value } }
  const [cart, setCart] = useState({});
  const [showModifiers, setShowModifiers] = useState(false);
  // modifierValues: { [fieldId]: { [modifierId]: rangeValue } }
  const [modifierValues, setModifierValues] = useState({});

  const visibleFields = useMemo(() => {
    if (!domain) return [];
    const q = search.trim().toLowerCase();
    if (!q) return domain.fields;
    return domain.fields.filter((f) => f.label.toLowerCase().includes(q));
  }, [domain, search]);

  function toggleField(field) {
    setCart((prev) => {
      if (prev[field.id]) {
        const next = { ...prev };
        delete next[field.id];
        return next;
      }
      return { ...prev, [field.id]: { field, value: getDefaultValue(field) } };
    });
  }

  function updateFieldValue(fieldId, value) {
    setCart((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], value },
    }));
  }

  function removeFromCart(fieldId) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  function handleApplyModifiers(newMods) {
    setModifierValues(newMods);
    setShowModifiers(false);
  }

  function handleSave() {
    onSave({
      domainKey,
      domainLabel: domain.label,
      fields: Object.values(cart).map((item) => ({
        ...item,
        modifiers: modifierValues[item.field.id] ?? {},
      })),
    });
  }

  if (!domain) {
    return (
      <div className="cb-browse-screen">
        <div className="cb-browse-main">
          <button className="cb-browse-back" type="button" onClick={onBack}>
            ← Back
          </button>
          <h1 className="cb-browse-title">Domain not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="cb-browse-screen">
      <div className="cb-browse-main">
        <button className="cb-browse-back" type="button" onClick={onBack}>
          ← Back to Cohort Builder
        </button>
        <h1 className="cb-browse-title">{domain.label}</h1>
        <input
          className="cb-browse-search"
          type="search"
          placeholder={`Search ${domain.label} fields…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="cb-field-checklist">
          {visibleFields.map((field) => {
            const isChecked = Boolean(cart[field.id]);
            return (
              <li key={field.id} className="cb-field-item">
                <div
                  className="cb-field-item-header"
                  onClick={() => toggleField(field)}
                >
                  <input
                    className="cb-field-item-checkbox"
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleField(field)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="cb-field-item-label">{field.label}</span>
                </div>
                {isChecked && (
                  <div className="cb-field-item-control">
                    <FieldControl
                      field={field}
                      value={cart[field.id].value}
                      onChange={(val) => updateFieldValue(field.id, val)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {showModifiers ? (
        <ModifiersPanel
          cartItems={Object.values(cart)}
          modifierValues={modifierValues}
          onBack={() => setShowModifiers(false)}
          onApply={handleApplyModifiers}
        />
      ) : (
        <CriterionCart
          cart={cart}
          modifierValues={modifierValues}
          onRemove={removeFromCart}
          onSave={handleSave}
          onApplyModifiers={() => setShowModifiers(true)}
        />
      )}
    </div>
  );
}

function getDefaultValue(field) {
  switch (field.type) {
    case 'yes-no-unknown':
    case 'yes-no':
    case 'single-select':
    case 'text-search':
      return '';
    case 'multi-select':
      return [];
    case 'numeric-range':
    case 'date-range':
      return {};
    default:
      return '';
  }
}
