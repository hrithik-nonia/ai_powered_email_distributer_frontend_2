import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Spinner } from '../../components/common/Spinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Inbox, Lock, Mail, User, Link as LinkIcon, UserCheck, ShieldCheck } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('assistant');
  const [linkedAssistantId, setLinkedAssistantId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (role === 'client' && !linkedAssistantId.trim()) {
      setError('Clients must provide their linked Assistant ID.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        name,
        email,
        password,
        role,
        linked_assistant_id: role === 'client' ? linkedAssistantId : null,
      });

      // Pass email & expires_in to OTP verification page
      navigate('/verify-otp', {
        state: {
          email: email.trim(),
          expiresIn: response.expires_in || 300,
          role,
        },
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
          <Inbox className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          Create your InboxAI account
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Step 1 of 2: Account details & role selection
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && <ErrorAlert error={error} onClose={() => setError(null)} className="mb-6" />}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('assistant')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'assistant'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-5 w-5 mb-1 text-indigo-600" />
                  <span className="text-xs font-semibold">Executive Assistant</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Manages Inbox & AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'client'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-1 ring-purple-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="h-5 w-5 mb-1 text-purple-600" />
                  <span className="text-xs font-semibold">Executive Client</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Linked to an Assistant</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                A 6-digit OTP will be sent to this email for verification.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Linked Assistant ID field required when Client is selected */}
            {role === 'client' && (
              <div className="rounded-xl bg-purple-50 p-3.5 border border-purple-100 space-y-1.5">
                <label className="block text-xs font-semibold text-purple-950">
                  Linked Assistant ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={linkedAssistantId}
                    onChange={(e) => setLinkedAssistantId(e.target.value)}
                    placeholder="Enter Assistant's 24-character ID"
                    className="block w-full rounded-lg border border-purple-200 bg-white py-2 pl-9 pr-3 text-xs font-mono text-purple-900 placeholder-purple-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <p className="text-[11px] text-purple-800/80 leading-snug">
                  Ask your Executive Assistant for their Assistant ID. You will only see emails they classify for your attention.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  <span>Sending verification code...</span>
                </>
              ) : (
                <span>Continue to OTP Verification</span>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
