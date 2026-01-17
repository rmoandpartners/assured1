import React from 'react';

interface Step {
  id: string;
  label: string;
}

// Main journey stages
export type JourneyStage = 'profile' | 'experience' | 'preferences' | 'skills' | 'review';

const JOURNEY_STAGES: { id: JourneyStage; label: string; shortLabel: string }[] = [
  { id: 'profile', label: 'Profile', shortLabel: 'Profile' },
  { id: 'experience', label: 'Experience', shortLabel: 'Exp' },
  { id: 'preferences', label: 'Preferences', shortLabel: 'Pref' },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
  { id: 'review', label: 'Review', shortLabel: 'Review' },
];

interface SplitScreenLayoutProps {
  title: string;
  description: string;
  stepNumber?: number;
  totalSteps?: number;
  steps?: Step[];
  currentStepId?: string;
  currentStage?: JourneyStage;
  sectionProgress?: { current: number; total: number };
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBackButton?: boolean;
  showStageStepper?: boolean;
  children: React.ReactNode;
}

export function SplitScreenLayout({
  title,
  description,
  stepNumber,
  totalSteps,
  steps,
  currentStepId,
  currentStage,
  sectionProgress,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  showBackButton = true,
  showStageStepper = true,
  children,
}: SplitScreenLayoutProps) {
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

      {/* Left Panel - Context */}
      <div className="w-full lg:w-[42%] bg-[#0f241d] text-[#f2f0e9] p-8 lg:p-16 flex flex-col justify-between relative z-10 min-h-[40vh] lg:min-h-screen transition-all duration-700 ease-in-out">
        {/* Header */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 mb-12 opacity-80">
            <div className="w-3 h-3 bg-[#c25e00]" />
            <span className="font-technical uppercase tracking-widest text-xs">
              Assured Recruitment
            </span>
          </div>

          {/* Dynamic Title */}
          <h1 className="font-editorial text-5xl lg:text-6xl leading-[1.1] mb-6">
            {title}
          </h1>
          <p className="font-technical text-[#8fa89e] text-lg leading-relaxed max-w-sm">
            {description}
          </p>
        </div>

        {/* Journey Stage Stepper - Vertical on left panel */}
        {showStageStepper && currentStage && (
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

        {/* Section Steps (legacy) */}
        {steps && steps.length > 0 && !currentStage && (
          <div className="hidden lg:flex flex-col gap-4 mt-auto pt-12">
            {steps.map((step, i) => {
              const isCurrent = step.id === currentStepId;
              const stepNum = i + 1;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    isCurrent ? 'opacity-100 translate-x-2' : 'opacity-30'
                  }`}
                >
                  <span className="font-technical text-xs">
                    {stepNum.toString().padStart(2, '0')}
                  </span>
                  <div
                    className={`h-[1px] bg-[#f2f0e9] transition-all duration-500 ${
                      isCurrent ? 'w-12' : 'w-4'
                    }`}
                  />
                  <span className="font-editorial italic text-lg capitalize">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Panel - Action */}
      <div className="w-full lg:w-[58%] bg-[#f2f0e9] text-[#1a1a1a] p-8 lg:p-16 xl:p-24 flex flex-col relative z-10 min-h-[60vh] lg:min-h-screen">
        {/* Navigation Top */}
        <div className="flex justify-between items-center mb-8">
          {showBackButton && onBack ? (
            <button
              onClick={onBack}
              className="font-technical text-xs uppercase tracking-widest hover:text-[#c25e00] transition-colors flex items-center gap-2"
            >
              <span className="rotate-180 inline-block">→</span> Back
            </button>
          ) : (
            <div />
          )}
          {stepNumber && totalSteps && (
            <div className="font-technical text-xs text-[#0f241d]/40">
              STEP {stepNumber} / {totalSteps}
            </div>
          )}
        </div>

        {/* Mobile Stage Stepper - Horizontal */}
        {showStageStepper && currentStage && (
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

        {/* Form Container */}
        <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
          <div className="animate-fade-up">
            {children}
          </div>
        </div>

        {/* Action Button */}
        {onNext && (
          <div className="mt-auto pt-8 flex justify-end">
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`group relative overflow-hidden px-12 py-5 font-technical uppercase tracking-widest text-sm transition-all ${
                nextDisabled
                  ? 'bg-[#0f241d]/30 text-[#f2f0e9]/50 cursor-not-allowed'
                  : 'bg-[#0f241d] text-[#f2f0e9] hover:bg-[#c25e00]'
              }`}
            >
              <div className="relative z-10 flex items-center gap-4">
                {nextLabel}
                <svg
                  className={`w-4 h-4 transition-transform ${!nextDisabled && 'group-hover:translate-x-1'}`}
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

export default SplitScreenLayout;
