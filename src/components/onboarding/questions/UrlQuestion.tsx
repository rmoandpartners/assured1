import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface UrlQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function UrlQuestion({ question, value = '', onChange }: UrlQuestionProps) {
  return (
    <div className="relative">
      <input
        type="url"
        id={`input-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || 'https://example.com'}
        className="brutal-input"
      />
    </div>
  );
}

export default UrlQuestion;
