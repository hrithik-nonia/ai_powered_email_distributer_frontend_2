import React from 'react';
import { ThreadListItem } from './ThreadListItem';
import { EmptyState } from '../common/EmptyState';
import { Spinner } from '../common/Spinner';
import { Search, Filter, X, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { LABELS, SEGMENTS } from '../../utils/constants';

export function ThreadList({
  threads = [],
  total = 0,
  skip = 0,
  limit = 20,
  filters = {},
  onFilterChange,
  selectedThreadId,
  onSelectThread,
  onToggleImportant,
  onToggleArchive,
  isLoading = false,
}) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value, skip: 0 });
  };

  const handleClearSearch = () => {
    onFilterChange({ ...filters, search: '', skip: 0 });
  };

  const handleLabelChange = (e) => {
    const val = e.target.value;
    onFilterChange({ ...filters, label: val || undefined, skip: 0 });
  };

  const handleSegmentChange = (e) => {
    const val = e.target.value;
    onFilterChange({ ...filters, segment: val || undefined, skip: 0 });
  };

  const handleToggleImportantFilter = () => {
    onFilterChange({
      ...filters,
      is_important: filters.is_important ? undefined : true,
      skip: 0,
    });
  };

  const handleToggleArchivedFilter = () => {
    onFilterChange({
      ...filters,
      is_archived: filters.is_archived ? undefined : true,
      skip: 0,
    });
  };

  const handlePrevPage = () => {
    if (skip >= limit) {
      onFilterChange({ ...filters, skip: skip - limit });
    }
  };

  const handleNextPage = () => {
    if (skip + limit < total) {
      onFilterChange({ ...filters, skip: skip + limit });
    }
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Search Header */}
      <div className="border-b border-slate-200 p-3.5 space-y-2.5 bg-slate-50/60">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search threads by subject..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {filters.search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Label selector */}
          <select
            value={filters.label || ''}
            onChange={handleLabelChange}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Labels</option>
            {Object.values(LABELS).map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Segment selector */}
          <select
            value={filters.segment || ''}
            onChange={handleSegmentChange}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Segments</option>
            {SEGMENTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Important toggle button */}
          <button
            type="button"
            onClick={handleToggleImportantFilter}
            className={`rounded-lg border px-2 py-1 text-xs font-medium transition ${
              filters.is_important
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Starred
          </button>

          {/* Archived toggle button */}
          <button
            type="button"
            onClick={handleToggleArchivedFilter}
            className={`rounded-lg border px-2 py-1 text-xs font-medium transition ${
              filters.is_archived
                ? 'bg-slate-200 text-slate-800 border-slate-400'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Thread list content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Spinner size="lg" />
            <p className="mt-3 text-xs font-medium text-slate-500">Loading threads...</p>
          </div>
        ) : threads.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No threads found"
            description="No email threads match your current filter criteria."
          />
        ) : (
          <div>
            {threads.map((thread) => (
              <ThreadListItem
                key={thread.id}
                thread={thread}
                isSelected={selectedThreadId === thread.id}
                onSelect={onSelectThread}
                onToggleImportant={onToggleImportant}
                onToggleArchive={onToggleArchive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
        <div>
          Total: <span className="font-semibold text-slate-800">{total}</span> threads
        </div>
        <div className="flex items-center gap-2">
          <span>
            Page <span className="font-medium text-slate-800">{currentPage}</span> of{' '}
            <span className="font-medium text-slate-800">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={skip <= 0}
              className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={skip + limit >= total}
              className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
