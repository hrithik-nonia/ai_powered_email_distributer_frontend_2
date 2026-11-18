import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { aiApi } from '../../api/ai';
import { draftsApi } from '../../api/drafts';
import { Spinner } from '../common/Spinner';
import { ErrorAlert } from '../common/ErrorAlert';
import { Sparkles, Send, Check, AlertCircle } from 'lucide-react';

export function DraftGeneratorModal({ isOpen, onClose, thread, onDraftSaved }) {
  const [instruction, setInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form fields for draft saving
  const lastMessage = thread?.messages?.[thread.messages.length - 1];
  const defaultTo = lastMessage?.from_email ? [lastMessage.from_email] : [];
  const defaultSubject = thread?.subject?.startsWith('Re:')
    ? thread.subject
    : `Re: ${thread?.subject || ''}`;

  const [toRecipients, setToRecipients] = useState(defaultTo.join(', '));
  const [ccRecipients, setCcRecipients] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [draftBody, setDraftBody] = useState('');

  const handleGenerate = async () => {
    if (!thread?.id) return;
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await aiApi.generateDraft(thread.id, instruction);
      if (response?.data?.draft_body) {
        setDraftBody(response.data.draft_body);
        if (response.data.subject) {
          setSubject(response.data.subject);
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!thread?.id || !draftBody.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      const toArray = toRecipients
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);

      const ccArray = ccRecipients
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);

      const payload = {
        thread_id: thread.id,
        account_id: thread.account_id,
        to: toArray.length > 0 ? toArray : defaultTo,
        cc: ccArray,
        bcc: [],
        subject: subject.trim() || defaultSubject,
        body: draftBody.trim(),
        is_html: false,
      };

      const result = await draftsApi.createDraft(payload);
      setSuccessMessage('Draft saved successfully!');
      onDraftSaved?.(result.data);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1200);
    } catch (err) {
      setError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate AI Reply Draft"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
            <Check className="h-4 w-4 text-emerald-600" />
            {successMessage}
          </div>
        )}

        {/* AI Instruction prompt */}
        <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 space-y-2">
          <label className="block text-xs font-semibold text-indigo-950">
            AI Guidance / Tone Instructions (Optional):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder='e.g., "Politely decline and suggest next Tuesday 3pm", "Accept and ask for agenda"'
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isGenerating ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  <span>Drafting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-indigo-700/80">
            AI will review the thread messages and draft an executive response.
          </p>
        </div>

        {/* Draft Editor Fields */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                To (comma separated):
              </label>
              <input
                type="text"
                value={toRecipients}
                onChange={(e) => setToRecipients(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Cc (comma separated):
              </label>
              <input
                type="text"
                value={ccRecipients}
                onChange={(e) => setCcRecipients(e.target.value)}
                placeholder="optional"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Draft Body:
            </label>
            <textarea
              rows={8}
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              placeholder="Click 'Generate' above to generate an AI reply, or write directly here..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || !draftBody.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-40 transition"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>Saving Draft...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Save to Drafts</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
