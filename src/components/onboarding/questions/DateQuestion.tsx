import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Question } from '../../../types/questionnaire';

interface DateQuestionProps {
  question: Question & { futureOnly?: boolean };
  value: string | undefined;
  onChange: (value: string) => void;
}

type DropdownType = 'day' | 'month' | 'year' | null;

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export function DateQuestion({ question, value = '', onChange }: DateQuestionProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value (YYYY-MM-DD format)
  const parsed = useMemo(() => {
    if (!value) return { year: '', month: '', day: '' };
    const parts = value.split('-');
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || '',
    };
  }, [value]);

  // Generate year options based on futureOnly flag
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList: string[] = [];

    if (question.futureOnly) {
      // Future dates: current year through 5 years ahead
      for (let y = currentYear; y <= currentYear + 5; y++) {
        yearList.push(y.toString());
      }
    } else {
      // Past dates: current year back 100 years (for birth dates, etc.)
      for (let y = currentYear; y >= currentYear - 100; y--) {
        yearList.push(y.toString());
      }
    }

    return yearList;
  }, [question.futureOnly]);

  // Generate day options based on selected month/year
  const days = useMemo(() => {
    const month = parseInt(parsed.month) || 1;
    const year = parseInt(parsed.year) || new Date().getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    const dayList: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      dayList.push(d.toString().padStart(2, '0'));
    }
    return dayList;
  }, [parsed.month, parsed.year]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDate = (type: 'day' | 'month' | 'year', newValue: string) => {
    const newParts = { ...parsed };
    newParts[type] = newValue;

    // Only emit if we have all parts
    if (newParts.year && newParts.month && newParts.day) {
      // Validate day doesn't exceed month's days
      const daysInMonth = new Date(parseInt(newParts.year), parseInt(newParts.month), 0).getDate();
      if (parseInt(newParts.day) > daysInMonth) {
        newParts.day = daysInMonth.toString().padStart(2, '0');
      }
      onChange(`${newParts.year}-${newParts.month}-${newParts.day}`);
    } else if (newParts.year || newParts.month || newParts.day) {
      // Partial date - store what we have
      const y = newParts.year || '0000';
      const m = newParts.month || '00';
      const d = newParts.day || '00';
      onChange(`${y}-${m}-${d}`);
    }

    setOpenDropdown(null);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: DropdownType, options: string[]) => {
    if (!openDropdown) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpenDropdown(type);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && options[focusedIndex]) {
          updateDate(type as 'day' | 'month' | 'year', options[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpenDropdown(null);
        setFocusedIndex(-1);
        break;
    }
  };

  const renderDropdown = (
    type: 'day' | 'month' | 'year',
    label: string,
    options: { value: string; label: string }[] | string[],
    currentValue: string,
    placeholder: string
  ) => {
    const isOpen = openDropdown === type;
    const normalizedOptions = options.map((opt) =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );
    const selectedOption = normalizedOptions.find((opt) => opt.value === currentValue);

    return (
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => {
            setOpenDropdown(isOpen ? null : type);
            setFocusedIndex(-1);
          }}
          onKeyDown={(e) => handleKeyDown(e, type, normalizedOptions.map((o) => o.value))}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full text-left bg-transparent border-b py-3 font-editorial text-lg text-[#0f241d] flex items-center justify-between transition-all duration-300 focus:outline-none ${
            isOpen
              ? 'border-[#c25e00] border-b-2'
              : 'border-[#ccc] hover:border-[#0f241d]'
          }`}
        >
          <span className={selectedOption ? '' : 'text-[#9ca3af]/50 font-technical text-sm'}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-[#0f241d]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Label */}
        <span className="absolute -top-5 left-0 font-technical text-[10px] uppercase tracking-widest text-[#0f241d]/40">
          {label}
        </span>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute w-full mt-2 border border-[#0f241d]/20 shadow-xl overflow-hidden"
            style={{ backgroundColor: '#e8e6df', zIndex: 9999 }}
          >
            <div className="max-h-48 overflow-y-auto" style={{ backgroundColor: '#e8e6df' }}>
              {normalizedOptions.map((opt, index) => {
                const isSelected = opt.value === currentValue;
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => updateDate(type, opt.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className="w-full px-4 py-2.5 text-left font-editorial text-base transition-colors"
                    style={{
                      backgroundColor: isSelected ? '#0f241d' : isFocused ? '#d9d7d0' : '#e8e6df',
                      color: isSelected ? '#f2f0e9' : '#0f241d',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative pt-6">
      <div className="flex gap-4">
        {renderDropdown('day', 'Day', days, parsed.day, 'DD')}
        {renderDropdown('month', 'Month', MONTHS, parsed.month, 'Month')}
        {renderDropdown('year', 'Year', years.map((y) => ({ value: y, label: y })), parsed.year, 'YYYY')}
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        id={`input-${question.id}`}
        value={value}
      />
    </div>
  );
}

export default DateQuestion;
