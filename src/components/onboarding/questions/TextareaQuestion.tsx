import React, { useRef, useEffect } from 'react';
import type { Question } from '../../../types/questionnaire';

interface TextareaQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function TextareaQuestion({ question, value = '', onChange }: TextareaQuestionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = question.validation?.maxLength || 2000;
  const minLength = question.validation?.minLength || 0;
  const charCount = value?.length || 0;
  const percentUsed = (charCount / maxLength) * 100;

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 120), 400);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        id={`input-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || 'Enter your response...'}
        maxLength={maxLength}
        className={`w-full bg-transparent border-0 border-b font-editorial text-xl text-[#0f241d] resize-none transition-all duration-300 focus:outline-none focus:pl-2.5 ${
          percentUsed > 90
            ? 'border-[#c25e00] border-b-2'
            : 'border-[#ccc] focus:border-[#c25e00] focus:border-b-2'
        }`}
        style={{ minHeight: '120px', padding: '1rem 0' }}
      />

      {/* Character count */}
      <div className="flex items-center justify-between text-xs font-technical">
        {minLength > 0 && charCount < minLength ? (
          <span className="text-[#c25e00]">
            Minimum {minLength} characters required
          </span>
        ) : (
          <span />
        )}

        <span
          className={`${
            percentUsed > 90
              ? 'text-[#c25e00] font-medium'
              : 'text-[#0f241d]/40'
          }`}
        >
          {charCount.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default TextareaQuestion;
