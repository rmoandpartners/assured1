import React from 'react';
import { useWizard, useSetSector } from '../WizardProvider';
import { SplitScreenLayout } from '../layout/SplitScreenLayout';
import type { Sector } from '../../../types/questionnaire';

interface SectorSelectionScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

const SECTORS: { value: Exclude<Sector, null>; label: string }[] = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'both', label: 'Both' },
];

export function SectorSelectionScreen({ onContinue, onBack }: SectorSelectionScreenProps) {
  const { state } = useWizard();
  const setSector = useSetSector();

  const handleSelect = (sector: Exclude<Sector, null>) => {
    setSector(sector);
  };

  const handleContinue = () => {
    if (state.sector) {
      onContinue();
    }
  };

  return (
    <SplitScreenLayout
      title="Target sector."
      description="Financial Services includes additional regulatory questions."
      onBack={onBack}
      onNext={handleContinue}
      nextLabel="Continue"
    >
      <div className="flex flex-col justify-center min-h-[40vh] lg:min-h-0">
        <div className="space-y-3">
          {SECTORS.map(({ value, label }) => {
            const isSelected = state.sector === value;

            return (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                className={`w-full text-left px-6 py-5 border-b transition-all duration-300 ${
                  isSelected
                    ? 'border-[#0f241d] bg-[#0f241d] text-[#f2f0e9]'
                    : 'border-[#0f241d]/10 hover:border-[#0f241d]/30 text-[#0f241d]'
                }`}
              >
                <span className="font-editorial text-2xl">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </SplitScreenLayout>
  );
}

export default SectorSelectionScreen;
