import AddCriteriaPanel from './AddCriteriaPanel';
import CriteriaRow from './CriteriaRow';

function OperatorConnector({ operator, onToggle }) {
  return (
    <div className="cb-operator-connector">
      <div className="cb-operator-line" />
      <div className="cb-operator-toggle" title="Click to switch between AND / OR">
        <button
          className={`cb-operator-btn ${operator === 'AND' ? 'active' : ''}`}
          type="button"
          onClick={() => operator !== 'AND' && onToggle()}
        >
          AND
        </button>
        <button
          className={`cb-operator-btn cb-operator-btn--or ${operator === 'OR' ? 'active' : ''}`}
          type="button"
          onClick={() => operator !== 'OR' && onToggle()}
        >
          OR
        </button>
      </div>
      <div className="cb-operator-line" />
    </div>
  );
}

export default function GroupCard({ title, criteria = [], canRemove, isOpen, onRemove, onOpenPanel, onClosePanel, onSelectDomain, onRemoveCriteria, onToggleOperator, onToggleSuppress }) {
  return (
    <div className="cb-group-card">
      <div className="cb-group-card-header">
        <span className="cb-group-title">{title}</span>
        {canRemove && (
          <button
            className="cb-group-remove-btn"
            type="button"
            aria-label={`Remove ${title}`}
            onClick={onRemove}
          >
            ×
          </button>
        )}
      </div>

      <div className="cb-group-card-body">
        {criteria.length === 0 ? (
          <p className="cb-group-empty">No criteria added yet. Click 'Add Criteria' to begin.</p>
        ) : (
          <div className="cb-criteria-rows">
            {criteria.map((c, idx) => (
              <div key={c.id}>
                {idx > 0 && (
                  <OperatorConnector
                    operator={c.operator ?? 'AND'}
                    onToggle={() => onToggleOperator(c.id)}
                  />
                )}
                <CriteriaRow
                  criterion={c}
                  suppressed={c.suppressed}
                  onRemove={() => onRemoveCriteria(c.id)}
                  onToggleSuppress={() => onToggleSuppress?.(c.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cb-group-card-footer">
        <button
          className="cb-add-criteria-btn"
          type="button"
          aria-label="Add criteria"
          onClick={onOpenPanel}
        >
          + Add Criteria
        </button>
        <AddCriteriaPanel
          isOpen={isOpen}
          onClose={onClosePanel}
          onSelectDomain={onSelectDomain}
        />
      </div>
    </div>
  );
}
