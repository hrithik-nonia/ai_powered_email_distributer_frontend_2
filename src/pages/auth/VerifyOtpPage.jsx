import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Spinner } from '../../components/common/Spinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import {
  Inbox,
  KeyRound,
  RefreshCw,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const initialExpiresIn = location.state?.expiresIn || 300;
  const role = location.state?.role || 'assistant';

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(initialExpiresIn);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);
  const [registrationResult, setRegistrationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyOtp({
        email,
        otp: otp.trim(),
      });

      // Response contains created user: { message, user: { id, name, email, role, ... } }
      setRegistrationResult(response.user);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(null);

    try {
      const response = await authApi.resendOtp({ email });
      setTimeLeft(response.expires_in || 300);
      setResendSuccess('New verification code sent to your email.');
    } catch (err) {
      setError(err);
    } finally {
      setIsResending(false);
    }
  };

  const handleCopyId = () => {
    if (registrationResult?.id) {
      navigator.clipboard.writeText(registrationResult.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
          <Inbox className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          {registrationResult ? 'Account Created!' : 'Verify your email'}
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          {registrationResult
            ? 'Your InboxAI account is verified and ready.'
            : `We sent a 6-digit code to ${email || 'your email'}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && <ErrorAlert error={error} onClose={() => setError(null)} className="mb-6" />}

          {resendSuccess && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              {resendSuccess}
            </div>
          )}

          {/* Success screen showing Assistant ID if assistant */}
          {registrationResult ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Welcome, {registrationResult.name}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your account has been registered successfully.
                </p>
              </div>

              {/* If assistant, display Assistant ID clearly to share with clients */}
              {registrationResult.role === 'assistant' && (
                <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      Your Assistant ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 font-mono text-xs text-slate-800 border border-indigo-100 select-all break-all">
                    {registrationResult.id}
                  </div>
                  <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                    Share this unique ID with your executive client(s). They will enter it when registering their client account.
                  </p>
                </div>
              )}

              {registrationResult.role === 'client' && (
                <div className="rounded-2xl bg-purple-50/70 p-4 border border-purple-100 text-left text-xs text-purple-900 leading-relaxed">
                  You are successfully linked to your Executive Assistant. Log in to review emails requiring your decision.
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <span>Proceed to Sign in</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* OTP Entry Form */
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-center font-mono text-lg tracking-widest text-slate-900 placeholder-slate-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Timer & Resend */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">
                  {timeLeft > 0 ? (
                    <>Expires in: <span className="font-mono font-semibold text-slate-700">{formatTimer(timeLeft)}</span></>
                  ) : (
                    <span className="text-red-500 font-medium">OTP expired</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-40 transition"
                >
                  <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="mt-2 flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Verifying code...</span>
                  </>
                ) : (
                  <span>Verify & Activate Account</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/register"
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Change email or registration details
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
