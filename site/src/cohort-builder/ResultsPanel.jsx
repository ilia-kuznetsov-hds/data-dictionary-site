import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell,
} from 'recharts';

const ACCENT = '#2383e2';

const RESULTS_BY_OPTIONS = [
  'Sex',
  'Gestational Age',
  'Birthweight',
  'Ethnicity',
  'Indigenous Status',
];

const DIMENSIONS = {
  'Sex':              ['Male', 'Female', 'Unknown'],
  'Gestational Age':  ['<24wk', '24–27wk', '28–31wk', '32–36wk', '≥37wk'],
  'Birthweight':      ['<500g', '500–999g', '1000–1499g', '1500–2499g', '≥2500g'],
  'Ethnicity':        ['Aboriginal/TSI', 'Asian', 'Caucasian', 'Maori', 'Pacific Islander', 'Other', 'Unknown'],
  'Indigenous Status':['Aboriginal', 'Torres Strait Islander', 'Both', 'Non-Indigenous', 'Unknown'],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBarData(dimension, total) {
  const labels = DIMENSIONS[dimension];
  // Generate random proportions that sum to total
  const raws = labels.map(() => Math.random());
  const sum = raws.reduce((a, b) => a + b, 0);
  return labels.map((label, i) => ({
    label,
    count: Math.round((raws[i] / sum) * total),
  }));
}

function SkeletonBars({ count }) {
  return (
    <div className="cb-skeleton-chart">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cb-skeleton-bar-row">
          <div className="cb-skeleton-label" />
          <div className="cb-skeleton-bar" style={{ width: `${randomInt(30, 90)}%` }} />
        </div>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, count, pct } = payload[0].payload;
  return (
    <div className="cb-chart-tooltip">
      <span className="cb-chart-tooltip-label">{label}</span>
      <span className="cb-chart-tooltip-value">{count} ({pct}%)</span>
    </div>
  );
}

export default function ResultsPanel({ criteriaVersion }) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultsBy, setResultsBy] = useState(RESULTS_BY_OPTIONS[0]);
  const [showPercent, setShowPercent] = useState(false);
  const [barData, setBarData] = useState([]);

  const recalculate = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const newCount = randomInt(50, 5000);
      setCount(newCount);
      setBarData(generateBarData(resultsBy, newCount));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [resultsBy]);

  // Trigger when criteria change or dimension changes
  useEffect(() => {
    if (criteriaVersion === 0) return; // don't auto-trigger on initial mount
    return recalculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaVersion]);

  // Re-generate bar data (same total) when dimension changes
  useEffect(() => {
    if (count === null) return;
    setBarData(generateBarData(resultsBy, count));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsBy]);

  const total = barData.reduce((s, d) => s + d.count, 0) || 1;
  const chartData = barData.map((d) => ({
    ...d,
    pct: Math.round((d.count / total) * 100),
    display: showPercent ? Math.round((d.count / total) * 100) : d.count,
  }));

  const dimCount = DIMENSIONS[resultsBy]?.length ?? 5;

  return (
    <div className="cb-col cb-col--results">
      <h2 className="cb-col-header">Results</h2>
      <div className="cb-results-card">

        <div className="cb-results-card-header">
          <p className="cb-results-card-title">Total Count</p>
          <button
            className="cb-results-refresh-btn"
            type="button"
            aria-label="Refresh results"
            onClick={recalculate}
            title="Refresh"
          >
            ↻
          </button>
        </div>

        <div className="cb-results-count-wrap">
          {loading ? (
            <div className="cb-results-spinner" aria-label="Loading" />
          ) : (
            <div className="cb-results-count">
              {count === null ? '---' : count.toLocaleString()}
            </div>
          )}
          <div className="cb-results-count-label">matching participants</div>
        </div>

        <div className="cb-results-by-row">
          <label className="cb-results-by-label" htmlFor="results-by">
            Results by
          </label>
          <select
            id="results-by"
            className="cb-results-select"
            value={resultsBy}
            onChange={(e) => setResultsBy(e.target.value)}
          >
            {RESULTS_BY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button
            className={`cb-results-toggle ${showPercent ? 'active' : ''}`}
            type="button"
            onClick={() => setShowPercent((p) => !p)}
            title={showPercent ? 'Show counts' : 'Show percentages'}
          >
            {showPercent ? '%' : '#'}
          </button>
        </div>

        <div className="cb-chart-area">
          {loading ? (
            <SkeletonBars count={dimCount} />
          ) : count === null ? (
            <div className="cb-chart-placeholder" aria-label="Chart placeholder">
              <span className="cb-chart-placeholder-text">Add criteria to see results</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={dimCount * 34 + 16}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 40, bottom: 4, left: 4 }}
              >
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.65)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <XAxis type="number" hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(35,131,226,0.06)' }} />
                <Bar dataKey="display" radius={[0, 3, 3, 0]} maxBarSize={18}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={ACCENT} fillOpacity={0.85} />
                  ))}
                  <LabelList
                    dataKey="display"
                    position="right"
                    style={{ fontSize: 11, fill: 'rgba(0,0,0,0.55)', fontFamily: 'inherit' }}
                    formatter={(v) => showPercent ? `${v}%` : v.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
