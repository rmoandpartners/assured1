import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface TextQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function TextQuestion({ question, value = '', onChange }: TextQuestionProps) {
  const maxLength = question.validation?.maxLength;

  return (
    <div className="space-y-2">
      <input
        type="text"
        id={`input-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || 'Enter your response...'}
        maxLength={maxLength}
        className="brutal-input"
      />

      {maxLength && value && (
        <p className="text-xs font-technical text-[#0f241d]/40 text-right">
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
}

export default TextQuestion;
