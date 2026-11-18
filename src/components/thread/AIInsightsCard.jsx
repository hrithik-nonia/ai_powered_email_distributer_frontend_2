import React from 'react';
import { Sparkles, Calendar, HelpCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { LabelBadge } from '../common/Badge';
import { formatConfidence } from '../../utils/formatters';

export function AIInsightsCard({ thread, onReclassify, isReclassifying = false }) {
  if (!thread) return null;

  const hasConfidence = thread.ai_confidence !== null && thread.ai_confidence !== undefined;
  const confidencePercent = hasConfidence ? Math.round(thread.ai_confidence * 100) : null;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Classification & Insights</h3>
        </div>

        <div className="flex items-center gap-2">
          {thread.manual_override && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              Manual Override
            </span>
          )}

          {onReclassify && (
            <button
              onClick={onReclassify}
              disabled={isReclassifying}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 disabled:opacity-50 transition"
              title="Re-run AI classifier"
            >
              <RefreshCw className={`h-3 w-3 ${isReclassifying ? 'animate-spin' : ''}`} />
              <span>{isReclassifying ? 'Classifying...' : 'Re-classify'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid content */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Label & Confidence */}
        <div className="space-y-1.5 bg-white/80 p-3 rounded-xl border border-indigo-50">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Detected Intent
          </div>
          <div className="flex items-center gap-2">
            <LabelBadge label={thread.ai_label} size="sm" />
          </div>
          {confidencePercent !== null ? (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Confidence:</span>
              <span className="font-semibold text-slate-800">{confidencePercent}%</span>
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-400 italic">
              Confidence not computed
            </div>
          )}
        </div>

        {/* AI Summary */}
        <div className="md:col-span-2 space-y-1.5 bg-white/80 p-3 rounded-xl border border-indigo-50">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            AI Summary
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {thread.ai_summary || (
              <span className="italic text-slate-400">
                No summary available for this thread yet.
              </span>
            )}
          </p>

          {thread.ai_reason && (
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Rationale: </span>
              {thread.ai_reason}
            </div>
          )}
        </div>
      </div>

      {/* Extracted Dates (if present) */}
      {thread.ai_extracted_dates && thread.ai_extracted_dates.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-100/50">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            Extracted Dates/Times:
          </span>
          {thread.ai_extracted_dates.map((dateStr, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md bg-indigo-100/70 px-2 py-0.5 text-xs font-medium text-indigo-800"
            >
              {dateStr}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
