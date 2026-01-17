import type { QuestionnaireConfig, RoleFunction, Sector } from '../types/questionnaire';

/**
 * Registry of all questionnaire configurations
 * Maps role functions and sectors to specific questionnaire files
 */
export const QUESTIONNAIRE_REGISTRY: QuestionnaireConfig[] = [
  // Core profile - always required
  {
    id: 'candidate-profile',
    jsonFile: 'candidate-profile.json',
    displayName: 'General Profile',
    shortName: 'Profile',
    isCore: true,
    triggerRoleFunctions: [], // Always shown
    order: 0,
    questionCount: 213,
    sectionCount: 31,
  },

  // Enterprise Risk Management - for risk_management function (all sectors)
  {
    id: 'erm-candidate-profile',
    jsonFile: 'erm-candidate-profile.json',
    displayName: 'Enterprise Risk Management',
    shortName: 'ERM',
    isCore: false,
    triggerRoleFunctions: ['risk_management'],
    order: 1,
    questionCount: 140,
    sectionCount: 17,
  },

  // FS Risk - for risk_management + FS sector (in addition to ERM)
  {
    id: 'fs-risk-candidate-profile',
    jsonFile: 'fs-risk-candidate-profile.json',
    displayName: 'Financial Services Risk',
    shortName: 'FS Risk',
    isCore: false,
    triggerRoleFunctions: ['risk_management'],
    requiresSector: 'financial_services',
    order: 2,
    questionCount: 150,
    sectionCount: 17,
  },

  // Internal Audit - has FS top-up section
  {
    id: 'ia-candidate-profile',
    jsonFile: 'ia-candidate-profile.json',
    displayName: 'Internal Audit',
    shortName: 'IA',
    isCore: false,
    triggerRoleFunctions: ['internal_audit'],
    hasFsTopUp: true,
    fsTopUpSectionId: 'fs_internal_audit', // Section 18
    order: 3,
    questionCount: 126,
    sectionCount: 18,
  },

  // Internal Controls - has FS top-up section
  {
    id: 'ic-candidate-profile',
    jsonFile: 'ic-candidate-profile.json',
    displayName: 'Internal Controls',
    shortName: 'IC',
    isCore: false,
    triggerRoleFunctions: ['internal_controls'],
    hasFsTopUp: true,
    fsTopUpSectionId: 'fs_internal_controls', // Section 18
    order: 4,
    questionCount: 126,
    sectionCount: 18,
  },

  // Business Continuity Management - has FS top-up section
  {
    id: 'bcm-candidate-profile',
    jsonFile: 'bcm-candidate-profile.json',
    displayName: 'Business Continuity & Resilience',
    shortName: 'BCM',
    isCore: false,
    triggerRoleFunctions: ['bcm_resilience'],
    hasFsTopUp: true,
    fsTopUpSectionId: 'fs_operational_resilience', // Section 18
    order: 5,
    questionCount: 139,
    sectionCount: 18,
  },

  // ESG & Sustainability - has FS top-up section
  {
    id: 'esg-sustainability-candidate-profile',
    jsonFile: 'esg-sustainability-candidate-profile.json',
    displayName: 'ESG & Sustainability',
    shortName: 'ESG',
    isCore: false,
    triggerRoleFunctions: ['sustainability_esg'],
    hasFsTopUp: true,
    fsTopUpSectionId: 'fs_sustainable_finance', // Section 20
    order: 6,
    questionCount: 174,
    sectionCount: 20,
  },

  // FS Compliance - FS sector only
  {
    id: 'fs-compliance-candidate-profile',
    jsonFile: 'fs-compliance-candidate-profile.json',
    displayName: 'Financial Services Compliance',
    shortName: 'FS Compliance',
    isCore: false,
    triggerRoleFunctions: ['compliance'],
    requiresSector: 'financial_services',
    order: 7,
    questionCount: 170,
    sectionCount: 17,
  },
];

/**
 * Get the list of active questionnaires based on sector and role function selections
 */
export function getActiveQuestionnaires(
  sector: Sector,
  selectedRoleFunctions: RoleFunction[]
): QuestionnaireConfig[] {
  const isFsSector = sector === 'financial_services' || sector === 'both';

  return QUESTIONNAIRE_REGISTRY.filter((config) => {
    // Core profile is always included
    if (config.isCore) {
      return true;
    }

    // Check if any selected role function triggers this questionnaire
    const hasMatchingRoleFunction = config.triggerRoleFunctions.some((rf) =>
      selectedRoleFunctions.includes(rf)
    );

    if (!hasMatchingRoleFunction) {
      return false;
    }

    // Check sector requirement
    if (config.requiresSector === 'financial_services' && !isFsSector) {
      return false;
    }

    return true;
  }).sort((a, b) => a.order - b.order);
}

/**
 * Check if a section should be visible based on sector and config
 */
export function isSectionVisible(
  sectionId: string,
  questionnaireConfig: QuestionnaireConfig,
  sector: Sector
): boolean {
  const isFsSector = sector === 'financial_services' || sector === 'both';

  // If this is the FS top-up section, only show for FS sector
  if (questionnaireConfig.hasFsTopUp && questionnaireConfig.fsTopUpSectionId === sectionId) {
    return isFsSector;
  }

  // All other sections are visible
  return true;
}

/**
 * Get questionnaire config by ID
 */
export function getQuestionnaireConfig(id: string): QuestionnaireConfig | undefined {
  return QUESTIONNAIRE_REGISTRY.find((config) => config.id === id);
}

/**
 * Get the display order of questionnaires
 */
export function getQuestionnaireOrder(activeQuestionnaires: QuestionnaireConfig[]): string[] {
  return activeQuestionnaires
    .sort((a, b) => a.order - b.order)
    .map((config) => config.id);
}

/**
 * Role function display labels
 */
export const ROLE_FUNCTION_LABELS: Record<RoleFunction, string> = {
  risk_management: 'Risk Management / Enterprise Risk Management',
  internal_audit: 'Internal Audit',
  internal_controls: 'Internal Controls / SOX',
  bcm_resilience: 'Business Continuity Management / Business Resilience',
  sustainability_esg: 'Sustainability / ESG',
  compliance: 'Compliance',
};

/**
 * Role function descriptions for the selection screen
 */
export const ROLE_FUNCTION_DESCRIPTIONS: Record<RoleFunction, string> = {
  risk_management: 'Enterprise risk frameworks, risk appetite, KRIs, scenario analysis',
  internal_audit: 'Audit methodology, standards, IT audit, SOX compliance',
  internal_controls: 'COSO framework, control testing, deficiency management, ICFR',
  bcm_resilience: 'BIA, crisis management, operational resilience, recovery planning',
  sustainability_esg: 'ESG reporting, TCFD, climate risk, sustainability strategy',
  compliance: 'Regulatory compliance, SM&CR, AML, conduct risk (Financial Services)',
};

/**
 * Sector display labels
 */
export const SECTOR_LABELS: Record<Exclude<Sector, null>, string> = {
  corporate: 'Corporate / Non-Financial Services',
  financial_services: 'Financial Services',
  both: 'Both Corporate and Financial Services',
};

/**
 * Sector descriptions
 */
export const SECTOR_DESCRIPTIONS: Record<Exclude<Sector, null>, string> = {
  corporate: 'Roles in non-regulated industries: corporates, consulting, Big 4, public sector',
  financial_services: 'Roles in regulated financial services: banking, insurance, asset management, fintech',
  both: 'Open to opportunities across all sectors',
};
