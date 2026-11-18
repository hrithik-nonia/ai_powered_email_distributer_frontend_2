import React from 'react';
import {
  Inbox,
  Mail,
  UserCheck,
  Users,
  AlertCircle,
  Clock,
  Calendar,
  Star,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { LABELS } from '../../utils/constants';

export function StatsSidebar({ stats, activeFilters = {}, onSelectFilter }) {
  if (!stats) return null;

  const isLabelActive = (label) => activeFilters.label === label;
  const isSegmentActive = (segment) => activeFilters.segment === segment;
  const isAllActive =
    !activeFilters.label &&
    !activeFilters.segment &&
    !activeFilters.is_important &&
    !activeFilters.is_archived &&
    !activeFilters.search;

  return (
    <aside className="w-64 border-r border-slate-200 bg-white/70 backdrop-blur-sm p-4 flex flex-col gap-6 overflow-y-auto">
      {/* Overview & Quick Filters */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Overview
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectFilter({})}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isAllActive
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4" />
              <span>All Threads</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isAllActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {stats.total ?? 0}
            </span>
          </button>

          <button
            onClick={() => onSelectFilter({ is_important: true })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeFilters.is_important
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="h-4 w-4" />
              <span>Starred</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                activeFilters.is_important ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {stats.important ?? 0}
            </span>
          </button>
        </div>
      </div>

      {/* AI Classification Breakdown */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          AI Classification
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectFilter({ label: 'assistant_reply' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isLabelActive('assistant_reply')
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="h-4 w-4" />
              <span>Assistant Reply</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isLabelActive('assistant_reply')
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}
            >
              {stats.assistant_reply ?? 0}
            </span>
          </button>

          <button
            onClick={() => onSelectFilter({ label: 'client_reply' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isLabelActive('client_reply')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4" />
              <span>Client Reply</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isLabelActive('client_reply')
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-50 text-purple-700 border border-purple-100'
              }`}
            >
              {stats.client_reply ?? 0}
            </span>
          </button>

          <button
            onClick={() => onSelectFilter({ label: 'needs_review' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isLabelActive('needs_review')
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4" />
              <span>Needs Review</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isLabelActive('needs_review')
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}
            >
              {stats.needs_review ?? 0}
            </span>
          </button>

          <button
            onClick={() => onSelectFilter({ label: 'no_reply' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isLabelActive('no_reply')
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4" />
              <span>No Reply Needed</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isLabelActive('no_reply') ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {stats.no_reply ?? 0}
            </span>
          </button>
        </div>
      </div>

      {/* Segments Breakdown */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Segments
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectFilter({ segment: 'action_required' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isSegmentActive('action_required')
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4" />
              <span>Action Required</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isSegmentActive('action_required')
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {stats.action_required ?? 0}
            </span>
          </button>

          <button
            onClick={() => onSelectFilter({ segment: 'waiting' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isSegmentActive('waiting')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4" />
              <span>Waiting</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isSegmentActive('waiting')
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {stats.waiting ?? 0}
            </span>
          </button>

          <button
            onClick={() => onSelectFilter({ segment: 'meetings' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              isSegmentActive('meetings')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4" />
              <span>Meetings</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isSegmentActive('meetings')
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {stats.meetings ?? 0}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
