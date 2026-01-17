import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface NumberQuestionProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function NumberQuestion({ question, value, onChange }: NumberQuestionProps) {
  const min = question.validation?.min;
  const max = question.validation?.max;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="number"
        id={`input-${question.id}`}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={question.placeholder || 'Enter a number...'}
        min={min}
        max={max}
        className="brutal-input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {(min !== undefined || max !== undefined) && (
        <p className="text-xs font-technical text-[#0f241d]/40">
          {min !== undefined && max !== undefined
            ? `Range: ${min} - ${max}`
            : min !== undefined
            ? `Minimum: ${min}`
            : `Maximum: ${max}`}
        </p>
      )}
    </div>
  );
}

export default NumberQuestion;
