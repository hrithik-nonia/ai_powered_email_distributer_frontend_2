import React from 'react';
import { formatDateTime, getInitials } from '../../utils/formatters';
import { Mail } from 'lucide-react';

export function MessageView({ message, index, totalMessages }) {
  const isLatest = index === totalMessages - 1;

  return (
    <div
      className={`rounded-2xl border transition ${
        isLatest
          ? 'border-indigo-200 bg-white shadow-sm ring-1 ring-indigo-500/10'
          : 'border-slate-200 bg-white/70 hover:bg-white'
      } p-5`}
    >
      {/* Message Header */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold text-sm shadow-sm">
            {getInitials(message.from_name || message.from_email)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 truncate">
                {message.from_name || 'Sender'}
              </span>
              <span className="text-xs text-slate-400 font-mono truncate">
                &lt;{message.from_email}&gt;
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span>to:</span>
              <span className="font-mono text-slate-600">
                {Array.isArray(message.to) ? message.to.join(', ') : message.to}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <time className="text-xs font-medium text-slate-500">
            {formatDateTime(message.timestamp)}
          </time>
          {isLatest && (
            <div className="mt-0.5 text-[10px] uppercase tracking-wider font-semibold text-indigo-600">
              Latest Message
            </div>
          )}
        </div>
      </div>

      {/* Message Body */}
      <div className="mt-4 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal break-words selection:bg-indigo-100">
        {message.body}
      </div>
    </div>
  );
}
