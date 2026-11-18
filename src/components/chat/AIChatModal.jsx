import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { aiApi } from '../../api/ai';
import { Spinner } from '../common/Spinner';
import { ErrorAlert } from '../common/ErrorAlert';
import { Sparkles, Send, Bot, User, Trash2 } from 'lucide-react';

export function AIChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your InboxAI assistant. You can ask me any question about your inbox, upcoming meetings, pending requests, or specific emails.',
      threadsUsed: null,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiApi.aiChat(query);
      const answer = response?.data?.answer || 'No response received from AI.';
      const threadsUsed = response?.data?.threads_used;

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: answer,
        threadsUsed,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: 'Chat history cleared. How can I assist you with your inbox today?',
      },
    ]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inbox AI Executive Assistant"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col h-[520px]">
        {/* Subheader */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Answers synthesized from your latest inbox threads</span>
          </div>
          {messages.length > 1 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition"
              title="Clear conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {error && (
          <div className="my-2">
            <ErrorAlert error={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-semibold shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-indigo-600 text-white shadow-indigo-500/20'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                {msg.threadsUsed !== null && msg.threadsUsed !== undefined && (
                  <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5 flex items-center justify-between">
                    <span>Context: {msg.threadsUsed} threads analyzed</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 text-xs text-slate-500 flex items-center gap-2">
                <Spinner size="sm" />
                <span>Analyzing inbox threads and composing answer...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. 'What meetings are scheduled this week?', 'Are there urgent client emails?')"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </Modal>
  );
}
