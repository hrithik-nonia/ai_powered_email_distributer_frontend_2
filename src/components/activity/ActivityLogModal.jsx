import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { activityApi } from '../../api/activity';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../common/Spinner';
import { EmptyState } from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { Clock, Activity, Tag, FileText, Mail, RefreshCw } from 'lucide-react';

export function ActivityLogModal({ isOpen, onClose }) {
  const [entityTypeFilter, setEntityTypeFilter] = useState('');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['activity', entityTypeFilter],
    queryFn: () =>
      activityApi.getActivity({
        entity_type: entityTypeFilter || undefined,
        limit: 50,
      }),
    enabled: isOpen,
  });

  const logs = data?.data?.logs || [];

  const getActionIcon = (type) => {
    switch (type) {
      case 'thread':
        return <Mail className="h-4 w-4 text-indigo-500" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Activity & Audit Log"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col h-[500px]">
        {/* Filter & Refresh Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter:</span>
            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Entities</option>
              <option value="thread">Threads</option>
              <option value="draft">Drafts</option>
              <option value="account">Accounts</option>
            </select>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
            title="Refresh log"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Spinner size="md" />
              <span className="mt-2 text-xs">Loading activity log...</span>
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No activity recorded"
              description="Actions performed across the inbox and drafts will be recorded here."
            />
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/70 transition"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 mt-0.5">
                  {getActionIcon(log.entity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {log.description}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Entity: <span className="font-mono text-slate-600">{log.entity_type}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
