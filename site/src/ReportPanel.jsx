export default function ReportPanel({ page, onClose }) {
  const isOpen = page !== null && page !== undefined;

  return (
    <>
      {isOpen && <div className="report-panel-backdrop" onClick={onClose} />}

      <aside className={`report-panel${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <div className="report-panel-header">
          <span>ANZNN 2023 Annual Report</span>
          <button
            className="report-panel-close"
            onClick={onClose}
            aria-label="Close report panel"
            type="button"
          >
            x
          </button>
        </div>

        {isOpen && (
          <iframe
            key={page}
            src={`${import.meta.env.BASE_URL}report.pdf#page=${page}`}
            title="2023 ANZNN Annual Report"
            className="report-panel-frame"
          />
        )}
      </aside>
    </>
  );
}
