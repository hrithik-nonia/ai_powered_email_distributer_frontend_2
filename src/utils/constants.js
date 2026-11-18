export const LABELS = {
  assistant_reply: {
    key: 'assistant_reply',
    label: 'Assistant Reply',
    description: 'PA can handle this email directly',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'emerald',
  },
  client_reply: {
    key: 'client_reply',
    label: 'Client Reply',
    description: 'Requires client attention & decision',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    badge: 'purple',
  },
  needs_review: {
    key: 'needs_review',
    label: 'Needs Review',
    description: 'Uncertain classification, manual check needed',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    badge: 'amber',
  },
  no_reply: {
    key: 'no_reply',
    label: 'No Reply',
    description: 'Informational or no response needed',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    badge: 'slate',
  },
};

export const SEGMENTS = [
  { key: 'action_required', label: 'Action Required' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'important', label: 'Important' },
  { key: 'general', label: 'General' },
];

export const STATUSES = {
  open: {
    key: 'open',
    label: 'Open',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  done: {
    key: 'done',
    label: 'Done',
    color: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  },
};
