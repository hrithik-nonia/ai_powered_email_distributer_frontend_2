import React from 'react';
import { LABELS, STATUSES } from '../../utils/constants';

export function LabelBadge({ label, size = 'sm', showDot = true }) {
  const config = LABELS[label] || {
    label: label || 'Unlabeled',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const config = STATUSES[status] || {
    label: status || 'Unknown',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${config.color}`}
    >
      {config.label}
    </span>
  );
}

export function SegmentBadge({ segment }) {
  const formatted = segment?.replace(/_/g, ' ');
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
      {formatted}
    </span>
  );
}
