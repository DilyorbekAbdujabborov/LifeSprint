import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
  darkMode?: boolean;
}

export default function CustomSelect({ value, onChange, options, className = '', placeholder, darkMode }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);
  const display = selected ? selected.label : (placeholder || 'Tanlang...');

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 text-xs font-medium px-3.5 py-3 rounded-xl border transition cursor-pointer ${
          darkMode
            ? 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-slate-500'
            : 'bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-300'
        }`}
      >
        <span className={!selected ? (darkMode ? 'text-slate-400' : 'text-gray-400') : ''}>{display}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''} ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className={`absolute z-50 mt-1 w-full rounded-xl border shadow-lg overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition cursor-pointer ${
                opt.value === value
                  ? darkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-50 text-purple-700'
                  : darkMode ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
