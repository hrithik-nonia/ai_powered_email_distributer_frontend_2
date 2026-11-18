import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { draftsApi } from '../../api/drafts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from '../common/Spinner';
import { ErrorAlert } from '../common/ErrorAlert';
import { EmptyState } from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';
import {
  FileText,
  Trash2,
  Edit3,
  Plus,
  Send,
  X,
  Check,
  ChevronRight
} from 'lucide-react';

export function DraftsListModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editTo, setEditTo] = useState('');
  const [error, setError] = useState(null);

  // Fetch drafts
  const { data, isLoading } = useQuery({
    queryKey: ['drafts'],
    queryFn: () => draftsApi.getDrafts({ limit: 50 }),
    enabled: isOpen,
  });

  const drafts = data?.data?.drafts || [];

  // Delete draft mutation
  const deleteMutation = useMutation({
    mutationFn: (draftId) => draftsApi.deleteDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      if (selectedDraft) {
        setSelectedDraft(null);
        setIsEditing(false);
      }
    },
    onError: (err) => setError(err),
  });

  // Update draft mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => draftsApi.updateDraft(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      setSelectedDraft(updated.data);
      setIsEditing(false);
    },
    onError: (err) => setError(err),
  });

  const handleSelectDraft = (draft) => {
    setSelectedDraft(draft);
    setIsEditing(false);
    setEditSubject(draft.subject || '');
    setEditBody(draft.body || '');
    setEditTo(Array.isArray(draft.to) ? draft.to.join(', ') : draft.to || '');
  };

  const handleSaveEdit = () => {
    if (!selectedDraft) return;
    const toArray = editTo
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    updateMutation.mutate({
      id: selectedDraft.id,
      data: {
        subject: editSubject,
        body: editBody,
        to: toArray.length > 0 ? toArray : undefined,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Email Drafts"
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col md:flex-row h-[550px] -mx-6 -my-5 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Left Side: Drafts List */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-slate-50/50">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Drafts ({drafts.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Spinner size="md" />
                <span className="mt-2 text-xs">Loading drafts...</span>
              </div>
            ) : drafts.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No drafts yet"
                description="Drafts you generate or save from threads will appear here."
              />
            ) : (
              drafts.map((d) => (
                <div
                  key={d.id}
                  onClick={() => handleSelectDraft(d)}
                  className={`p-3 rounded-xl cursor-pointer transition border text-left ${
                    selectedDraft?.id === d.id
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                      : 'bg-white hover:bg-slate-100 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {d.subject || '(No Subject)'}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {formatDate(d.updated_at || d.created_at)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    To: {Array.isArray(d.to) ? d.to.join(', ') : d.to}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-normal">
                    {d.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Draft Details / Editor */}
        <div className="w-full md:w-1/2 flex flex-col h-full p-5 bg-white overflow-y-auto">
          {error && <ErrorAlert error={error} onClose={() => setError(null)} className="mb-4" />}

          {selectedDraft ? (
            <div className="flex flex-col h-full">
              {/* Header / Actions */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-xs text-slate-400">
                  Updated {formatDate(selectedDraft.updated_at)}
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(selectedDraft.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete draft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {updateMutation.isPending ? (
                          <Spinner size="sm" className="text-white" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>Save</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* View / Edit Mode */}
              <div className="flex-1 mt-4 space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        To (recipients):
                      </label>
                      <input
                        type="text"
                        value={editTo}
                        onChange={(e) => setEditTo(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Subject:
                      </label>
                      <input
                        type="text"
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Body:
                      </label>
                      <textarea
                        rows={10}
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none font-sans"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {selectedDraft.subject || '(No Subject)'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        To: {Array.isArray(selectedDraft.to) ? selectedDraft.to.join(', ') : selectedDraft.to}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl">
                      {selectedDraft.body}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-slate-400">
              <div>
                <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">Select a draft on the left to preview or edit it.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
