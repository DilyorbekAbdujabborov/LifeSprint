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
}

export default function CustomSelect({ value, onChange, options, className = '', placeholder }: CustomSelectProps) {
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
        className="w-full flex items-center justify-between gap-2 text-xs font-medium px-3.5 py-3 rounded-xl border transition cursor-pointer bg-[color:var(--surface-2)] border-[color:var(--border)] text-[color:var(--text)] hover:border-[color:var(--brand)]"
      >
        <span className={!selected ? 'text-[color:var(--text-subtle)]' : ''}>{display}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[color:var(--text-subtle)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border shadow-lg overflow-hidden bg-[color:var(--surface)] border-[color:var(--border)]">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition cursor-pointer ${
                opt.value === value
                  ? 'bg-[color:var(--brand-soft)] text-[color:var(--brand)]'
                  : 'text-[color:var(--text)] hover:bg-[color:var(--surface-2)]'
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
