import React, { useState } from 'react';
import { LABELS } from '../../utils/constants';
import { Tag, ChevronDown, Check } from 'lucide-react';

export function LabelDropdown({ currentLabel, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (key) => {
    if (key !== currentLabel) {
      onChange(key);
    }
    setIsOpen(false);
  };

  const activeConfig = LABELS[currentLabel] || {
    label: currentLabel || 'Set Label',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
          activeConfig.color
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
      >
        <Tag className="h-3.5 w-3.5" />
        <span>{activeConfig.label}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 z-40 p-1 divide-y divide-slate-100">
            <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Change AI / Workflow Label
            </div>
            <div className="py-1">
              {Object.values(LABELS).map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition ${
                    item.key === currentLabel ? 'bg-slate-50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${item.dot}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-800">
                      <span>{item.label}</span>
                      {item.key === currentLabel && (
                        <Check className="h-3.5 w-3.5 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
