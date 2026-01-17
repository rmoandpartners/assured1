import React from 'react';
import { useWizard, useSetRoleFunctions } from '../WizardProvider';
import { SplitScreenLayout } from '../layout/SplitScreenLayout';
import type { RoleFunction } from '../../../types/questionnaire';

interface RoleFunctionsScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

const ROLE_FUNCTIONS: { value: RoleFunction; label: string }[] = [
  { value: 'risk_management', label: 'Risk Management' },
  { value: 'internal_audit', label: 'Internal Audit' },
  { value: 'internal_controls', label: 'Internal Controls' },
  { value: 'bcm_resilience', label: 'Business Continuity' },
  { value: 'sustainability_esg', label: 'Sustainability & ESG' },
  { value: 'compliance', label: 'Compliance' },
];

export function RoleFunctionsScreen({ onContinue, onBack }: RoleFunctionsScreenProps) {
  const { state } = useWizard();
  const setRoleFunctions = useSetRoleFunctions();

  const handleToggle = (roleFunction: RoleFunction) => {
    const current = state.selectedRoleFunctions;
    if (current.includes(roleFunction)) {
      setRoleFunctions(current.filter((rf) => rf !== roleFunction));
    } else {
      setRoleFunctions([...current, roleFunction]);
    }
  };

  const handleContinue = () => {
    if (state.selectedRoleFunctions.length > 0) {
      onContinue();
    }
  };

  // Check if compliance is available (only for FS sector)
  const isComplianceAvailable = state.sector === 'financial_services' || state.sector === 'both';

  return (
    <SplitScreenLayout
      title="Areas of expertise."
      description="Select all that apply. This tailors your technical questions."
      onBack={onBack}
      onNext={handleContinue}
      nextLabel="Continue"
    >
      <div className="flex flex-col justify-center min-h-[40vh] lg:min-h-0">
        <div className="flex flex-wrap gap-3">
          {ROLE_FUNCTIONS.map(({ value, label }) => {
            const isSelected = state.selectedRoleFunctions.includes(value);
            const isDisabled = value === 'compliance' && !isComplianceAvailable;

            return (
              <button
                key={value}
                onClick={() => !isDisabled && handleToggle(value)}
                disabled={isDisabled}
                className={`px-5 py-3 border transition-all duration-300 font-editorial text-lg ${
                  isDisabled
                    ? 'border-[#0f241d]/10 text-[#0f241d]/20 cursor-not-allowed'
                    : isSelected
                    ? 'border-[#0f241d] bg-[#0f241d] text-[#f2f0e9]'
                    : 'border-[#0f241d]/20 hover:border-[#0f241d] text-[#0f241d]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {!isComplianceAvailable && (
          <p className="font-technical text-xs text-[#0f241d]/40 mt-8">
            Compliance requires Financial Services sector
          </p>
        )}
      </div>
    </SplitScreenLayout>
  );
}

export default RoleFunctionsScreen;
