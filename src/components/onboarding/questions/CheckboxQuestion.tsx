import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface CheckboxQuestionProps {
  question: Question;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}

export function CheckboxQuestion({ question, value = false, onChange }: CheckboxQuestionProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group py-4 border-b border-[#ccc] hover:border-[#0f241d] transition-all">
      <div
        className={`flex-shrink-0 w-6 h-6 border-2 flex items-center justify-center transition-all mt-0.5 ${
          value
            ? 'border-[#0f241d] bg-[#0f241d]'
            : 'border-[#0f241d]/30 bg-transparent group-hover:border-[#0f241d]'
        }`}
      >
        {value && (
          <svg className="w-4 h-4 text-[#f2f0e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        id={`input-${question.id}`}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="font-editorial text-lg text-[#0f241d] leading-relaxed">
        {question.checkboxLabel || question.label}
      </span>
    </label>
  );
}

export default CheckboxQuestion;
