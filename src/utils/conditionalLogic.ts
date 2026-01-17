import type {
  Question,
  ConditionalOn,
  QuestionnaireResponses,
  QuestionResponse,
} from '../types/questionnaire';

/**
 * Type guards for conditional types
 */
function hasValues(condition: ConditionalOn): condition is { field: string; values: string[] } {
  return 'values' in condition;
}

function hasContains(condition: ConditionalOn): condition is { field: string; contains: string[] } {
  return 'contains' in condition;
}

function hasHasValue(condition: ConditionalOn): condition is { field: string; hasValue: boolean } {
  return 'hasValue' in condition;
}

/**
 * Get the raw value from a question response
 */
function getResponseValue(response: QuestionResponse | undefined): unknown {
  return response?.value;
}

/**
 * Check if a value is considered "set" (not empty)
 */
function hasAnyValue(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
}

/**
 * Evaluate if a question should be visible based on its conditionalOn field
 *
 * @param question - The question to check visibility for
 * @param currentResponses - Responses for the current questionnaire
 * @param allResponses - All responses across all questionnaires (for cross-questionnaire dependencies)
 * @returns true if the question should be visible
 */
export function isQuestionVisible(
  question: Question,
  currentResponses: QuestionnaireResponses,
  allResponses?: Record<string, QuestionnaireResponses>
): boolean {
  // No condition = always visible
  if (!question.conditionalOn) {
    return true;
  }

  const condition = question.conditionalOn;

  // Find the field value - first check current questionnaire, then candidate-profile
  let fieldValue = getResponseValue(currentResponses[condition.field]);

  // If not found in current questionnaire, check the core candidate profile
  if (fieldValue === undefined && allResponses) {
    const candidateProfileResponses = allResponses['candidate-profile'];
    if (candidateProfileResponses) {
      fieldValue = getResponseValue(candidateProfileResponses[condition.field]);
    }
  }

  // Evaluate based on condition type
  if (hasValues(condition)) {
    // Show if field value matches any of the specified values
    if (Array.isArray(fieldValue)) {
      // If the field itself is multiselect, check for intersection
      return condition.values.some((v) => fieldValue.includes(v));
    }
    return condition.values.includes(fieldValue as string);
  }

  if (hasContains(condition)) {
    // Show if multiselect field contains any of the specified values
    if (!Array.isArray(fieldValue)) {
      return false;
    }
    return condition.contains.some((v) => fieldValue.includes(v));
  }

  if (hasHasValue(condition)) {
    // Show based on whether the field has any value
    const fieldHasValue = hasAnyValue(fieldValue);
    return condition.hasValue === fieldHasValue;
  }

  // Unknown condition type - default to visible
  return true;
}

/**
 * Filter a list of questions to only those that are visible
 */
export function filterVisibleQuestions(
  questions: Question[],
  currentResponses: QuestionnaireResponses,
  allResponses?: Record<string, QuestionnaireResponses>
): Question[] {
  return questions.filter((q) => isQuestionVisible(q, currentResponses, allResponses));
}

/**
 * Find all questions that depend on a specific field
 */
export function findDependentQuestions(
  fieldId: string,
  questions: Question[]
): Question[] {
  return questions.filter((q) => {
    if (!q.conditionalOn) {
      return false;
    }
    return q.conditionalOn.field === fieldId;
  });
}

/**
 * Get question IDs that should be cleared when a parent field changes
 * (because they become hidden)
 *
 * @param changedFieldId - The field that changed
 * @param newValue - The new value of the changed field
 * @param questions - All questions in the section/questionnaire
 * @param currentResponses - Current responses
 * @returns Array of question IDs that should be cleared
 */
export function getQuestionsToClear(
  changedFieldId: string,
  newValue: unknown,
  questions: Question[],
  currentResponses: QuestionnaireResponses,
  allResponses?: Record<string, QuestionnaireResponses>
): string[] {
  const dependentQuestions = findDependentQuestions(changedFieldId, questions);
  const toClear: string[] = [];

  // Create temporary responses with the new value
  const tempResponses: QuestionnaireResponses = {
    ...currentResponses,
    [changedFieldId]: {
      value: newValue,
      timestamp: new Date().toISOString(),
      isValid: true,
    },
  };

  for (const depQuestion of dependentQuestions) {
    const wasVisible = isQuestionVisible(depQuestion, currentResponses, allResponses);
    const willBeVisible = isQuestionVisible(depQuestion, tempResponses, allResponses);

    // If question becomes hidden, mark it for clearing
    if (wasVisible && !willBeVisible) {
      toClear.push(depQuestion.id);

      // Recursively find questions that depend on this one
      const cascadingClears = getQuestionsToClear(
        depQuestion.id,
        undefined, // Cleared value
        questions,
        tempResponses,
        allResponses
      );
      toClear.push(...cascadingClears);
    }
  }

  return [...new Set(toClear)]; // Remove duplicates
}

/**
 * Build a dependency graph for questions
 * Useful for understanding the conditional structure
 */
export function buildDependencyGraph(
  questions: Question[]
): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  for (const question of questions) {
    if (question.conditionalOn) {
      const parentId = question.conditionalOn.field;
      const existing = graph.get(parentId) || [];
      existing.push(question.id);
      graph.set(parentId, existing);
    }
  }

  return graph;
}

/**
 * Get all questions in topological order (parents before children)
 * Useful for rendering questions in the correct order for dependencies
 */
export function sortQuestionsTopologically(questions: Question[]): Question[] {
  const graph = buildDependencyGraph(questions);
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const visited = new Set<string>();
  const result: Question[] = [];

  function visit(questionId: string) {
    if (visited.has(questionId)) {
      return;
    }
    visited.add(questionId);

    // Visit all children first
    const children = graph.get(questionId) || [];
    for (const childId of children) {
      visit(childId);
    }

    const question = questionMap.get(questionId);
    if (question) {
      result.unshift(question); // Add to beginning (parent before children)
    }
  }

  // Start with questions that have no parent (no conditionalOn)
  const roots = questions.filter((q) => !q.conditionalOn);
  for (const root of roots) {
    visit(root.id);
  }

  // Add any remaining questions (in case of circular dependencies or orphans)
  for (const question of questions) {
    if (!visited.has(question.id)) {
      result.push(question);
    }
  }

  return result;
}
