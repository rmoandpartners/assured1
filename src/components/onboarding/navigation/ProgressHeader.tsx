import React, { useMemo } from 'react';
import { useWizard } from '../WizardProvider';
import type { QuestionnaireConfig } from '../../../types/questionnaire';

interface ProgressHeaderProps {
  currentPhase: 'general_profile' | 'technical_domain';
  currentDomain?: QuestionnaireConfig;
}

export function ProgressHeader({ currentPhase, currentDomain }: ProgressHeaderProps) {
  const {
    state,
    currentQuestionnaire,
    currentScreen,
    overallProgress,
    activeQuestionnaires,
  } = useWizard();

  // Calculate current questionnaire progress
  const questionnaireProgress = useMemo(() => {
    if (!currentQuestionnaire) return 0;

    const progress = state.progress[state.navigation.currentQuestionnaireId];
    return progress?.percentComplete || 0;
  }, [state.progress, state.navigation.currentQuestionnaireId, currentQuestionnaire]);

  // Get display title
  const displayTitle = useMemo(() => {
    if (currentPhase === 'general_profile') {
      return 'General Profile';
    }
    return currentDomain?.displayName || 'Technical Profile';
  }, [currentPhase, currentDomain]);

  // Get section info
  const sectionInfo = useMemo(() => {
    if (!currentScreen || !currentQuestionnaire) return null;

    const visibleSections = currentQuestionnaire.sections.filter((s) => s.isVisible);
    const currentSectionIndex = visibleSections.findIndex(
      (s) => s.section.id === currentScreen.sectionId
    );

    return {
      title: currentScreen.sectionTitle,
      current: currentSectionIndex + 1,
      total: visibleSections.length,
      screenInSection: currentScreen.screenIndex + 1,
      totalScreensInSection: currentScreen.totalScreensInSection,
    };
  }, [currentScreen, currentQuestionnaire]);

  return (
    <header className="sticky top-0 z-40 bg-[#f2f0e9]/95 backdrop-blur-sm border-b border-[#e0ddd5]">
      {/* Overall progress bar */}
      <div
        className="h-1 bg-[#e0ddd5]"
        role="progressbar"
        aria-valuenow={overallProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Overall progress: ${overallProgress}% complete`}
      >
        <div
          className="h-full bg-[#c25e00] transition-all duration-500 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title and section info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-editorial text-lg font-semibold text-[#0f241d] truncate">
                {displayTitle}
              </h1>
              <span className="text-[#0f241d]/40" aria-hidden="true">|</span>
              <span className="font-technical text-sm text-[#0f241d]/60" aria-live="polite">
                {questionnaireProgress}% complete
              </span>
            </div>

            {sectionInfo && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-technical text-[#0f241d]/50">
                  Section {sectionInfo.current} of {sectionInfo.total}:
                </span>
                <span className="font-technical font-medium text-[#0f241d]/70 truncate">
                  {sectionInfo.title}
                </span>
                {sectionInfo.totalScreensInSection > 1 && (
                  <span className="font-technical text-[#0f241d]/40">
                    (Page {sectionInfo.screenInSection}/{sectionInfo.totalScreensInSection})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Questionnaire indicator */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Questionnaire progress">
            {activeQuestionnaires.map((q, index) => {
              const isActive = q.id === state.navigation.currentQuestionnaireId;
              const isCompleted = state.progress[q.id]?.status === 'completed';

              return (
                <div
                  key={q.id}
                  className={`flex items-center justify-center w-8 h-8 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#c25e00] text-white scale-110'
                      : isCompleted
                      ? 'bg-[#0f241d]/20 text-[#0f241d]'
                      : 'bg-[#e0ddd5] text-[#0f241d]/50'
                  }`}
                  title={q.displayName}
                  aria-label={`${q.displayName}: ${isCompleted ? 'completed' : isActive ? 'current' : 'not started'}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Section progress bar */}
        {sectionInfo && sectionInfo.totalScreensInSection > 1 && (
          <div className="mt-3">
            <div
              className="flex gap-1"
              role="progressbar"
              aria-valuenow={sectionInfo.screenInSection}
              aria-valuemin={1}
              aria-valuemax={sectionInfo.totalScreensInSection}
              aria-label={`Section progress: page ${sectionInfo.screenInSection} of ${sectionInfo.totalScreensInSection}`}
            >
              {Array.from({ length: sectionInfo.totalScreensInSection }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 transition-all ${
                    idx < sectionInfo.screenInSection
                      ? 'bg-[#c25e00]'
                      : 'bg-[#e0ddd5]'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default ProgressHeader;
