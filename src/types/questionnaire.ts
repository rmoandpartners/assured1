// TypeScript interfaces for the questionnaire system

// ============================================
// Question Types
// ============================================

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'slider'
  | 'file'
  | 'heading'
  | 'display'
  | 'system_proficiency'
  | 'scenario'
  | 'choice'           // Single-select rendered as button boxes
  | 'career_history';  // Multi-entry career history table

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

// Conditional display logic
export interface ConditionalOnValues {
  field: string;
  values: string[];
}

export interface ConditionalOnContains {
  field: string;
  contains: string[];
}

export interface ConditionalOnHasValue {
  field: string;
  hasValue: boolean;
}

export type ConditionalOn = ConditionalOnValues | ConditionalOnContains | ConditionalOnHasValue;

// Mirroring for candidate-role matching
export interface MirrorsRole {
  questionId: string;
  matchType: 'minimum' | 'importance' | 'compatibility' | 'overlap' | 'exact' | 'range' | 'eligibility' | string;
}

// Proficiency definitions for slider questions
export interface ProficiencyDefinitions {
  [level: string]: string;
}

// Scenario question types (for bipolar assessment scales)
export interface ScenarioContext {
  context: string;
  prompt: string;
}

export interface ScenarioOption {
  label: string;
  description: string;
}

export interface ScenarioScale {
  min: number;
  max: number;
  labels: {
    [key: string]: string;
  };
}

// Career history entry for professional experience
export interface CareerEntry {
  id: string;
  companyName: string;
  industry: string;
  industryOther?: string;  // If industry === 'other'
  jobTitle: string;
  function: string;  // 'erm' | 'ia' | 'ic' | 'bcm' | 'esg' | 'compliance' | 'other'
  functionOther?: string;  // If function === 'other'
  startMonth: string;
  startYear: string;
  endMonth: string | null;
  endYear: string | null;
  isCurrent: boolean;
}

// Base question interface
export interface Question {
  id: string;
  question?: string;
  description?: string;  // Context/explanation for the question (especially skills)
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRules;
  options?: SelectOption[] | string[];
  conditionalOn?: ConditionalOn;
  mirrorsRole?: MirrorsRole | MirrorsRole[];
  // Slider-specific
  min?: number;
  max?: number;
  defaultValue?: number;
  proficiencyLevels?: ProficiencyDefinitions;      // Short labels (e.g., "Developing", "Proficient")
  proficiencyDefinitions?: ProficiencyDefinitions; // Detailed descriptions
  // File-specific
  accept?: string;
  maxSize?: number;
  // Checkbox-specific
  checkboxLabel?: string;
  // Scenario-specific (bipolar assessment questions)
  scenario?: ScenarioContext;
  optionA?: ScenarioOption;
  optionB?: ScenarioOption;
  scale?: ScenarioScale;
  // Career history-specific
  minEntries?: number;
  maxEntries?: number;
  industryOptions?: SelectOption[];
  functionOptions?: SelectOption[];
  // Computed/normalized field (question text as label for UI)
  label: string;
}

// ============================================
// Section & Questionnaire Structure
// ============================================

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: Question[];
  // For FS top-up sections
  fsOnly?: boolean;
}

export interface QuestionnaireMetadata {
  id: string;
  title: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  mirrorProfile?: string;
  totalQuestions?: number;
  totalSections?: number;
  estimatedCompletionMinutes?: number;
}

export interface QuestionnaireData {
  questionnaire: QuestionnaireMetadata & {
    sections: Section[];
  };
}

// ============================================
// Wizard State Types
// ============================================

export type Sector = 'corporate' | 'financial_services' | 'both' | null;

export type RoleFunction =
  | 'risk_management'
  | 'internal_audit'
  | 'internal_controls'
  | 'bcm_resilience'
  | 'sustainability_esg'
  | 'compliance';

export type NavigationMode = 'initial' | 'edit' | 'review';

export type QuestionnaireStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuestionResponse {
  value: unknown;
  timestamp: string;
  isValid: boolean;
  validationErrors?: string[];
}

export interface QuestionnaireResponses {
  [questionId: string]: QuestionResponse;
}

export interface QuestionnaireProgress {
  totalQuestions: number;
  answeredQuestions: number;
  requiredQuestions: number;
  answeredRequiredQuestions: number;
  percentComplete: number;
  status: QuestionnaireStatus;
  sections: {
    [sectionId: string]: SectionProgress;
  };
}

export interface SectionProgress {
  sectionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  requiredQuestions: number;
  answeredRequiredQuestions: number;
  isComplete: boolean;
}

export interface NavigationState {
  currentQuestionnaireId: string;
  currentSectionId: string;
  currentScreenIndex: number;
  mode: NavigationMode;
}

export interface WizardMeta {
  startedAt: string;
  lastSavedAt: string;
  completedAt?: string;
  version: string;
}

export interface WizardState {
  candidateId: string;
  sector: Sector;
  selectedRoleFunctions: RoleFunction[];
  responses: {
    [questionnaireId: string]: QuestionnaireResponses;
  };
  navigation: NavigationState;
  progress: {
    [questionnaireId: string]: QuestionnaireProgress;
  };
  meta: WizardMeta;
}

// ============================================
// Screen Chunking Types
// ============================================

export interface Screen {
  id: string;
  questionnaireId: string;
  sectionId: string;
  sectionTitle: string;
  screenIndex: number;
  totalScreensInSection: number;
  questions: Question[];
}

export interface ProcessedSection {
  section: Section;
  screens: Screen[];
  isVisible: boolean;
}

export interface ProcessedQuestionnaire {
  questionnaire: QuestionnaireMetadata;
  sections: ProcessedSection[];
  totalScreens: number;
}

// ============================================
// Questionnaire Registry Types
// ============================================

export interface QuestionnaireConfig {
  id: string;
  jsonFile: string;
  displayName: string;
  shortName: string;
  isCore: boolean;
  triggerRoleFunctions: RoleFunction[];
  requiresSector?: 'financial_services' | 'both';
  hasFsTopUp?: boolean;
  fsTopUpSectionId?: string;
  order: number;
  // Stats for display
  questionCount?: number;
  sectionCount?: number;
}

// ============================================
// Action Types for Reducer
// ============================================

export type WizardAction =
  | { type: 'SET_ANSWER'; payload: { questionnaireId: string; questionId: string; value: unknown } }
  | { type: 'CLEAR_ANSWER'; payload: { questionnaireId: string; questionId: string } }
  | { type: 'SET_SECTOR'; payload: Sector }
  | { type: 'SET_ROLE_FUNCTIONS'; payload: RoleFunction[] }
  | { type: 'NAVIGATE_TO_QUESTIONNAIRE'; payload: string }
  | { type: 'NAVIGATE_TO_SECTION'; payload: string }
  | { type: 'NAVIGATE_TO_SCREEN'; payload: number }
  | { type: 'SET_MODE'; payload: NavigationMode }
  | { type: 'HYDRATE_STATE'; payload: WizardState }
  | { type: 'UPDATE_PROGRESS'; payload: { questionnaireId: string; progress: QuestionnaireProgress } }
  | { type: 'SET_META'; payload: Partial<WizardMeta> }
  | { type: 'CLEAR_ALL' };

// ============================================
// Context Value Type
// ============================================

export interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;

  // Computed values
  activeQuestionnaires: QuestionnaireConfig[];
  currentQuestionnaire: ProcessedQuestionnaire | null;
  currentScreen: Screen | null;
  visibleQuestions: Question[];
  overallProgress: number;

  // Helper functions
  setAnswer: (questionnaireId: string, questionId: string, value: unknown) => void;
  getAnswer: (questionnaireId: string, questionId: string) => unknown;
  isQuestionVisible: (question: Question) => boolean;
  validateScreen: () => { isValid: boolean; errors: Record<string, string> };

  // Validation
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  // Navigation
  canGoNext: boolean;
  canGoPrevious: boolean;
  goNext: () => boolean;
  goPrevious: () => boolean;
  goToSection: (sectionId: string) => void;
  goToQuestionnaire: (questionnaireId: string) => void;
  navigateToQuestionnaire: (questionnaireId: string, sectionId?: string) => void;

  // Persistence
  saveProgress: () => Promise<void>;
  hasSavedProgress: boolean;
}
