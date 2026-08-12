import React from 'react';

const R = 80;
const CX = 100;
const CY = 100;
const ARC_LENGTH = Math.PI * R; // semicircle circumference

/**
 * Semicircle "instrument gauge" readout. Deliberately the same shape used
 * for both the customer's match score and the dealer's lead score — one
 * visual vocabulary for "this is a computed, explainable number," wherever
 * it shows up in the app.
 */
export function Gauge({ value, label, sublabel, color = 'var(--accent-primary)', size = 160 }) {
  const clamped = Math.max(0, Math.min(100, value));
  const offset = ARC_LENGTH * (1 - clamped / 100);

  return (
    <div className="gauge-wrap">
      <svg width={size} height={size * 0.62} viewBox="0 0 200 116">
        {/* track */}
        <path
          d={`M 20 ${CY} A ${R} ${R} 0 0 1 180 ${CY}`}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d={`M 20 ${CY} A ${R} ${R} 0 0 1 180 ${CY}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
        <text x={CX} y={CY - 6} textAnchor="middle" className="gauge-number">
          {clamped}
        </text>
        <text x={CX} y={CY - 6} textAnchor="middle" dy="1.3em" fontSize="11" fill="var(--text-muted)">
          / 100
        </text>
      </svg>
      {label && <div className="gauge-label">{label}</div>}
      {sublabel && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sublabel}</div>}
    </div>
  );
}
