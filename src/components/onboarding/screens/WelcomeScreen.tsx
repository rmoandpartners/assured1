import React from 'react';
import { SplitScreenLayout } from '../layout/SplitScreenLayout';

interface WelcomeScreenProps {
  onContinue: () => void;
  hasSavedProgress: boolean;
}

export function WelcomeScreen({ onContinue, hasSavedProgress }: WelcomeScreenProps) {
  return (
    <SplitScreenLayout
      title="Build your candidate profile."
      description="We place people, not profiles. This is where we learn what sets you apart."
      showBackButton={false}
      onNext={onContinue}
      nextLabel="Begin"
    >
      <div className="flex flex-col justify-center min-h-[40vh] lg:min-h-0">
        {/* Single powerful statement */}
        <p className="font-editorial text-3xl lg:text-4xl text-[#0f241d] leading-[1.3] mb-16">
          Your expertise.<br />
          Your preferences.<br />
          Your future.
        </p>

        {/* Minimal footer info */}
        <p className="font-technical text-sm text-[#0f241d]/40">
          Approximately 20 minutes · Auto-saves as you go
        </p>
      </div>
    </SplitScreenLayout>
  );
}

export default WelcomeScreen;
