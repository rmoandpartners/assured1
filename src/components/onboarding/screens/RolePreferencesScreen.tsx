import React from 'react';
import { useWizard, useSetSector, useSetRoleFunctions } from '../WizardProvider';
import { SplitScreenLayout } from '../layout/SplitScreenLayout';
import type { Sector, RoleFunction } from '../../../types/questionnaire';

interface RolePreferencesScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

const SECTORS: { value: Exclude<Sector, null>; label: string; description: string }[] = [
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Non-FS industries'
  },
  {
    value: 'financial_services',
    label: 'Financial Services',
    description: 'Banking, insurance, asset management'
  },
  {
    value: 'both',
    label: 'Open to both',
    description: ''
  },
];

const ROLE_FUNCTIONS: { value: RoleFunction; label: string; description: string; fsOnly?: boolean }[] = [
  {
    value: 'risk_management',
    label: 'Risk Management',
    description: 'ERM, operational, credit, market'
  },
  {
    value: 'internal_audit',
    label: 'Internal Audit',
    description: 'Planning, execution, reporting'
  },
  {
    value: 'internal_controls',
    label: 'Internal Controls',
    description: 'SOX, control design, testing'
  },
  {
    value: 'bcm_resilience',
    label: 'Business Continuity',
    description: 'BCM, DR, resilience'
  },
  {
    value: 'sustainability_esg',
    label: 'Sustainability & ESG',
    description: 'ESG reporting, climate risk'
  },
  {
    value: 'compliance',
    label: 'Compliance',
    description: 'FS sector only',
    fsOnly: true
  },
];

export function RolePreferencesScreen({ onContinue, onBack }: RolePreferencesScreenProps) {
  const { state } = useWizard();
  const setSector = useSetSector();
  const setRoleFunctions = useSetRoleFunctions();

  const handleSectorSelect = (sector: Exclude<Sector, null>) => {
    setSector(sector);
    // Clear compliance if switching away from FS
    if (sector === 'corporate' && state.selectedRoleFunctions.includes('compliance')) {
      setRoleFunctions(state.selectedRoleFunctions.filter(rf => rf !== 'compliance'));
    }
  };

  const handleRoleFunctionToggle = (roleFunction: RoleFunction) => {
    const current = state.selectedRoleFunctions;
    if (current.includes(roleFunction)) {
      setRoleFunctions(current.filter((rf) => rf !== roleFunction));
    } else {
      setRoleFunctions([...current, roleFunction]);
    }
  };

  const handleContinue = () => {
    if (state.sector && state.selectedRoleFunctions.length > 0) {
      onContinue();
    }
  };

  const isComplianceAvailable = state.sector === 'financial_services' || state.sector === 'both';
  const canContinue = state.sector && state.selectedRoleFunctions.length > 0;

  return (
    <SplitScreenLayout
      title="Role preferences."
      description="Help us understand what you're looking for so we can tailor your experience."
      currentStage="preferences"
      onBack={onBack}
      onNext={handleContinue}
      nextLabel="Continue"
      nextDisabled={!canContinue}
    >
      <div className="flex flex-col justify-center min-h-[40vh] lg:min-h-0 space-y-10">
        {/* Sector Selection */}
        <div>
          <div className="mb-4">
            <h3 className="font-editorial text-xl text-[#0f241d] mb-1">Which sector?</h3>
            <p className="font-technical text-sm text-[#0f241d]/40">
              FS roles include some additional regulatory questions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map(({ value, label, description }) => {
              const isSelected = state.sector === value;
              return (
                <button
                  key={value}
                  onClick={() => handleSectorSelect(value)}
                  className={`px-5 py-2.5 rounded-full border font-technical text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-[#0f241d] bg-[#0f241d] text-[#f2f0e9]'
                      : 'border-[#0f241d]/20 hover:border-[#0f241d] text-[#0f241d]'
                  }`}
                >
                  {label}
                  {description && (
                    <span className={`ml-1.5 ${isSelected ? 'text-[#f2f0e9]/50' : 'text-[#0f241d]/40'}`}>
                      · {description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Functions Selection */}
        <div>
          <div className="mb-4">
            <h3 className="font-editorial text-xl text-[#0f241d] mb-1">Which functions?</h3>
            <p className="font-technical text-sm text-[#0f241d]/40">
              Select all that apply
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLE_FUNCTIONS.map(({ value, label, description, fsOnly }) => {
              const isSelected = state.selectedRoleFunctions.includes(value);
              const isDisabled = fsOnly && !isComplianceAvailable;

              return (
                <button
                  key={value}
                  onClick={() => !isDisabled && handleRoleFunctionToggle(value)}
                  disabled={isDisabled}
                  className={`px-5 py-2.5 rounded-full border font-technical text-sm transition-all duration-200 ${
                    isDisabled
                      ? 'border-[#0f241d]/10 text-[#0f241d]/20 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#0f241d] bg-[#0f241d] text-[#f2f0e9]'
                      : 'border-[#0f241d]/20 hover:border-[#0f241d] text-[#0f241d]'
                  }`}
                >
                  {label}
                  {isDisabled && (
                    <span className="ml-1.5 text-[#0f241d]/20">· {description}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </SplitScreenLayout>
  );
}

export default RolePreferencesScreen;
