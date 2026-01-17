import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface SliderQuestionProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

// Default proficiency data as fallback
const DEFAULT_PROFICIENCY: { [level: number]: { label: string; description: string } } = {
  0: { label: 'No Experience', description: 'I have no experience in this area' },
  1: { label: 'Developing', description: 'I have foundational knowledge and limited practical experience' },
  2: { label: 'Proficient', description: 'I have solid working knowledge and can apply skills independently' },
  3: { label: 'Advanced', description: 'I have deep expertise and can lead initiatives in this area' },
  4: { label: 'Expert', description: 'I am a recognized expert with extensive experience and thought leadership' },
};

// Get proficiency label from question-specific levels or fallback to default
function getProficiencyLabel(question: Question, level: number): string {
  // Check if question has specific proficiency levels
  if (question.proficiencyLevels) {
    const label = question.proficiencyLevels[level.toString()];
    if (label) {
      return label;
    }
  }
  // Fall back to default label
  return DEFAULT_PROFICIENCY[level]?.label || `Level ${level}`;
}

// Get proficiency description from question-specific definitions or fallback to default
function getProficiencyDescription(question: Question, level: number): string {
  // Check if question has specific proficiency definitions
  if (question.proficiencyDefinitions) {
    const definition = question.proficiencyDefinitions[level.toString()];
    if (definition) {
      return definition;
    }
  }
  // Fall back to default description
  return DEFAULT_PROFICIENCY[level]?.description || '';
}

export function SliderQuestion({ question, value, onChange }: SliderQuestionProps) {
  const currentValue = value ?? -1;
  const levels = [0, 1, 2, 3, 4];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, 4);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = 4;
        break;
      default:
        return;
    }

    onChange(newIndex);
  };

  return (
    <div className="space-y-6">
      {/* Description - context about what this skill means */}
      {question.description && (
        <p className="font-technical text-sm text-[#0f241d]/60 -mt-2">
          {question.description}
        </p>
      )}

      {/* Rating buttons as grid */}
      <div
        className="grid grid-cols-5 gap-2"
        role="radiogroup"
        aria-label={`Proficiency rating for ${question.label}`}
      >
        {levels.map((level, index) => (
          <div key={level}>
            <input
              type="radio"
              name={`slider-${question.id}`}
              id={`slider-${question.id}-${level}`}
              value={level}
              className="hidden tag-radio"
              checked={currentValue === level}
              onChange={() => onChange(level)}
            />
            <label
              htmlFor={`slider-${question.id}-${level}`}
              tabIndex={currentValue === level || (currentValue < 0 && index === 0) ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, level)}
              className={`block text-center py-4 border cursor-pointer transition-all font-technical text-sm ${
                currentValue === level
                  ? 'bg-[#0f241d] text-[#f2f0e9] border-[#0f241d]'
                  : 'bg-transparent text-[#0f241d] border-[#0f241d]/20 hover:border-[#0f241d]'
              }`}
            >
              {level}
            </label>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs font-technical text-[#0f241d]/50">
        <span>No Experience</span>
        <span>Expert</span>
      </div>

      {/* Selected value description */}
      {currentValue >= 0 && (
        <div className="bg-[#e0ddd5]/30 p-6 border border-[#0f241d]/10 animate-fade-in">
          <div className="flex items-start justify-between mb-2">
            <span className="font-technical font-medium text-[#0f241d] text-sm uppercase tracking-widest">
              Level {currentValue}
            </span>
            <span className="font-editorial text-[#c25e00] text-lg">
              {getProficiencyLabel(question, currentValue)}
            </span>
          </div>
          <p className="font-technical text-sm text-[#0f241d]/70">
            {getProficiencyDescription(question, currentValue)}
          </p>
        </div>
      )}

      {/* Hint for unselected */}
      {currentValue < 0 && (
        <p className="font-technical text-sm text-[#0f241d]/40 italic">
          Select a proficiency level above
        </p>
      )}
    </div>
  );
}

export default SliderQuestion;
