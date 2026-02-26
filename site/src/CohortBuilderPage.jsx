import { useState, useEffect } from 'react';
import GroupCard from './cohort-builder/GroupCard';
import ConceptBrowseScreen from './cohort-builder/ConceptBrowseScreen';
import ResultsPanel from './cohort-builder/ResultsPanel';
import SaveCohortModal from './cohort-builder/SaveCohortModal';
import CohortSuccessScreen from './cohort-builder/CohortSuccessScreen';

let _nextId = 2;
function nextId() { return _nextId++; }

function makeGroup(prefix) {
  return { id: `${prefix}-${nextId()}`, criteria: [], operator: 'OR' };
}

function AiBanner() {
  const [toastVisible, setToastVisible] = useState(false);

  function handleClick() {
    setToastVisible(true);
  }

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  return (
    <div className="cb-ai-banner" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="cb-ai-input-row">
        <div className="cb-ai-input" aria-disabled="true">
          Describe your cohort in plain language, e.g. Premature males under 28 weeks with NEC who survived...
        </div>
        <button className="cb-ai-build-btn" type="button" disabled tabIndex={-1}>
          Build with AI
        </button>
      </div>
      <p className="cb-ai-label">
        🚧 Coming soon — natural language cohort builder powered by AI. This will automatically populate inclusion and exclusion criteria from your description.
      </p>
      {toastVisible && (
        <div className="cb-toast" role="status">
          This feature is coming soon!
        </div>
      )}
    </div>
  );
}

// Clickable AND/OR connector rendered between group cards
function GroupConnector({ operator, onToggle }) {
  return (
    <div className="cb-group-connector">
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
    </div>
  );
}

function CriteriaColumn({
  title, columnClass, groups,
  onAddGroup, onRemoveGroup, onToggleGroupOperator,
  openPanelId, onOpenPanel, onClosePanel,
  onSelectDomain, onRemoveCriteria, onToggleOperator, onToggleSuppress,
}) {
  const totalActive = groups.reduce(
    (n, g) => n + g.criteria.filter((c) => !c.suppressed).length,
    0
  );

  return (
    <div className={`cb-col ${columnClass}`}>
      <h2 className="cb-col-header">
        {title}
        {totalActive > 0 && (
          <span className="cb-col-badge" aria-label={`${totalActive} active criteria`}>
            {totalActive}
          </span>
        )}
      </h2>
      <div className="cb-col-groups">
        {groups.map((group, idx) => (
          <div key={group.id}>
            {idx > 0 && (
              <GroupConnector
                operator={group.operator ?? 'OR'}
                onToggle={() => onToggleGroupOperator(group.id)}
              />
            )}
            <GroupCard
              title={`Group ${idx + 1}`}
              criteria={group.criteria}
              canRemove={groups.length > 1}
              isOpen={openPanelId === group.id}
              onRemove={() => onRemoveGroup(group.id)}
              onOpenPanel={() => onOpenPanel(group.id)}
              onClosePanel={onClosePanel}
              onSelectDomain={(domainKey) => onSelectDomain(group.id, domainKey)}
              onRemoveCriteria={(criterionId) => onRemoveCriteria(group.id, criterionId)}
              onToggleOperator={(criterionId) => onToggleOperator(group.id, criterionId)}
              onToggleSuppress={(criterionId) => onToggleSuppress(group.id, criterionId)}
            />
          </div>
        ))}
      </div>
      <button className="cb-add-group-btn" type="button" onClick={onAddGroup}
        aria-label="Add group">
        + Add Group
      </button>
    </div>
  );
}

const EMPTY_INCLUDE = [{ id: 'inc-0', criteria: [], operator: 'OR' }];
const EMPTY_EXCLUDE = [{ id: 'exc-0', criteria: [], operator: 'OR' }];

export default function CohortBuilderPage() {
  const [includeGroups, setIncludeGroups] = useState(EMPTY_INCLUDE);
  const [excludeGroups, setExcludeGroups] = useState(EMPTY_EXCLUDE);
  const [openPanelId, setOpenPanelId] = useState(null);
  const [browsing, setBrowsing] = useState(null);
  const [criteriaVersion, setCriteriaVersion] = useState(0);

  // Phase 8 — save flow
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedCohorts, setSavedCohorts] = useState([]);
  const [successCohort, setSuccessCohort] = useState(null);

  const hasInclusionCriteria = includeGroups.some((g) => g.criteria.length > 0);

  function bumpVersion() {
    setCriteriaVersion((v) => v + 1);
  }

  function addIncludeGroup() {
    setIncludeGroups((prev) => [...prev, makeGroup('inc')]);
  }

  function addExcludeGroup() {
    setExcludeGroups((prev) => [...prev, makeGroup('exc')]);
  }

  function handleRemoveGroup(groupId, column) {
    const empty = column === 'include'
      ? [{ id: `inc-${nextId()}`, criteria: [], operator: 'OR' }]
      : [{ id: `exc-${nextId()}`, criteria: [], operator: 'OR' }];

    const updater = (prev) => {
      const next = prev.filter((g) => g.id !== groupId);
      return next.length > 0 ? next : empty;
    };

    if (column === 'include') setIncludeGroups(updater);
    else setExcludeGroups(updater);
    bumpVersion();
  }

  function handleToggleGroupOperator(groupId, column) {
    const updater = (prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, operator: g.operator === 'AND' ? 'OR' : 'AND' }
          : g
      );

    if (column === 'include') setIncludeGroups(updater);
    else setExcludeGroups(updater);
  }

  function handleOpenPanel(groupId) {
    setOpenPanelId((prev) => (prev === groupId ? null : groupId));
  }

  function handleClosePanel() {
    setOpenPanelId(null);
  }

  function handleSelectDomain(groupId, domainKey, column) {
    setOpenPanelId(null);
    setBrowsing({ groupId, domainKey, column });
  }

  function handleBack() {
    setBrowsing(null);
  }

  function handleSaveCriteria(criteriaPayload) {
    if (!browsing) return;
    const { groupId, column } = browsing;

    const newCriterion = {
      id: `crit-${nextId()}`,
      operator: 'AND',
      suppressed: false,
      domainKey: criteriaPayload.domainKey,
      domainLabel: criteriaPayload.domainLabel,
      fields: criteriaPayload.fields,
    };

    const updater = (prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, criteria: [...g.criteria, newCriterion] } : g
      );

    if (column === 'include') setIncludeGroups(updater);
    else setExcludeGroups(updater);
    setBrowsing(null);
    bumpVersion();
  }

  function handleRemoveCriteria(groupId, criterionId, column) {
    const updater = (prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, criteria: g.criteria.filter((c) => c.id !== criterionId) }
          : g
      );

    if (column === 'include') setIncludeGroups(updater);
    else setExcludeGroups(updater);
    bumpVersion();
  }

  function handleToggleOperator(groupId, criterionId, column) {
    const updater = (prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              criteria: g.criteria.map((c) =>
                c.id === criterionId
                  ? { ...c, operator: c.operator === 'AND' ? 'OR' : 'AND' }
                  : c
              ),
            }
          : g
      );

    if (column === 'include') setIncludeGroups(updater);
    else setExcludeGroups(updater);
  }

  function handleToggleSuppress(groupId, criterionId, column) {
    const updater = (prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              criteria: g.criteria.map((c) =>
                c.id === criterionId ? { ...c, suppressed: !c.suppressed } : c
              ),
            }
          : g
      );

    if (column === 'include') setIncludeGroups(updater);
    else setExcludeGroups(updater);
    bumpVersion();
  }

  // Phase 8 — save handlers
  function handleSave(name, desc) {
    setSavedCohorts((prev) => [...prev, { id: `cohort-${nextId()}`, name, desc }]);
    setSuccessCohort(name);
    setShowSaveModal(false);
  }

  function handleCreateAnother() {
    setIncludeGroups([{ id: `inc-${nextId()}`, criteria: [], operator: 'OR' }]);
    setExcludeGroups([{ id: `exc-${nextId()}`, criteria: [], operator: 'OR' }]);
    setSuccessCohort(null);
    setBrowsing(null);
    setOpenPanelId(null);
    setCriteriaVersion(0);
  }

  // Success screen replaces everything
  if (successCohort) {
    return (
      <div className="cb-page">
        <CohortSuccessScreen
          cohortName={successCohort}
          savedCohorts={savedCohorts}
          onCreateAnother={handleCreateAnother}
        />
      </div>
    );
  }

  return (
    <div className="cb-page">
      <div className="cb-subheader">
        <h1 className="cb-subheader-title">Build Cohort Criteria</h1>
        <button
          className="cb-create-btn"
          type="button"
          disabled={!hasInclusionCriteria}
          title={hasInclusionCriteria ? undefined : 'Add at least one inclusion criterion to create a cohort.'}
          onClick={() => setShowSaveModal(true)}
        >
          Create Cohort
        </button>
      </div>

      <div className="cb-subtitle-row">
        <p className="home-subtitle cb-subtitle-text">
          This is an early prototype of a cohort builder aimed at making cohort definition simpler for researchers.
          The counts you see are placeholders and will be linked to real data once BI integration is in place.
        </p>
      </div>

      <AiBanner />

      {browsing ? (
        <ConceptBrowseScreen
          domainKey={browsing.domainKey}
          onBack={handleBack}
          onSave={handleSaveCriteria}
        />
      ) : (
        <div className="cb-layout">
          <CriteriaColumn
            title="Include Participants"
            columnClass="cb-col--include"
            groups={includeGroups}
            onAddGroup={addIncludeGroup}
            onRemoveGroup={(groupId) => handleRemoveGroup(groupId, 'include')}
            onToggleGroupOperator={(groupId) => handleToggleGroupOperator(groupId, 'include')}
            openPanelId={openPanelId}
            onOpenPanel={handleOpenPanel}
            onClosePanel={handleClosePanel}
            onSelectDomain={(groupId, domainKey) =>
              handleSelectDomain(groupId, domainKey, 'include')
            }
            onRemoveCriteria={(groupId, criterionId) =>
              handleRemoveCriteria(groupId, criterionId, 'include')
            }
            onToggleOperator={(groupId, criterionId) =>
              handleToggleOperator(groupId, criterionId, 'include')
            }
            onToggleSuppress={(groupId, criterionId) =>
              handleToggleSuppress(groupId, criterionId, 'include')
            }
          />
          <CriteriaColumn
            title="Exclude Participants"
            columnClass="cb-col--exclude"
            groups={excludeGroups}
            onAddGroup={addExcludeGroup}
            onRemoveGroup={(groupId) => handleRemoveGroup(groupId, 'exclude')}
            onToggleGroupOperator={(groupId) => handleToggleGroupOperator(groupId, 'exclude')}
            openPanelId={openPanelId}
            onOpenPanel={handleOpenPanel}
            onClosePanel={handleClosePanel}
            onSelectDomain={(groupId, domainKey) =>
              handleSelectDomain(groupId, domainKey, 'exclude')
            }
            onRemoveCriteria={(groupId, criterionId) =>
              handleRemoveCriteria(groupId, criterionId, 'exclude')
            }
            onToggleOperator={(groupId, criterionId) =>
              handleToggleOperator(groupId, criterionId, 'exclude')
            }
            onToggleSuppress={(groupId, criterionId) =>
              handleToggleSuppress(groupId, criterionId, 'exclude')
            }
          />
          <ResultsPanel criteriaVersion={criteriaVersion} />
        </div>
      )}

      {showSaveModal && (
        <SaveCohortModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
