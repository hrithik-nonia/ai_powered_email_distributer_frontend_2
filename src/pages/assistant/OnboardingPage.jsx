import React, { useState } from 'react';
import { accountsApi } from '../../api/accounts';
import { Spinner } from '../../components/common/Spinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Inbox, Sparkles, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export function OnboardingPage({ onAccountConnected }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleConnectDemo = async () => {
    setIsConnecting(true);
    setError(null);
    setLoadingStep(1);

    // Dynamic status text intervals to reassure user during long LLM calls
    const timer1 = setTimeout(() => setLoadingStep(2), 5000);
    const timer2 = setTimeout(() => setLoadingStep(3), 15000);
    const timer3 = setTimeout(() => setLoadingStep(4), 30000);

    try {
      const response = await accountsApi.connectDemo();
      onAccountConnected?.(response);
    } catch (err) {
      setError(err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsConnecting(false);
      setLoadingStep(0);
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 1:
        return 'Seeding executive mailbox with 25 email threads...';
      case 2:
        return 'Analyzing email intent and extracting dates with Grok AI...';
      case 3:
        return 'Classifying threads into Assistant & Client delegation pipelines...';
      case 4:
        return 'Finalizing AI summaries and preparing your executive dashboard...';
      default:
        return 'Connecting demo inbox...';
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50 mb-5">
          <Inbox className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Connect Your Mailbox
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Welcome to InboxAI! To begin managing executive email triage, connect the simulated executive demo inbox.
        </p>

        {/* Warning Callout Box */}
        <div className="mt-6 rounded-2xl bg-amber-50/80 p-4 border border-amber-200/60 text-left flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <span className="font-bold">Initial AI Classification Notice:</span>
            <p className="leading-relaxed">
              Connecting seeds 25 realistic executive threads and runs synchronous AI classification for each thread.
              This may take 30–60+ seconds. Please keep this tab open while classification completes.
            </p>
          </div>
        </div>

        {error && <ErrorAlert error={error} onClose={() => setError(null)} className="mt-5 text-left" />}

        {/* Connecting State or Connect Button */}
        <div className="mt-8">
          {isConnecting ? (
            <div className="rounded-2xl bg-indigo-50/70 p-6 border border-indigo-100 space-y-3">
              <Spinner size="lg" className="mx-auto text-indigo-600" />
              <div>
                <p className="text-xs font-semibold text-indigo-900">{getLoadingMessage()}</p>
                <p className="text-[11px] text-indigo-700/70 mt-1">
                  Executing 25 AI classifications via Grok. Please stand by...
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectDemo}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              <span>Connect Demo Inbox (25 Threads)</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
