import { useSearchParams } from 'react-router-dom';

function parsePage(value) {
  const parsed = Number.parseInt(value ?? '', 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get('page'));

  function setPage(nextPage) {
    const normalized = Math.max(1, Math.trunc(nextPage));
    if (normalized === page) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(normalized));
    setSearchParams(nextParams, { replace: true });
  }

  function onPageInputChange(event) {
    const value = event.target.value;
    if (!value) {
      return;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    setPage(parsed);
  }

  return (
    <div className="reports-page">
      <h1>ANZNN 2023 Annual Report</h1>

      <div className="reports-controls" role="group" aria-label="Report page navigation">
        <button
          className="reports-nav-btn"
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        <label className="reports-page-input-label">
          Page
          <input
            className="reports-page-input"
            type="number"
            min="1"
            step="1"
            value={page}
            onChange={onPageInputChange}
          />
        </label>

        <button
          className="reports-nav-btn"
          type="button"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

        <a
          className="reports-open-link"
          href={`${import.meta.env.BASE_URL}report.pdf#page=${page}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in new tab
        </a>
      </div>

      <iframe
        src={`${import.meta.env.BASE_URL}report.pdf#page=${page}`}
        title="ANZNN 2023 Annual Report"
        className="reports-frame"
      />
    </div>
  );
}
