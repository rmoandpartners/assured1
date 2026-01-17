import React, { useState, useRef, useEffect } from 'react';
import type { Question } from '../../../types/questionnaire';

interface SelectQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function SelectQuestion({ question, value, onChange }: SelectQuestionProps) {
  const options = question.options || [];
  const hasMany = options.length > 7;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) =>
    typeof opt === 'string' ? opt === value : opt.value === value
  );

  const selectedLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label
    : '';

  // Filter options based on search (only for many options)
  const filteredOptions = hasMany && search
    ? options.filter((opt) => {
        const label = typeof opt === 'string' ? opt : opt.label;
        return label.toLowerCase().includes(search.toLowerCase());
      })
    : options;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening (only for many options)
  useEffect(() => {
    if (isOpen && hasMany && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, hasMany]);

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
    setFocusedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          const opt = filteredOptions[focusedIndex];
          const optValue = typeof opt === 'string' ? opt : opt.value;
          handleSelect(optValue);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        setFocusedIndex(-1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(filteredOptions.length - 1);
        break;
    }
  };

  const listboxId = `listbox-${question.id}`;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        id={`input-${question.id}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className={`w-full text-left bg-transparent border-0 border-b py-4 font-editorial text-xl text-[#0f241d] flex items-center justify-between transition-all duration-300 focus:outline-none ${
          isOpen
            ? 'border-[#c25e00] border-b-2 pl-2.5'
            : 'border-[#ccc] hover:border-[#0f241d]'
        }`}
      >
        <span className={value ? '' : 'text-[#9ca3af]/50 font-technical text-base'}>
          {selectedLabel || 'Select an option...'}
        </span>
        <div className="flex items-center gap-2">
          {value && !question.required && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-[#c25e00] transition-colors focus:outline-none"
              aria-label="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg
            className={`w-5 h-5 text-[#0f241d]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute w-full mt-2 border border-[#0f241d]/20 shadow-xl overflow-hidden"
          style={{ backgroundColor: '#e8e6df', zIndex: 9999 }}
          role="presentation"
        >
          {/* Search input - only for many options */}
          {hasMany && (
            <div className="p-3 border-b border-[#0f241d]/10" style={{ backgroundColor: '#e8e6df' }}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search options..."
                className="w-full px-3 py-2 border border-[#0f241d]/10 font-technical text-sm focus:outline-none focus:border-[#c25e00]"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          )}

          {/* Options list */}
          <div
            id={listboxId}
            role="listbox"
            className="max-h-60 overflow-y-auto"
            style={{ backgroundColor: '#e8e6df' }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 font-technical text-sm text-[#0f241d]/40" style={{ backgroundColor: '#e8e6df' }}>
                No options found
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                const isSelected = optValue === value;
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={`${optValue}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(optValue)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className="w-full px-4 py-3 text-left font-editorial text-lg transition-colors"
                    style={{
                      backgroundColor: isSelected ? '#0f241d' : isFocused ? '#d9d7d0' : '#e8e6df',
                      color: isSelected ? '#f2f0e9' : '#0f241d',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{optLabel}</span>
                      {isSelected && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectQuestion;
