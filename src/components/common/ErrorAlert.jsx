import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export function ErrorAlert({ error, onClose, className = '' }) {
  if (!error) return null;

  // Format message from FastAPI error response or generic error
  let message = 'An error occurred. Please try again.';

  if (typeof error === 'string') {
    message = error;
  } else if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
    } else {
      message = JSON.stringify(detail);
    }
  } else if (error.message) {
    message = error.message;
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 ${className}`}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded p-0.5 text-red-500 hover:bg-red-100 hover:text-red-700 transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
