import React from 'react';
import type { Question } from '../../../types/questionnaire';

interface ScenarioQuestionProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function ScenarioQuestion({ question, value, onChange }: ScenarioQuestionProps) {
  const currentValue = value ?? 0;
  const { scenario, optionA, optionB, scale } = question;

  if (!scenario || !optionA || !optionB || !scale) {
    console.warn(`ScenarioQuestion: Missing required fields for question ${question.id}`);
    return null;
  }

  const scaleLabels = scale.labels || {};
  const scalePoints = [1, 2, 3, 4];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newValue = currentValue;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(currentValue + 1, 4);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(currentValue - 1, 1);
        break;
      case 'Home':
        e.preventDefault();
        newValue = 1;
        break;
      case 'End':
        e.preventDefault();
        newValue = 4;
        break;
      default:
        return;
    }

    if (newValue !== currentValue && newValue >= 1) {
      onChange(newValue);
    }
  };

  const getScaleLabel = (point: number): string => {
    return scaleLabels[point.toString()] || '';
  };

  const isOptionASelected = currentValue === 1 || currentValue === 2;
  const isOptionBSelected = currentValue === 3 || currentValue === 4;

  return (
    <div className="space-y-8">
      {/* Scenario Context Card */}
      <div className="bg-[#0f241d]/5 border border-[#0f241d]/10 p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-2 h-2 mt-2 bg-[#c25e00] flex-shrink-0" />
          <span className="font-technical text-xs uppercase tracking-widest text-[#0f241d]/60">
            Scenario
          </span>
        </div>
        <p className="font-editorial text-lg text-[#0f241d] leading-relaxed pl-5">
          {scenario.context}
        </p>
        <p className="font-technical text-sm text-[#0f241d]/80 mt-4 pl-5 italic">
          {scenario.prompt}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A Card */}
        <div
          className={`p-5 border-2 transition-all duration-300 ${
            isOptionASelected
              ? 'border-[#0f241d] bg-[#0f241d]/5'
              : 'border-[#0f241d]/20 hover:border-[#0f241d]/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-6 h-6 flex items-center justify-center font-technical text-sm font-bold ${
                isOptionASelected
                  ? 'bg-[#0f241d] text-[#f2f0e9]'
                  : 'bg-[#0f241d]/10 text-[#0f241d]'
              }`}
            >
              A
            </span>
            <span className="font-technical text-sm font-medium text-[#0f241d] uppercase tracking-wide">
              {optionA.label}
            </span>
          </div>
          <p className="font-technical text-sm text-[#0f241d]/70 leading-relaxed">
            {optionA.description}
          </p>
        </div>

        {/* Option B Card */}
        <div
          className={`p-5 border-2 transition-all duration-300 ${
            isOptionBSelected
              ? 'border-[#0f241d] bg-[#0f241d]/5'
              : 'border-[#0f241d]/20 hover:border-[#0f241d]/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-6 h-6 flex items-center justify-center font-technical text-sm font-bold ${
                isOptionBSelected
                  ? 'bg-[#0f241d] text-[#f2f0e9]'
                  : 'bg-[#0f241d]/10 text-[#0f241d]'
              }`}
            >
              B
            </span>
            <span className="font-technical text-sm font-medium text-[#0f241d] uppercase tracking-wide">
              {optionB.label}
            </span>
          </div>
          <p className="font-technical text-sm text-[#0f241d]/70 leading-relaxed">
            {optionB.description}
          </p>
        </div>
      </div>

      {/* Scale Selector */}
      <div className="space-y-4">
        <p className="font-technical text-xs uppercase tracking-widest text-[#0f241d]/50 text-center">
          Select your position on the scale
        </p>

        <div
          className="grid grid-cols-4 gap-2"
          role="radiogroup"
          aria-label="Select how strongly you lean toward option A or B"
        >
          {scalePoints.map((point, index) => {
            const isSelected = currentValue === point;
            const label = getScaleLabel(point);

            return (
              <div key={point} className="flex flex-col">
                <input
                  type="radio"
                  name={`scenario-${question.id}`}
                  id={`scenario-${question.id}-${point}`}
                  value={point}
                  className="hidden"
                  checked={isSelected}
                  onChange={() => onChange(point)}
                />
                <label
                  htmlFor={`scenario-${question.id}-${point}`}
                  tabIndex={isSelected || (currentValue === 0 && index === 0) ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e, point)}
                  className={`flex flex-col items-center justify-center py-4 px-2 border-2 cursor-pointer transition-all text-center ${
                    isSelected
                      ? 'bg-[#0f241d] text-[#f2f0e9] border-[#0f241d]'
                      : 'bg-transparent text-[#0f241d] border-[#0f241d]/20 hover:border-[#0f241d]'
                  }`}
                >
                  <span className="font-technical text-lg font-bold">{point}</span>
                  <span className="font-technical text-[10px] uppercase tracking-wider mt-1 leading-tight">
                    {label}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Scale endpoints */}
        <div className="flex justify-between text-xs font-technical text-[#0f241d]/50 px-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#0f241d]/10 flex items-center justify-center text-[8px] font-bold">A</span>
            {optionA.label}
          </span>
          <span className="flex items-center gap-1">
            {optionB.label}
            <span className="w-3 h-3 bg-[#0f241d]/10 flex items-center justify-center text-[8px] font-bold">B</span>
          </span>
        </div>
      </div>

      {/* Selected value feedback */}
      {currentValue > 0 && (
        <div className="bg-[#e0ddd5]/30 p-4 border border-[#0f241d]/10 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-technical text-xs text-[#0f241d]/50 uppercase tracking-widest">
              Your response
            </span>
            <span className="font-editorial text-[#c25e00]">
              {getScaleLabel(currentValue)}
            </span>
          </div>
          <p className="font-technical text-sm text-[#0f241d]/70 mt-2">
            {currentValue <= 2 ? (
              <>You lean toward <strong>Option A</strong>: {optionA.label}</>
            ) : (
              <>You lean toward <strong>Option B</strong>: {optionB.label}</>
            )}
          </p>
        </div>
      )}

      {/* Hint for unselected */}
      {currentValue === 0 && (
        <p className="font-technical text-sm text-[#0f241d]/40 italic text-center">
          Read both options above, then select where you fall on the scale
        </p>
      )}
    </div>
  );
}

export default ScenarioQuestion;
