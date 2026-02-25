import { useState } from 'react';

function ComingSoonToast({ onDone }) {
  useState(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  });
  return (
    <div className="cb-toast" role="status">
      This feature is coming soon!
    </div>
  );
}

function ActionCard({ title, description, buttonLabel, onClick, variant }) {
  return (
    <div className="cb-what-next-card">
      <h3 className="cb-what-next-card-title">{title}</h3>
      <p className="cb-what-next-card-desc">{description}</p>
      <button
        className={`cb-what-next-card-btn ${variant === 'primary' ? 'cb-what-next-card-btn--primary' : ''}`}
        type="button"
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function CohortSuccessScreen({ cohortName, savedCohorts, onCreateAnother }) {
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
  }

  return (
    <div className="cb-success-screen">
      <div className="cb-success-icon" aria-hidden="true">✓</div>
      <h1 className="cb-success-title">Cohort Saved Successfully</h1>
      <p className="cb-success-name">"{cohortName}"</p>

      <div className="cb-what-next">
        <h2 className="cb-what-next-heading">What Next?</h2>
        <div className="cb-what-next-grid">
          <ActionCard
            title="Create Another Cohort"
            description="Start fresh and define a new set of inclusion and exclusion criteria."
            buttonLabel="Create Another"
            variant="primary"
            onClick={onCreateAnother}
          />
          <ActionCard
            title="Create Review Sets"
            description="Organise your cohort into review sets for clinical audit purposes."
            buttonLabel="Create Review Sets"
            onClick={() => showToast('Coming soon')}
          />
          <ActionCard
            title="Create a Dataset"
            description="Export your cohort data as a structured dataset for analysis."
            buttonLabel="Create a Dataset"
            onClick={() => showToast('Coming soon')}
          />
        </div>
      </div>

      {savedCohorts.length > 0 && (
        <div className="cb-saved-cohorts">
          <h2 className="cb-saved-cohorts-heading">Saved Cohorts</h2>
          <ul className="cb-saved-cohorts-list">
            {savedCohorts.map((c) => (
              <li key={c.id} className="cb-saved-cohorts-item">
                <span className="cb-saved-cohorts-name">{c.name}</span>
                {c.desc && (
                  <span className="cb-saved-cohorts-desc">{c.desc}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {toast && (
        <ComingSoonToast onDone={() => setToast(null)} />
      )}
    </div>
  );
}
