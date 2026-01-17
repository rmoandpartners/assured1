import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface QuestionWrapperProps {
  question: Question;
  error?: string;
  children: React.ReactNode;
}

export function QuestionWrapper({ question, error, children }: QuestionWrapperProps) {
  const isRequired = question.required;
  const showLabel = question.type !== 'heading' && question.type !== 'display';

  return (
    <div
      id={`question-${question.id}`}
      className={`${error ? 'animate-shake' : ''}`}
    >
      {showLabel && (
        <div className="mb-6">
          <label
            htmlFor={`input-${question.id}`}
            className="block font-technical text-xs uppercase tracking-widest mb-2 text-[#0f241d]/60"
          >
            {question.label}
            {isRequired && (
              <span className="text-[#c25e00] ml-1" aria-label="required">
                *
              </span>
            )}
          </label>

          {question.helpText && (
            <p className="font-technical text-sm text-[#0f241d]/50">
              {question.helpText}
            </p>
          )}
        </div>
      )}

      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="font-technical text-sm text-[#c25e00] mt-3 flex items-center gap-2" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* DEV: Question ID for feedback - DELETE THIS BLOCK BEFORE PRODUCTION */}
      <div className="mt-2 text-right">
        <code className="font-mono text-[10px] text-[#0f241d]/20 select-all cursor-pointer hover:text-[#c25e00]/50 transition-colors">
          {question.id}
        </code>
      </div>
      {/* END DEV BLOCK */}
    </div>
  );
}

export default QuestionWrapper;
