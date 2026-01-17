import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface DisplayQuestionProps {
  question: Question;
}

export function DisplayQuestion({ question }: DisplayQuestionProps) {
  return (
    <div className="bg-[#e0ddd5]/30 p-6 border border-[#0f241d]/10">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-[#c25e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-technical text-[#0f241d] leading-relaxed">
            {question.label}
          </p>
          {question.helpText && (
            <p className="font-technical text-sm text-[#0f241d]/60 mt-2">
              {question.helpText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayQuestion;
