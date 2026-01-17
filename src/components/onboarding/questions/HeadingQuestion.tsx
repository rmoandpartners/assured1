import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface HeadingQuestionProps {
  question: Question;
}

export function HeadingQuestion({ question }: HeadingQuestionProps) {
  return (
    <div className="pt-6 pb-4">
      <h3 className="font-editorial text-2xl text-[#0f241d]">
        {question.label}
      </h3>
      {question.helpText && (
        <p className="font-technical text-[#8fa89e] mt-2">
          {question.helpText}
        </p>
      )}
    </div>
  );
}

export default HeadingQuestion;
