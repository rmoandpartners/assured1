import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import type {
  WizardState,
  WizardAction,
  WizardContextValue,
  QuestionnaireConfig,
  ProcessedQuestionnaire,
  Screen,
  Question,
  RoleFunction,
  Sector,
  QuestionnaireProgress,
  QuestionnaireResponses,
} from '../../types/questionnaire';
import {
  getActiveQuestionnaires,
  getQuestionnaireConfig,
  QUESTIONNAIRE_REGISTRY,
} from '../../utils/questionnaireRegistry';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  hasSavedProgress as checkSavedProgress,
  createDebouncedSave,
  setupPersistenceListeners,
} from '../../utils/persistence';
import { isQuestionVisible, filterVisibleQuestions, getQuestionsToClear } from '../../utils/conditionalLogic';

// ============================================
// Initial State
// ============================================

const generateCandidateId = (): string => {
  return `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const createInitialState = (): WizardState => ({
  candidateId: generateCandidateId(),
  sector: null,
  selectedRoleFunctions: [],
  responses: {
    'candidate-profile': {},
  },
  navigation: {
    currentQuestionnaireId: 'candidate-profile',
    currentSectionId: '',
    currentScreenIndex: 0,
    mode: 'initial',
  },
  progress: {},
  meta: {
    startedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
    version: '1.0.0',
  },
});

// ============================================
// Reducer
// ============================================

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_ANSWER': {
      const { questionnaireId, questionId, value } = action.payload;
      return {
        ...state,
        responses: {
          ...state.responses,
          [questionnaireId]: {
            ...state.responses[questionnaireId],
            [questionId]: {
              value,
              timestamp: new Date().toISOString(),
              isValid: true,
            },
          },
        },
      };
    }

    case 'CLEAR_ANSWER': {
      const { questionnaireId, questionId } = action.payload;
      const questResponses = { ...state.responses[questionnaireId] };
      delete questResponses[questionId];
      return {
        ...state,
        responses: {
          ...state.responses,
          [questionnaireId]: questResponses,
        },
      };
    }

    case 'SET_SECTOR': {
      return {
        ...state,
        sector: action.payload,
      };
    }

    case 'SET_ROLE_FUNCTIONS': {
      // Initialize response objects for newly selected domains
      const newResponses = { ...state.responses };
      const activeQuestionnaires = getActiveQuestionnaires(state.sector, action.payload);

      for (const config of activeQuestionnaires) {
        if (!newResponses[config.id]) {
          newResponses[config.id] = {};
        }
      }

      return {
        ...state,
        selectedRoleFunctions: action.payload,
        responses: newResponses,
      };
    }

    case 'NAVIGATE_TO_QUESTIONNAIRE': {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentQuestionnaireId: action.payload,
          currentSectionId: '',
          currentScreenIndex: 0,
        },
      };
    }

    case 'NAVIGATE_TO_SECTION': {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentSectionId: action.payload,
          currentScreenIndex: 0,
        },
      };
    }

    case 'NAVIGATE_TO_SCREEN': {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentScreenIndex: action.payload,
        },
      };
    }

    case 'SET_MODE': {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          mode: action.payload,
        },
      };
    }

    case 'HYDRATE_STATE': {
      return action.payload;
    }

    case 'UPDATE_PROGRESS': {
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.questionnaireId]: action.payload.progress,
        },
      };
    }

    case 'SET_META': {
      return {
        ...state,
        meta: {
          ...state.meta,
          ...action.payload,
        },
      };
    }

    case 'CLEAR_ALL': {
      return createInitialState();
    }

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

// ============================================
// Provider Component
// ============================================

interface WizardProviderProps {
  children: React.ReactNode;
  questionnaireData: Map<string, ProcessedQuestionnaire>;
}

export function WizardProvider({ children, questionnaireData }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, null, () => {
    // Try to load saved state on initialization
    const savedState = loadFromLocalStorage();
    if (savedState) {
      return savedState;
    }
    return createInitialState();
  });

  // Refs for persistence
  const debouncedSaveRef = useRef(createDebouncedSave(1000, 5000));
  const stateRef = useRef(state);
  stateRef.current = state;

  // Auto-save effect
  useEffect(() => {
    debouncedSaveRef.current.save(state);
  }, [state.responses, state.sector, state.selectedRoleFunctions]);

  // Setup persistence listeners
  useEffect(() => {
    const cleanup = setupPersistenceListeners(
      () => stateRef.current,
      (s) => saveToLocalStorage(s)
    );
    return cleanup;
  }, []);

  // Flush pending saves on unmount
  useEffect(() => {
    return () => {
      debouncedSaveRef.current.flush();
    };
  }, []);

  // ============================================
  // Computed Values
  // ============================================

  const activeQuestionnaires = useMemo((): QuestionnaireConfig[] => {
    return getActiveQuestionnaires(state.sector, state.selectedRoleFunctions);
  }, [state.sector, state.selectedRoleFunctions]);

  const currentQuestionnaire = useMemo((): ProcessedQuestionnaire | null => {
    return questionnaireData.get(state.navigation.currentQuestionnaireId) || null;
  }, [questionnaireData, state.navigation.currentQuestionnaireId]);

  const currentScreen = useMemo((): Screen | null => {
    if (!currentQuestionnaire) return null;

    // Find the current section
    const section = currentQuestionnaire.sections.find(
      (s) => s.section.id === state.navigation.currentSectionId
    );

    if (!section || !section.screens.length) {
      // Return first screen of first visible section
      const firstVisibleSection = currentQuestionnaire.sections.find((s) => s.isVisible);
      if (firstVisibleSection && firstVisibleSection.screens.length > 0) {
        return firstVisibleSection.screens[0];
      }
      return null;
    }

    return section.screens[state.navigation.currentScreenIndex] || section.screens[0];
  }, [currentQuestionnaire, state.navigation.currentSectionId, state.navigation.currentScreenIndex]);

  const visibleQuestions = useMemo((): Question[] => {
    if (!currentScreen) return [];
    return filterVisibleQuestions(
      currentScreen.questions,
      state.responses[state.navigation.currentQuestionnaireId] || {},
      state.responses
    );
  }, [currentScreen, state.responses, state.navigation.currentQuestionnaireId]);

  const overallProgress = useMemo((): number => {
    const progressValues = Object.values(state.progress);
    if (progressValues.length === 0) return 0;

    const totalRequired = progressValues.reduce((sum, p) => sum + p.requiredQuestions, 0);
    const totalAnswered = progressValues.reduce((sum, p) => sum + p.answeredRequiredQuestions, 0);

    return totalRequired > 0 ? Math.round((totalAnswered / totalRequired) * 100) : 0;
  }, [state.progress]);

  // ============================================
  // Helper Functions
  // ============================================

  const setAnswer = useCallback(
    (questionnaireId: string, questionId: string, value: unknown) => {
      // Set the answer
      dispatch({ type: 'SET_ANSWER', payload: { questionnaireId, questionId, value } });

      // Handle cascading clears - find questions that depend on this one and clear them if they become hidden
      const questionnaire = questionnaireData.get(questionnaireId);
      if (questionnaire) {
        // Get all questions from all sections
        const allQuestions = questionnaire.sections.flatMap((s) => s.section.questions);
        const currentResponses = state.responses[questionnaireId] || {};

        const questionsToClear = getQuestionsToClear(
          questionId,
          value,
          allQuestions,
          currentResponses,
          state.responses
        );

        // Clear each dependent question that becomes hidden
        for (const clearId of questionsToClear) {
          dispatch({ type: 'CLEAR_ANSWER', payload: { questionnaireId, questionId: clearId } });
        }
      }
    },
    [questionnaireData, state.responses]
  );

  const getAnswer = useCallback(
    (questionnaireId: string, questionId: string): unknown => {
      return state.responses[questionnaireId]?.[questionId]?.value;
    },
    [state.responses]
  );

  const isQuestionVisibleFn = useCallback(
    (question: Question): boolean => {
      return isQuestionVisible(
        question,
        state.responses[state.navigation.currentQuestionnaireId] || {},
        state.responses
      );
    },
    [state.responses, state.navigation.currentQuestionnaireId]
  );

  const validateScreen = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    for (const question of visibleQuestions) {
      if (question.required) {
        const answer = getAnswer(state.navigation.currentQuestionnaireId, question.id);
        if (answer === undefined || answer === null || answer === '') {
          errors[question.id] = 'This field is required';
        } else if (Array.isArray(answer) && answer.length === 0) {
          errors[question.id] = 'Please select at least one option';
        }
      }

      // Additional validation based on validation rules
      if (question.validation) {
        const answer = getAnswer(state.navigation.currentQuestionnaireId, question.id);
        if (answer !== undefined && answer !== null) {
          const { minLength, maxLength, min, max, pattern } = question.validation;

          if (typeof answer === 'string') {
            if (minLength && answer.length < minLength) {
              errors[question.id] = `Minimum ${minLength} characters required`;
            }
            if (maxLength && answer.length > maxLength) {
              errors[question.id] = `Maximum ${maxLength} characters allowed`;
            }
            if (pattern && !new RegExp(pattern).test(answer)) {
              errors[question.id] = 'Invalid format';
            }
          }

          if (typeof answer === 'number') {
            if (min !== undefined && answer < min) {
              errors[question.id] = `Minimum value is ${min}`;
            }
            if (max !== undefined && answer > max) {
              errors[question.id] = `Maximum value is ${max}`;
            }
          }
        }
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }, [visibleQuestions, getAnswer, state.navigation.currentQuestionnaireId]);

  // ============================================
  // Navigation Functions
  // ============================================

  const getAllScreens = useCallback((): Screen[] => {
    const screens: Screen[] = [];
    for (const config of activeQuestionnaires) {
      const questionnaire = questionnaireData.get(config.id);
      if (questionnaire) {
        for (const section of questionnaire.sections) {
          if (section.isVisible) {
            screens.push(...section.screens);
          }
        }
      }
    }
    return screens;
  }, [activeQuestionnaires, questionnaireData]);

  const getCurrentScreenIndex = useCallback((): number => {
    const allScreens = getAllScreens();
    return allScreens.findIndex(
      (s) =>
        s.questionnaireId === state.navigation.currentQuestionnaireId &&
        s.sectionId === state.navigation.currentSectionId &&
        s.screenIndex === state.navigation.currentScreenIndex
    );
  }, [getAllScreens, state.navigation]);

  const canGoNext = useMemo((): boolean => {
    const allScreens = getAllScreens();
    const currentIdx = getCurrentScreenIndex();
    return currentIdx < allScreens.length - 1;
  }, [getAllScreens, getCurrentScreenIndex]);

  const canGoPrevious = useMemo((): boolean => {
    const currentIdx = getCurrentScreenIndex();
    return currentIdx > 0;
  }, [getCurrentScreenIndex]);

  const goNext = useCallback((): boolean => {
    const allScreens = getAllScreens();
    const currentIdx = getCurrentScreenIndex();

    if (currentIdx < allScreens.length - 1) {
      const nextScreen = allScreens[currentIdx + 1];
      dispatch({ type: 'NAVIGATE_TO_QUESTIONNAIRE', payload: nextScreen.questionnaireId });
      dispatch({ type: 'NAVIGATE_TO_SECTION', payload: nextScreen.sectionId });
      dispatch({ type: 'NAVIGATE_TO_SCREEN', payload: nextScreen.screenIndex });
      return true;
    }
    return false; // At the end
  }, [getAllScreens, getCurrentScreenIndex]);

  const goPrevious = useCallback((): boolean => {
    const allScreens = getAllScreens();
    const currentIdx = getCurrentScreenIndex();

    if (currentIdx > 0) {
      const prevScreen = allScreens[currentIdx - 1];
      dispatch({ type: 'NAVIGATE_TO_QUESTIONNAIRE', payload: prevScreen.questionnaireId });
      dispatch({ type: 'NAVIGATE_TO_SECTION', payload: prevScreen.sectionId });
      dispatch({ type: 'NAVIGATE_TO_SCREEN', payload: prevScreen.screenIndex });
      return true;
    }
    return false; // At the start
  }, [getAllScreens, getCurrentScreenIndex]);

  const goToSection = useCallback((sectionId: string) => {
    dispatch({ type: 'NAVIGATE_TO_SECTION', payload: sectionId });
    dispatch({ type: 'NAVIGATE_TO_SCREEN', payload: 0 });
  }, []);

  const goToQuestionnaire = useCallback((questionnaireId: string) => {
    dispatch({ type: 'NAVIGATE_TO_QUESTIONNAIRE', payload: questionnaireId });
    dispatch({ type: 'NAVIGATE_TO_SECTION', payload: '' });
    dispatch({ type: 'NAVIGATE_TO_SCREEN', payload: 0 });
  }, []);

  const navigateToQuestionnaire = useCallback((questionnaireId: string, sectionId?: string, screenIndex?: number) => {
    dispatch({ type: 'NAVIGATE_TO_QUESTIONNAIRE', payload: questionnaireId });
    if (sectionId) {
      dispatch({ type: 'NAVIGATE_TO_SECTION', payload: sectionId });
    } else {
      // Navigate to the first visible section
      const questionnaire = questionnaireData.get(questionnaireId);
      if (questionnaire) {
        const firstVisibleSection = questionnaire.sections.find((s) => s.isVisible);
        if (firstVisibleSection) {
          dispatch({ type: 'NAVIGATE_TO_SECTION', payload: firstVisibleSection.section.id });
        }
      }
    }
    dispatch({ type: 'NAVIGATE_TO_SCREEN', payload: screenIndex ?? 0 });
  }, [questionnaireData]);

  // ============================================
  // Persistence Functions
  // ============================================

  const saveProgress = useCallback(async () => {
    debouncedSaveRef.current.flush();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay to ensure save completes
  }, []);

  const hasSavedProgressValue = useMemo(() => checkSavedProgress(), []);

  // ============================================
  // Context Value
  // ============================================

  // Validation errors state
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const contextValue: WizardContextValue = {
    state,
    dispatch,
    activeQuestionnaires,
    currentQuestionnaire,
    currentScreen,
    visibleQuestions,
    overallProgress,
    setAnswer,
    getAnswer,
    isQuestionVisible: isQuestionVisibleFn,
    validateScreen,
    validationErrors,
    setValidationErrors,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    goToSection,
    goToQuestionnaire,
    navigateToQuestionnaire,
    saveProgress,
    hasSavedProgress: hasSavedProgressValue,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
}

// ============================================
// Helper Hooks
// ============================================

/**
 * Hook for setting sector
 */
export function useSetSector() {
  const { dispatch } = useWizard();
  return useCallback(
    (sector: Sector) => {
      dispatch({ type: 'SET_SECTOR', payload: sector });
    },
    [dispatch]
  );
}

/**
 * Hook for setting role functions
 */
export function useSetRoleFunctions() {
  const { dispatch } = useWizard();
  return useCallback(
    (roleFunctions: RoleFunction[]) => {
      dispatch({ type: 'SET_ROLE_FUNCTIONS', payload: roleFunctions });
    },
    [dispatch]
  );
}

/**
 * Hook for updating progress
 */
export function useUpdateProgress() {
  const { dispatch } = useWizard();
  return useCallback(
    (questionnaireId: string, progress: QuestionnaireProgress) => {
      dispatch({ type: 'UPDATE_PROGRESS', payload: { questionnaireId, progress } });
    },
    [dispatch]
  );
}
