import React from 'react';
import { Star, Archive, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { LabelBadge, StatusBadge } from '../common/Badge';

export function ThreadListItem({
  thread,
  isSelected,
  onSelect,
  onToggleImportant,
  onToggleArchive,
}) {
  const lastMessage = thread.messages?.[thread.messages.length - 1];
  const senderName = lastMessage?.from_name || thread.participants?.[0]?.name || 'Unknown';
  const snippet = lastMessage?.body?.slice(0, 100) || '';

  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={`group relative flex cursor-pointer items-start gap-3 border-b border-slate-100 p-4 transition ${
        isSelected
          ? 'bg-indigo-50/70 border-indigo-200'
          : !thread.is_read
          ? 'bg-white hover:bg-slate-50 font-semibold'
          : 'bg-slate-50/40 hover:bg-slate-50'
      }`}
    >
      {/* Unread indicator dot */}
      <div className="pt-1.5">
        <span
          className={`block h-2 w-2 rounded-full ${
            !thread.is_read ? 'bg-indigo-600' : 'bg-transparent'
          }`}
          title={!thread.is_read ? 'Unread message' : 'Read'}
        />
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Top line: Sender + Timestamp */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm ${
              !thread.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'
            }`}
          >
            {senderName}
          </span>
          <span className="text-[11px] text-slate-400 whitespace-nowrap">
            {formatDate(thread.last_message_at || thread.created_at)}
          </span>
        </div>

        {/* Second line: Subject */}
        <h4
          className={`truncate text-xs mt-0.5 ${
            !thread.is_read ? 'font-semibold text-slate-900' : 'text-slate-700'
          }`}
        >
          {thread.subject || '(No Subject)'}
        </h4>

        {/* Third line: Snippet */}
        <p className="mt-1 line-clamp-1 text-xs text-slate-500 font-normal">
          {snippet}
        </p>

        {/* Badges line: AI Label, Status, Segments */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <LabelBadge label={thread.ai_label} size="xs" />
          {thread.status === 'done' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
              <CheckCircle2 className="h-3 w-3 text-zinc-400" />
              Done
            </span>
          )}
          {thread.is_archived && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              <Archive className="h-2.5 w-2.5" />
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Actions: Star toggle */}
      <div className="flex flex-col items-center gap-1 pt-1 opacity-70 group-hover:opacity-100 transition">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleImportant?.(thread.id);
          }}
          className={`p-1 rounded hover:bg-slate-200/60 transition ${
            thread.is_important ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
          }`}
          title={thread.is_important ? 'Marked important' : 'Mark as important'}
        >
          <Star className={`h-4 w-4 ${thread.is_important ? 'fill-amber-400' : ''}`} />
        </button>
      </div>
    </div>
  );
}
