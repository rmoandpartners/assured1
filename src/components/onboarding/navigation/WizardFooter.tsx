import React, { useState } from 'react';
import { useWizard } from '../WizardProvider';
import { formatRelativeTime } from '../../../utils/persistence';

interface WizardFooterProps {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSaveAndExit: () => Promise<void>;
}

export function WizardFooter({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onSaveAndExit,
}: WizardFooterProps) {
  const { state, validateScreen } = useWizard();
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleNext = () => {
    const { isValid, errors } = validateScreen();

    if (!isValid) {
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      const element = document.getElementById(`question-${firstErrorId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onNext();
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      await onSaveAndExit();
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <footer className="sticky bottom-0 z-40 bg-[#f2f0e9]/95 backdrop-blur-sm border-t border-[#e0ddd5]">
      <div className="px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Save status */}
          <div className="flex items-center gap-3 text-sm">
            {showSaveConfirmation ? (
              <span className="flex items-center gap-2 text-[#0f241d]">
                <svg className="w-4 h-4 text-[#c25e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Progress saved
              </span>
            ) : state.meta.lastSavedAt ? (
              <span className="text-[#0f241d]/50">
                Last saved: {formatRelativeTime(state.meta.lastSavedAt)}
              </span>
            ) : null}

            <button
              onClick={handleSaveAndExit}
              disabled={isSaving}
              className="font-technical text-sm font-medium text-[#0f241d]/60 hover:text-[#c25e00] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Continue Later'}
            </button>
          </div>

          {/* Right: Navigation buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="inline-flex items-center gap-2 px-6 py-3 font-technical font-semibold text-sm text-[#0f241d]/70 bg-[#e0ddd5] hover:bg-[#0f241d]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="inline-flex items-center gap-2 px-6 py-3 font-technical font-semibold text-sm bg-[#0f241d] text-[#f2f0e9] hover:bg-[#c25e00] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default WizardFooter;
