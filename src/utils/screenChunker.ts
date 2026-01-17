import type {
  Question,
  Section,
  Screen,
  ProcessedSection,
  ProcessedQuestionnaire,
  QuestionnaireData,
  Sector,
} from '../types/questionnaire';
import { getQuestionnaireConfig, isSectionVisible } from './questionnaireRegistry';

// ============================================
// Configuration
// ============================================

interface ChunkingConfig {
  idealQuestionsPerScreen: number;
  minQuestionsPerScreen: number;
  maxQuestionsPerScreen: number;
  heavyQuestionWeight: number;
}

const DEFAULT_CONFIG: ChunkingConfig = {
  idealQuestionsPerScreen: 5,
  minQuestionsPerScreen: 3,
  maxQuestionsPerScreen: 7,
  heavyQuestionWeight: 1.5,
};

// Question types that take more screen real estate
const HEAVY_QUESTION_TYPES = ['textarea', 'multiselect', 'slider', 'system_proficiency'];

// ============================================
// Chunking Functions
// ============================================

/**
 * Get the visual weight of a question based on its type
 */
function getQuestionWeight(question: Question): number {
  if (HEAVY_QUESTION_TYPES.includes(question.type)) {
    return DEFAULT_CONFIG.heavyQuestionWeight;
  }
  // Heading/display types don't count towards question limits
  if (question.type === 'heading' || question.type === 'display') {
    return 0.3;
  }
  return 1;
}

/**
 * Find all questions that depend on a given question (conditionalOn.field === questionId)
 */
function findConditionalChildren(
  questionId: string,
  allQuestions: Question[]
): Question[] {
  return allQuestions.filter(
    (q) => q.conditionalOn && q.conditionalOn.field === questionId
  );
}

/**
 * Group a question with its immediate conditional children
 */
function groupWithChildren(
  question: Question,
  allQuestions: Question[]
): Question[] {
  const group = [question];
  const children = findConditionalChildren(question.id, allQuestions);
  group.push(...children);
  return group;
}

/**
 * Chunk a section's questions into screens
 */
export function chunkSection(
  section: Section,
  questionnaireId: string,
  config: ChunkingConfig = DEFAULT_CONFIG
): Screen[] {
  const screens: Screen[] = [];
  let currentScreenQuestions: Question[] = [];
  let currentWeight = 0;
  let screenIndex = 0;

  const questions = section.questions;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    // Heading type always starts a new screen (if current has content)
    if (question.type === 'heading' && currentScreenQuestions.length > 0) {
      screens.push(createScreen(
        currentScreenQuestions,
        questionnaireId,
        section,
        screenIndex
      ));
      screenIndex++;
      currentScreenQuestions = [question];
      currentWeight = getQuestionWeight(question);
      continue;
    }

    // Skip if this question is a conditional child (will be added with parent)
    if (question.conditionalOn) {
      // Check if parent is already in current screen
      const parentInScreen = currentScreenQuestions.some(
        (q) => q.id === question.conditionalOn?.field
      );
      if (!parentInScreen) {
        // Parent not in current screen, this will be handled when parent is processed
        continue;
      }
    }

    // Get the question with its conditional children
    const questionGroup = groupWithChildren(question, questions);
    const groupWeight = questionGroup.reduce((sum, q) => sum + getQuestionWeight(q), 0);

    // Check if adding this group exceeds max
    if (
      currentWeight + groupWeight > config.maxQuestionsPerScreen * 1.2 &&
      currentScreenQuestions.length >= config.minQuestionsPerScreen
    ) {
      // Start a new screen
      screens.push(createScreen(
        currentScreenQuestions,
        questionnaireId,
        section,
        screenIndex
      ));
      screenIndex++;
      currentScreenQuestions = [];
      currentWeight = 0;
    }

    // Add question group to current screen
    for (const q of questionGroup) {
      // Avoid duplicates (conditional children might already be in the list)
      if (!currentScreenQuestions.some((existing) => existing.id === q.id)) {
        currentScreenQuestions.push(q);
        currentWeight += getQuestionWeight(q);
      }
    }

    // If we've reached ideal size and are at a good breaking point, consider new screen
    if (
      currentWeight >= config.idealQuestionsPerScreen &&
      currentScreenQuestions.length >= config.minQuestionsPerScreen &&
      i < questions.length - 1 // Not at the end
    ) {
      // Look ahead - if next question is a heading, let it trigger new screen
      const nextQuestion = questions[i + 1];
      if (nextQuestion && nextQuestion.type !== 'heading') {
        // Check if we should split here
        const nextGroup = groupWithChildren(nextQuestion, questions);
        const nextGroupWeight = nextGroup.reduce((sum, q) => sum + getQuestionWeight(q), 0);

        if (currentWeight + nextGroupWeight > config.maxQuestionsPerScreen) {
          screens.push(createScreen(
            currentScreenQuestions,
            questionnaireId,
            section,
            screenIndex
          ));
          screenIndex++;
          currentScreenQuestions = [];
          currentWeight = 0;
        }
      }
    }
  }

  // Add remaining questions as final screen
  if (currentScreenQuestions.length > 0) {
    screens.push(createScreen(
      currentScreenQuestions,
      questionnaireId,
      section,
      screenIndex
    ));
  }

  // Update totalScreensInSection for all screens
  const totalScreens = screens.length;
  for (const screen of screens) {
    screen.totalScreensInSection = totalScreens;
  }

  return screens;
}

/**
 * Create a screen object
 */
function createScreen(
  questions: Question[],
  questionnaireId: string,
  section: Section,
  screenIndex: number
): Screen {
  return {
    id: `${questionnaireId}_${section.id}_screen_${screenIndex}`,
    questionnaireId,
    sectionId: section.id,
    sectionTitle: section.title,
    screenIndex,
    totalScreensInSection: 0, // Will be updated after all screens are created
    questions,
  };
}

/**
 * Normalize a question by adding the label field from the question field
 */
function normalizeQuestion(question: Question): Question {
  return {
    ...question,
    label: question.label || question.question,
  };
}

/**
 * Process a section into screens with visibility
 */
export function processSection(
  section: Section,
  questionnaireId: string,
  sector: Sector,
  config: ChunkingConfig = DEFAULT_CONFIG
): ProcessedSection {
  const questionnaireConfig = getQuestionnaireConfig(questionnaireId);
  const isVisible = questionnaireConfig
    ? isSectionVisible(section.id, questionnaireConfig, sector)
    : true;

  // Normalize questions to add label field
  const normalizedSection: Section = {
    ...section,
    questions: section.questions.map(normalizeQuestion),
  };

  const screens = chunkSection(normalizedSection, questionnaireId, config);

  return {
    section: normalizedSection,
    screens,
    isVisible,
  };
}

/**
 * Process an entire questionnaire into screens
 */
export function processQuestionnaire(
  data: QuestionnaireData,
  sector: Sector,
  config: ChunkingConfig = DEFAULT_CONFIG
): ProcessedQuestionnaire {
  const { questionnaire } = data;
  const questionnaireId = questionnaire.id;

  const processedSections: ProcessedSection[] = questionnaire.sections.map((section) =>
    processSection(section, questionnaireId, sector, config)
  );

  const totalScreens = processedSections.reduce(
    (sum, ps) => sum + (ps.isVisible ? ps.screens.length : 0),
    0
  );

  return {
    questionnaire: {
      id: questionnaire.id,
      title: questionnaire.title,
      description: questionnaire.description,
      version: questionnaire.version,
      createdAt: questionnaire.createdAt,
      updatedAt: questionnaire.updatedAt,
      mirrorProfile: questionnaire.mirrorProfile,
      totalQuestions: questionnaire.totalQuestions,
      totalSections: questionnaire.totalSections,
      estimatedCompletionMinutes: questionnaire.estimatedCompletionMinutes,
    },
    sections: processedSections,
    totalScreens,
  };
}

/**
 * Get the total number of screens across all active questionnaires
 */
export function getTotalScreenCount(
  processedQuestionnaires: ProcessedQuestionnaire[]
): number {
  return processedQuestionnaires.reduce((sum, pq) => sum + pq.totalScreens, 0);
}

/**
 * Get a flat list of all visible screens in order
 */
export function getAllVisibleScreens(
  processedQuestionnaires: ProcessedQuestionnaire[]
): Screen[] {
  const screens: Screen[] = [];

  for (const pq of processedQuestionnaires) {
    for (const section of pq.sections) {
      if (section.isVisible) {
        screens.push(...section.screens);
      }
    }
  }

  return screens;
}

/**
 * Find the index of a screen in the overall flow
 */
export function getScreenGlobalIndex(
  screen: Screen,
  processedQuestionnaires: ProcessedQuestionnaire[]
): number {
  const allScreens = getAllVisibleScreens(processedQuestionnaires);
  return allScreens.findIndex((s) => s.id === screen.id);
}

/**
 * Get screen by global index
 */
export function getScreenByGlobalIndex(
  index: number,
  processedQuestionnaires: ProcessedQuestionnaire[]
): Screen | null {
  const allScreens = getAllVisibleScreens(processedQuestionnaires);
  return allScreens[index] || null;
}

/**
 * Get estimated completion time for a questionnaire
 */
export function estimateCompletionTime(
  processedQuestionnaire: ProcessedQuestionnaire
): number {
  // Estimate ~30 seconds per question on average
  const totalQuestions = processedQuestionnaire.sections
    .filter((s) => s.isVisible)
    .reduce((sum, s) => {
      return sum + s.section.questions.length;
    }, 0);

  return Math.ceil(totalQuestions * 0.5); // minutes
}
