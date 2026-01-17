import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface MultiselectQuestionProps {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function MultiselectQuestion({ question, value = [], onChange }: MultiselectQuestionProps) {
  const options = question.options || [];
  const usePills = options.length <= 12;
  const selectedCount = (value || []).length;

  const handleToggle = (optionValue: string) => {
    const currentValues = value || [];
    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      onChange([...currentValues, optionValue]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(optionValue);
    }
  };

  if (usePills) {
    return (
      <div
        className="flex flex-wrap gap-3"
        role="group"
        aria-label={`Select one or more options for ${question.label}`}
      >
        <span className="sr-only">
          {selectedCount} of {options.length} options selected
        </span>
        {options.map((opt, index) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isSelected = (value || []).includes(optValue);

          return (
            <button
              key={`${optValue}-${index}`}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => handleToggle(optValue)}
              onKeyDown={(e) => handleKeyDown(e, optValue)}
              className={`px-4 py-2 rounded-full border font-technical text-sm transition-all ${
                isSelected
                  ? 'bg-[#0f241d] text-[#f2f0e9] border-[#0f241d]'
                  : 'bg-transparent text-[#0f241d] border-[#0f241d]/20 hover:border-[#0f241d]'
              }`}
            >
              {optLabel}
            </button>
          );
        })}
      </div>
    );
  }

  // Checkbox list for many options
  return (
    <fieldset>
      <legend className="sr-only">
        {question.label} - Select all that apply. {selectedCount} of {options.length} selected.
      </legend>
      <div className="space-y-2 max-h-80 overflow-y-auto" role="group">
        {options.map((opt, index) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isSelected = (value || []).includes(optValue);
          const inputId = `checkbox-${question.id}-${index}`;

          return (
            <label
              key={`${optValue}-${index}`}
              htmlFor={inputId}
              className={`flex items-center gap-3 py-4 border-b cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#c25e00] border-b-2'
                  : 'border-[#ccc] hover:border-[#0f241d]'
              }`}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(optValue)}
                className="hidden tag-radio"
              />
              <div
                className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#0f241d] border-[#0f241d]'
                    : 'bg-transparent border-[#0f241d]/30'
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-[#f2f0e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`font-editorial text-lg ${isSelected ? 'text-[#0f241d]' : 'text-[#0f241d]/70'}`}>
                {optLabel}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default MultiselectQuestion;
