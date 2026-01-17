import React, { useMemo } from 'react';
import { useWizard } from '../WizardProvider';
import { QuestionRenderer } from '../questions/QuestionRenderer';
import { isQuestionVisible } from '../../../utils/conditionalLogic';
import type { Screen } from '../../../types/questionnaire';
import type { JourneyStage } from '../layout/SplitScreenLayout';

// Main journey stages
const JOURNEY_STAGES: { id: JourneyStage; label: string; shortLabel: string }[] = [
  { id: 'profile', label: 'Profile', shortLabel: 'Profile' },
  { id: 'experience', label: 'Experience', shortLabel: 'Exp' },
  { id: 'preferences', label: 'Preferences', shortLabel: 'Pref' },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
  { id: 'review', label: 'Review', shortLabel: 'Review' },
];

interface QuestionScreenProps {
  screen: Screen;
  questionnaireId: string;
  sectionTitle?: string;
  sectionDescription?: string;
  screenNumber?: number;
  totalScreens?: number;
  currentStage?: JourneyStage;
  sectionProgress?: { current: number; total: number };
  onBack?: () => void;
  onNext?: () => void;
  onSaveAndExit?: () => void;
}

export function QuestionScreen({
  screen,
  questionnaireId,
  sectionTitle,
  sectionDescription,
  screenNumber,
  totalScreens,
  currentStage,
  sectionProgress,
  onBack,
  onNext,
  onSaveAndExit,
}: QuestionScreenProps) {
  const { state, setAnswer, validationErrors } = useWizard();

  const responses = state.responses[questionnaireId] || {};
  const allResponses = state.responses;

  // Filter to only visible questions
  const visibleQuestions = useMemo(() => {
    return screen.questions.filter((question) =>
      isQuestionVisible(question, responses, allResponses)
    );
  }, [screen.questions, responses, allResponses]);

  const handleChange = (questionId: string, value: any) => {
    setAnswer(questionnaireId, questionId, value);
  };

  const currentStageIndex = currentStage
    ? JOURNEY_STAGES.findIndex((s) => s.id === currentStage)
    : -1;

  const progressPercent = sectionProgress
    ? (sectionProgress.current / sectionProgress.total) * 100
    : 0;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Texture Overlay */}
      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left Panel - Section Context */}
      <div className="w-full lg:w-[42%] bg-[#0f241d] text-[#f2f0e9] p-8 lg:p-16 flex flex-col justify-between relative z-10 min-h-[30vh] lg:min-h-screen transition-all duration-700 ease-in-out">
        {/* Header */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 mb-12 opacity-80">
            <div className="w-3 h-3 bg-[#c25e00]" />
            <span className="font-technical uppercase tracking-widest text-xs">
              Assured Recruitment
            </span>
          </div>

          {/* Section Title */}
          <h1 className="font-editorial text-4xl lg:text-5xl xl:text-6xl leading-[1.1] mb-6">
            {sectionTitle || screen.sectionTitle}
          </h1>
          {sectionDescription && (
            <p className="font-technical text-[#8fa89e] text-lg leading-relaxed max-w-sm">
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Journey Stage Stepper - Vertical */}
        {currentStage && (
          <div className="hidden lg:flex flex-col gap-3 mt-auto pt-12">
            {JOURNEY_STAGES.map((stage, i) => {
              const isCompleted = i < currentStageIndex;
              const isCurrent = stage.id === currentStage;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    isCurrent
                      ? 'opacity-100'
                      : isCompleted
                      ? 'opacity-60'
                      : 'opacity-25'
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#c25e00] scale-125'
                        : isCompleted
                        ? 'bg-[#f2f0e9]'
                        : 'bg-[#f2f0e9]/30'
                    }`}
                  />
                  {/* Connecting line */}
                  <div
                    className={`h-[1px] transition-all duration-500 ${
                      isCurrent
                        ? 'w-8 bg-[#c25e00]'
                        : isCompleted
                        ? 'w-6 bg-[#f2f0e9]/60'
                        : 'w-4 bg-[#f2f0e9]/20'
                    }`}
                  />
                  {/* Label */}
                  <span
                    className={`font-technical text-sm transition-all duration-300 ${
                      isCurrent
                        ? 'text-[#f2f0e9]'
                        : isCompleted
                        ? 'text-[#f2f0e9]/60'
                        : 'text-[#f2f0e9]/30'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress Bar - only show when no stage stepper */}
        {!currentStage && screenNumber && totalScreens && (
          <div className="hidden lg:flex flex-col gap-4 mt-auto pt-12">
            <div className="flex items-center gap-4">
              <span className="font-technical text-xs text-[#f2f0e9]/40">Progress</span>
              <div className="flex-1 h-[1px] bg-[#f2f0e9]/20" />
              <span className="font-technical text-xs text-[#f2f0e9]/60">
                {screenNumber} / {totalScreens}
              </span>
            </div>
            <div className="h-1 bg-[#f2f0e9]/10 overflow-hidden">
              <div
                className="h-full bg-[#c25e00] transition-all duration-500"
                style={{ width: `${(screenNumber / totalScreens) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Save & Exit on mobile */}
        {onSaveAndExit && (
          <div className="lg:hidden mt-6">
            <button
              onClick={onSaveAndExit}
              className="font-technical text-xs uppercase tracking-widest text-[#f2f0e9]/60 hover:text-[#f2f0e9] transition-colors"
            >
              Save & Continue Later
            </button>
          </div>
        )}
      </div>

      {/* Right Panel - Questions */}
      <div className="w-full lg:w-[58%] bg-[#f2f0e9] text-[#1a1a1a] p-8 lg:p-16 xl:p-24 flex flex-col relative z-10 min-h-[70vh] lg:min-h-screen">
        {/* Navigation Top */}
        <div className="flex items-center gap-4 mb-8">
          {onBack ? (
            <button
              onClick={onBack}
              className="font-technical text-xs uppercase tracking-widest hover:text-[#c25e00] transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <span className="rotate-180 inline-block">→</span> Back
            </button>
          ) : (
            <div className="w-16" />
          )}

          {/* Section Progress Bar */}
          {sectionProgress && (
            <div className="flex-1 h-[2px] bg-[#0f241d]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c25e00] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {onSaveAndExit && (
            <button
              onClick={onSaveAndExit}
              className="hidden lg:block font-technical text-xs uppercase tracking-widest text-[#0f241d]/40 hover:text-[#c25e00] transition-colors"
            >
              Save & Exit
            </button>
          )}
        </div>

        {/* Mobile Stage Stepper - Horizontal */}
        {currentStage && (
          <div className="lg:hidden flex items-center justify-center gap-1 mb-8">
            {JOURNEY_STAGES.map((stage, i) => {
              const isCompleted = i < currentStageIndex;
              const isCurrent = stage.id === currentStage;

              return (
                <React.Fragment key={stage.id}>
                  {/* Dot indicator */}
                  <div className="flex flex-col items-center gap-1 transition-all duration-300">
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'w-2.5 h-2.5 bg-[#c25e00]'
                          : isCompleted
                          ? 'w-2 h-2 bg-[#0f241d]'
                          : 'w-2 h-2 bg-[#0f241d]/20'
                      }`}
                    />
                    <span
                      className={`font-technical text-[10px] transition-all duration-300 ${
                        isCurrent
                          ? 'text-[#0f241d]'
                          : isCompleted
                          ? 'text-[#0f241d]/60'
                          : 'text-[#0f241d]/30'
                      }`}
                    >
                      {stage.shortLabel}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < JOURNEY_STAGES.length - 1 && (
                    <div
                      className={`w-6 h-[1px] mb-4 transition-all duration-300 ${
                        isCompleted ? 'bg-[#0f241d]/40' : 'bg-[#0f241d]/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Questions Container */}
        <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
          {visibleQuestions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-editorial text-[#0f241d]/40 text-lg italic">
                No questions to display on this screen.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {visibleQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <QuestionRenderer
                    question={question}
                    value={responses[question.id]?.value}
                    onChange={(value) => handleChange(question.id, value)}
                    error={validationErrors[question.id]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {onNext && (
          <div className="mt-auto pt-8 flex justify-end">
            <button
              onClick={onNext}
              className="group relative overflow-hidden bg-[#0f241d] text-[#f2f0e9] px-12 py-5 font-technical uppercase tracking-widest text-sm transition-all hover:bg-[#c25e00]"
            >
              <div className="relative z-10 flex items-center gap-4">
                Continue
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionScreen;
