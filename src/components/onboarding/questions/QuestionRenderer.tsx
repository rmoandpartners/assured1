import React from 'react';
import type { Question } from '../../../types/questionnaire';
import { QuestionWrapper } from './QuestionWrapper';
import { SliderQuestion } from './SliderQuestion';
import { SelectQuestion } from './SelectQuestion';
import { MultiselectQuestion } from './MultiselectQuestion';
import { TextareaQuestion } from './TextareaQuestion';
import { TextQuestion } from './TextQuestion';
import { NumberQuestion } from './NumberQuestion';
import { CheckboxQuestion } from './CheckboxQuestion';
import { DateQuestion } from './DateQuestion';
import { EmailQuestion } from './EmailQuestion';
import { TelQuestion } from './TelQuestion';
import { UrlQuestion } from './UrlQuestion';
import { FileQuestion } from './FileQuestion';
import { HeadingQuestion } from './HeadingQuestion';
import { DisplayQuestion } from './DisplayQuestion';
import { ScenarioQuestion } from './ScenarioQuestion';
import { ChoiceQuestion } from './ChoiceQuestion';
import { CareerHistoryQuestion } from './CareerHistoryQuestion';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function QuestionRenderer({ question, value, onChange, error }: QuestionRendererProps) {
  // Heading and display don't need wrapper
  if (question.type === 'heading') {
    return <HeadingQuestion question={question} />;
  }

  if (question.type === 'display') {
    return <DisplayQuestion question={question} />;
  }

  // Render the appropriate question component
  const renderInput = () => {
    switch (question.type) {
      case 'slider':
        return (
          <SliderQuestion
            question={question}
            value={value as number | undefined}
            onChange={onChange}
          />
        );

      case 'select':
        return (
          <SelectQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'multiselect':
        return (
          <MultiselectQuestion
            question={question}
            value={value as string[] | undefined}
            onChange={onChange}
          />
        );

      case 'textarea':
        return (
          <TextareaQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'text':
        return (
          <TextQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'number':
        return (
          <NumberQuestion
            question={question}
            value={value as number | undefined}
            onChange={onChange}
          />
        );

      case 'checkbox':
        return (
          <CheckboxQuestion
            question={question}
            value={value as boolean | undefined}
            onChange={onChange}
          />
        );

      case 'date':
        return (
          <DateQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'email':
        return (
          <EmailQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'tel':
        return (
          <TelQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'url':
        return (
          <UrlQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'file':
        return (
          <FileQuestion
            question={question}
            value={value as File | string | undefined}
            onChange={onChange}
          />
        );

      case 'scenario':
        return (
          <ScenarioQuestion
            question={question}
            value={value as number | undefined}
            onChange={onChange}
          />
        );

      case 'choice':
        return (
          <ChoiceQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'career_history':
        return (
          <CareerHistoryQuestion
            question={question}
            value={value as import('../../../types/questionnaire').CareerEntry[] | undefined}
            onChange={onChange}
          />
        );

      default:
        console.warn(`Unknown question type: ${question.type}`);
        return (
          <TextQuestion
            question={question}
            value={value as string | undefined}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <QuestionWrapper question={question} error={error}>
      {renderInput()}
    </QuestionWrapper>
  );
}

export default QuestionRenderer;
