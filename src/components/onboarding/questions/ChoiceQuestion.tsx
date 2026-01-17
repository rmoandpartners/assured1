import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface ChoiceQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ChoiceQuestion({ question, value, onChange }: ChoiceQuestionProps) {
  const options = question.options || [];

  const handleSelect = (optionValue: string) => {
    // Toggle off if already selected, otherwise select
    if (value === optionValue) {
      onChange('');
    } else {
      onChange(optionValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(optionValue);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-3"
      role="radiogroup"
      aria-label={`Select an option for ${question.label}`}
    >
      {options.map((opt, index) => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const isSelected = optValue === value;

        return (
          <button
            key={`${optValue}-${index}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(optValue)}
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

export default ChoiceQuestion;
