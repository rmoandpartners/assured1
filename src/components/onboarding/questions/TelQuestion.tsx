import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface TelQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function TelQuestion({ question, value = '', onChange }: TelQuestionProps) {
  return (
    <div className="relative">
      <input
        type="tel"
        id={`input-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || '+44 123 456 7890'}
        className="brutal-input"
      />
    </div>
  );
}

export default TelQuestion;
