import React from 'react';
import { SplitScreenLayout } from '../layout/SplitScreenLayout';
import type { QuestionnaireConfig } from '../../../types/questionnaire';

interface DomainIntroScreenProps {
  domain: QuestionnaireConfig;
  domainIndex: number;
  totalDomains: number;
  onContinue: () => void;
  onBack: () => void;
}

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'erm-candidate-profile':
    'Enterprise Risk Management frameworks, methodologies, and your experience with risk identification, assessment, and mitigation strategies.',
  'fs-risk-candidate-profile':
    'Financial Services risk management requires specialized knowledge of regulatory frameworks, capital requirements, and sector-specific risk types.',
  'ia-candidate-profile':
    'Internal Audit requires expertise in audit planning, execution, and reporting. This section explores your experience with audit methodologies, standards, and technology.',
  'ic-candidate-profile':
    'Internal Controls focuses on control design, implementation, and testing. This section assesses your knowledge of control frameworks and practical experience.',
  'bcm-candidate-profile':
    'Business Continuity Management covers crisis management, disaster recovery, and operational resilience.',
  'esg-sustainability-candidate-profile':
    'ESG and Sustainability roles require knowledge of environmental, social, and governance frameworks.',
  'fs-compliance-candidate-profile':
    'Financial Services Compliance requires deep knowledge of regulatory requirements, conduct risk, and compliance monitoring.',
};

export function DomainIntroScreen({
  domain,
  domainIndex,
  totalDomains,
  onContinue,
  onBack,
}: DomainIntroScreenProps) {
  const description = DOMAIN_DESCRIPTIONS[domain.id] ||
    `This section covers your technical expertise in ${domain.displayName}.`;

  return (
    <SplitScreenLayout
      title={domain.displayName}
      description={description}
      currentStage="skills"
      onBack={onBack}
      onNext={onContinue}
      nextLabel={`Begin ${domain.shortName}`}
    >
      <div className="space-y-12">
        {/* Domain indicator */}
        <div className="flex items-center gap-4">
          <span className="font-technical text-[#c25e00] text-sm">
            {(domainIndex + 1).toString().padStart(2, '0')}
          </span>
          <div className="h-[1px] bg-[#0f241d]/20 flex-1" />
          <span className="font-technical text-xs text-[#0f241d]/40 uppercase tracking-widest">
            Technical Profile {domainIndex + 1} of {totalDomains}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-[#e0ddd5]/30 border border-[#0f241d]/10">
            <p className="font-editorial text-4xl text-[#0f241d] mb-2">
              {domain.questionCount ?? '~100'}
            </p>
            <p className="font-technical text-xs text-[#0f241d]/50 uppercase tracking-widest">
              Questions
            </p>
          </div>
          <div className="p-6 bg-[#e0ddd5]/30 border border-[#0f241d]/10">
            <p className="font-editorial text-4xl text-[#0f241d] mb-2">
              {domain.sectionCount ?? '~15'}
            </p>
            <p className="font-technical text-xs text-[#0f241d]/50 uppercase tracking-widest">
              Sections
            </p>
          </div>
        </div>

        {/* Time Estimate */}
        <div className="flex items-center gap-4 p-4 border-l-2 border-[#c25e00] bg-[#e0ddd5]/30">
          <svg className="w-5 h-5 text-[#c25e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-technical text-sm text-[#0f241d]/70">
            Estimated time: {Math.round((domain.questionCount ?? 100) * 0.3)}-{Math.round((domain.questionCount ?? 100) * 0.5)} minutes
          </span>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <h3 className="font-technical text-xs uppercase tracking-widest text-[#0f241d]/40">
            Tips for This Section
          </h3>
          <ul className="space-y-3">
            {[
              'Rate your proficiency honestly - we value authentic self-assessment',
              '"0 - No Experience" is perfectly acceptable for areas outside your expertise',
              'Your progress is saved automatically as you go',
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#c25e00] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-technical text-sm text-[#0f241d]/70">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SplitScreenLayout>
  );
}

export default DomainIntroScreen;
