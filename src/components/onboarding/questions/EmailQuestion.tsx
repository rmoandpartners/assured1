import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface EmailQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function EmailQuestion({ question, value = '', onChange }: EmailQuestionProps) {
  return (
    <div className="relative">
      <input
        type="email"
        id={`input-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || 'email@example.com'}
        className="brutal-input"
      />
    </div>
  );
}

export default EmailQuestion;
