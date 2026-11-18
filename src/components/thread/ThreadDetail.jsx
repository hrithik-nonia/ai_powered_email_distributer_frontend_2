import React, { useState } from 'react';
import { MessageView } from './MessageView';
import { AIInsightsCard } from './AIInsightsCard';
import { LabelDropdown } from './LabelDropdown';
import { DraftGeneratorModal } from './DraftGeneratorModal';
import { ClientActionButtons } from './ClientActionButtons';
import { StatusBadge, SegmentBadge } from '../common/Badge';
import { Spinner } from '../common/Spinner';
import { EmptyState } from '../common/EmptyState';
import {
  Star,
  Archive,
  Mail,
  MailOpen,
  CheckCircle2,
  Sparkles,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export function ThreadDetail({
  thread,
  isLoading = false,
  role = 'assistant',
  onUpdateLabel,
  onToggleImportant,
  onToggleArchive,
  onUpdateRead,
  onUpdateStatus,
  onReclassify,
  isReclassifying = false,
  onClientAction,
  isClientActionPending = false,
  onDraftSaved,
}) {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12 text-slate-400">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-xs font-medium text-slate-500">Loading thread conversation...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <EmptyState
          icon={Mail}
          title="No thread selected"
          description="Select an email thread from the list to view its full conversation and AI analysis."
        />
      </div>
    );
  }

  const isAssistant = role === 'assistant';
  const isDone = thread.status === 'done';

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50/50">
      {/* Top Header / Action Toolbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status & Quick Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={thread.status} />
            {thread.segment?.map((seg) => (
              <SegmentBadge key={seg} segment={seg} />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isAssistant && (
              <>
                {/* Change Label Dropdown */}
                <LabelDropdown
                  currentLabel={thread.ai_label}
                  onChange={(newLabel) => onUpdateLabel?.(thread.id, newLabel)}
                />

                {/* Status Toggle (open / done) */}
                <button
                  type="button"
                  onClick={() => onUpdateStatus?.(thread.id, isDone ? 'open' : 'done')}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                    isDone
                      ? 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={isDone ? 'Mark as Open' : 'Mark as Done'}
                >
                  <CheckCircle2 className={`h-3.5 w-3.5 ${isDone ? 'text-zinc-600' : 'text-slate-400'}`} />
                  <span>{isDone ? 'Reopen' : 'Mark Done'}</span>
                </button>

                {/* Mark Read/Unread */}
                <button
                  type="button"
                  onClick={() => onUpdateRead?.(thread.id, !thread.is_read)}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition"
                  title={thread.is_read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  {thread.is_read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4 text-indigo-600" />
                  )}
                </button>

                {/* Toggle Archive */}
                <button
                  type="button"
                  onClick={() => onToggleArchive?.(thread.id)}
                  className={`rounded-lg border p-1.5 transition ${
                    thread.is_archived
                      ? 'bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={thread.is_archived ? 'Unarchive thread' : 'Archive thread'}
                >
                  <Archive className="h-4 w-4" />
                </button>

                {/* Toggle Important (Star) */}
                <button
                  type="button"
                  onClick={() => onToggleImportant?.(thread.id)}
                  className={`rounded-lg border p-1.5 transition ${
                    thread.is_important
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={thread.is_important ? 'Starred' : 'Star thread'}
                >
                  <Star className={`h-4 w-4 ${thread.is_important ? 'fill-amber-400' : ''}`} />
                </button>

                {/* Generate AI Draft Reply button */}
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Draft Reply</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thread Subject & Participants */}
        <div className="mt-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {thread.subject || '(No Subject)'}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {thread.participants?.map((p) => p.name || p.email).join(', ') || 'No participants'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDateTime(thread.last_message_at || thread.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Client Role Decision Banner */}
        {!isAssistant && (
          <ClientActionButtons
            onAction={(action) => onClientAction?.(thread.id, action)}
            isPending={isClientActionPending}
          />
        )}

        {/* AI Insights & Classification Card */}
        <AIInsightsCard
          thread={thread}
          onReclassify={isAssistant ? () => onReclassify?.(thread.id) : null}
          isReclassifying={isReclassifying}
        />

        {/* Messages Feed */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Conversation ({thread.messages?.length || 0} messages)
            </h2>
          </div>

          <div className="space-y-4">
            {thread.messages?.map((msg, index) => (
              <MessageView
                key={msg.message_id || index}
                message={msg}
                index={index}
                totalMessages={thread.messages.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Draft Generator Modal (for assistant) */}
      {isAssistant && (
        <DraftGeneratorModal
          isOpen={isDraftModalOpen}
          onClose={() => setIsDraftModalOpen(false)}
          thread={thread}
          onDraftSaved={onDraftSaved}
        />
      )}
    </div>
  );
}
