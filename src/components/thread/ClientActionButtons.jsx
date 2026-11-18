import React from 'react';
import { CheckCircle, ArrowRightLeft } from 'lucide-react';
import { Spinner } from '../common/Spinner';

export function ClientActionButtons({ onAction, isPending = false }) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
      <div className="flex-1 min-w-[200px]">
        <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
          Client Decision Required
        </h4>
        <p className="text-[11px] text-purple-800/80 mt-0.5">
          Mark handled if resolved, or take over to reply directly.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onAction('handled')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-purple-200 px-3.5 py-2 text-xs font-semibold text-purple-700 shadow-sm hover:bg-purple-100 hover:text-purple-800 disabled:opacity-50 transition"
        >
          {isPending ? (
            <Spinner size="sm" className="text-purple-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          )}
          <span>Mark as Handled</span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onAction('take_over')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {isPending ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <ArrowRightLeft className="h-4 w-4" />
          )}
          <span>Take Over</span>
        </button>
      </div>
    </div>
  );
}
