import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import {
  Sparkles,
  LogOut,
  User,
  Copy,
  Check,
  FileText,
  Clock,
  Inbox,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export function Navbar({ onOpenChat, onOpenDrafts, onOpenActivity }) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch (e) {
      // Even if network fails, clear local state
    } finally {
      clearAuth();
      window.location.href = '/login';
    }
  };

  const isAssistant = user?.role === 'assistant';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">InboxAI</span>
              <span className="ml-2 hidden rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 sm:inline-block border border-indigo-100">
                {isAssistant ? 'Executive Assistant' : 'Executive Client'}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Action buttons for Assistant */}
        {isAssistant && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition border border-indigo-100 shadow-sm"
              title="Ask AI questions about your inbox"
            >
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Ask AI Chat</span>
            </button>

            <button
              onClick={onOpenDrafts}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              title="Manage reply drafts"
            >
              <FileText className="h-4 w-4 text-slate-500" />
              <span>Drafts</span>
            </button>

            <button
              onClick={onOpenActivity}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              title="View activity log"
            >
              <Clock className="h-4 w-4 text-slate-500" />
              <span>Activity</span>
            </button>
          </div>
        )}

        {/* User Profile / Menu */}
        <div className="flex items-center gap-3">
          {/* Assistant ID pill for sharing with clients */}
          {isAssistant && user?.id && (
            <button
              onClick={handleCopyId}
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="Click to copy your Assistant ID for your clients"
            >
              <span className="text-slate-400 font-mono">ID:</span>
              <span className="font-mono text-slate-700">{user.id.slice(0, 8)}...</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 ml-1" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-400 ml-1" />
              )}
            </button>
          )}

          {/* User profile dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-1.5 sm:px-3 sm:py-1.5 hover:bg-slate-50 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-slate-900 leading-tight">{user?.name}</div>
                <div className="text-[11px] text-slate-500 capitalize">{user?.role}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 z-50 p-2 divide-y divide-slate-100">
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span>Role:</span>
                      <span className="font-semibold text-slate-700 capitalize">{user?.role}</span>
                    </div>

                    {isAssistant && user?.id && (
                      <div className="mt-2 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100 text-[11px]">
                        <div className="text-indigo-900 font-medium flex items-center justify-between mb-1">
                          <span>Your Assistant ID:</span>
                          <button
                            onClick={handleCopyId}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-slate-600 break-all select-all">
                          {user.id}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Share this ID with your clients so they can connect during registration.
                        </p>
                      </div>
                    )}

                    {!isAssistant && user?.linked_assistant_id && (
                      <div className="mt-2 bg-purple-50/60 p-2 rounded-lg border border-purple-100 text-[11px]">
                        <span className="text-purple-900 font-medium">Linked Assistant ID:</span>
                        <p className="font-mono text-[10px] text-slate-600 break-all mt-0.5">
                          {user.linked_assistant_id}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mobile nav items for assistant */}
                  {isAssistant && (
                    <div className="py-1 md:hidden">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenChat?.();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                      >
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        <span>Ask AI Chat</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenDrafts?.();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                      >
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span>Drafts</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenActivity?.();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                      >
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>Activity</span>
                      </button>
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
