import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WizardProvider, useWizard } from './WizardProvider';
import { ProgressHeader } from './navigation/ProgressHeader';
import { WizardFooter } from './navigation/WizardFooter';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { RolePreferencesScreen } from './screens/RolePreferencesScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { DomainIntroScreen } from './screens/DomainIntroScreen';
import type { ProcessedQuestionnaire, QuestionnaireData, Screen } from '../../types/questionnaire';
import type { JourneyStage } from './layout/SplitScreenLayout';
import { processQuestionnaire } from '../../utils/screenChunker';
import { getActiveQuestionnaires } from '../../utils/questionnaireRegistry';

// ============================================
// Wizard Phase Types
// ============================================

type WizardPhase =
  | 'welcome'
  | 'personal_info'      // First part of general profile (personal_information, contact_details, location_residence)
  | 'role_preferences'   // Combined sector + role functions selection
  | 'general_profile'    // Rest of general profile
  | 'domain_intro'
  | 'technical_domain'
  | 'review';

// Sections that come before sector/role selection
const PERSONAL_INFO_SECTIONS = ['personal_info', 'contact_details', 'location_residence', 'professional_summary'];

// Section to journey stage mapping - using actual section IDs from JSON
const PROFILE_SECTIONS = ['personal_info', 'contact_details', 'location_residence', 'professional_summary'];
const EXPERIENCE_SECTIONS = [
  'professional_experience', 'current_employment', 'education',
  'professional_certifications', 'languages'
];
const PREFERENCES_SECTIONS = [
  'job_search_status', 'role_preferences', 'salary_expectations',
  'location_work_preferences', 'deal_breakers',
  // Split sections from work_environment_preferences:
  'work_style_pace', 'team_collaboration', 'company_context', 'career_growth',
  // Split sections from manager_team_fit:
  'leadership_style', 'communication_feedback', 'values_philosophy',
  'workplace_styles'
];
const ADMIN_SECTIONS = [
  'availability_scheduling', 'references_background',
  'referral_source', 'preferences_communication'
];
const SKILLS_SECTIONS = [
  'skills_strategic_commercial', 'skills_leadership_talent',
  'skills_stakeholder_influence', 'skills_problem_solving', 'skills_personal_effectiveness'
];

// Map section ID to journey stage
function getSectionJourneyStage(sectionId: string): JourneyStage {
  if (PROFILE_SECTIONS.includes(sectionId)) return 'profile';
  if (EXPERIENCE_SECTIONS.includes(sectionId)) return 'experience';
  if (PREFERENCES_SECTIONS.includes(sectionId)) return 'preferences';
  if (ADMIN_SECTIONS.includes(sectionId)) return 'preferences'; // Admin sections shown in preferences stage
  if (SKILLS_SECTIONS.includes(sectionId) || sectionId.startsWith('skills_')) return 'skills';
  return 'experience'; // Default
}

// Determine journey stage from section ID and phase
function getJourneyStage(phase: WizardPhase, sectionId?: string): JourneyStage {
  if (phase === 'personal_info') return 'profile';
  if (phase === 'role_preferences') return 'preferences';
  if (phase === 'review') return 'review';
  if (phase === 'technical_domain' || phase === 'domain_intro') return 'skills';

  // For general_profile, determine by section
  if (sectionId) {
    return getSectionJourneyStage(sectionId);
  }

  // Default for general_profile
  return 'experience';
}

// Calculate progress within current journey stage
function calculateStageProgress(
  currentScreen: Screen,
  questionnaire: ProcessedQuestionnaire,
  stage: JourneyStage
): { current: number; total: number } {
  // Get all screens belonging to this journey stage
  const stageScreens: Screen[] = [];
  let currentPosition = 0;
  let foundCurrent = false;

  for (const section of questionnaire.sections) {
    if (!section.isVisible) continue;

    const sectionStage = getSectionJourneyStage(section.section.id);
    if (sectionStage === stage) {
      for (const screen of section.screens) {
        stageScreens.push(screen);
        if (screen.id === currentScreen.id) {
          currentPosition = stageScreens.length;
          foundCurrent = true;
        }
      }
    }
  }

  // If screen not found in stage screens (shouldn't happen), fallback
  if (!foundCurrent) {
    return { current: 1, total: 1 };
  }

  return {
    current: currentPosition,
    total: stageScreens.length
  };
}

// ============================================
// Questionnaire Data Loader
// ============================================

interface QuestionnaireLoaderProps {
  children: (data: Map<string, ProcessedQuestionnaire>) => React.ReactNode;
}

function QuestionnaireLoader({ children }: QuestionnaireLoaderProps) {
  const [questionnaireData, setQuestionnaireData] = useState<Map<string, ProcessedQuestionnaire>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestionnaires() {
      try {
        const dataMap = new Map<string, ProcessedQuestionnaire>();

        // Load all questionnaire JSON files
        const questionnaireFiles = [
          'candidate-profile',
          'erm-candidate-profile',
          'fs-risk-candidate-profile',
          'ia-candidate-profile',
          'ic-candidate-profile',
          'bcm-candidate-profile',
          'esg-sustainability-candidate-profile',
          'fs-compliance-candidate-profile',
        ];

        for (const id of questionnaireFiles) {
          try {
            // Dynamic import of JSON files
            const module = await import(`../../../data/questionnaires/${id}.json`);
            const data: QuestionnaireData = module.default || module;

            // Process with default sector (will be reprocessed when sector changes)
            const processed = processQuestionnaire(data, null);
            dataMap.set(id, processed);
          } catch (err) {
            console.warn(`Failed to load questionnaire: ${id}`, err);
          }
        }

        setQuestionnaireData(dataMap);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load questionnaires:', err);
        setError('Failed to load questionnaire data. Please refresh the page.');
        setIsLoading(false);
      }
    }

    loadQuestionnaires();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-assured-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-ink-600">Loading questionnaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-copper-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-copper-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="font-body text-ink-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children(questionnaireData)}</>;
}

// ============================================
// Main Wizard Content
// ============================================

interface WizardContentProps {
  questionnaireData: Map<string, ProcessedQuestionnaire>;
}

function WizardContent({ questionnaireData }: WizardContentProps) {
  const {
    state,
    currentScreen,
    currentQuestionnaire,
    activeQuestionnaires,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    saveProgress,
    navigateToQuestionnaire,
  } = useWizard();

  const [phase, setPhase] = useState<WizardPhase>('welcome');
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);

  // Determine current phase based on state - only on initial load
  useEffect(() => {
    // Only reset phase if we're truly at the beginning and have no saved progress
    // This allows the new flow: welcome -> personal_info -> sector -> role_functions -> general_profile
  }, []);

  // Get technical domains (non-core questionnaires)
  const technicalDomains = useMemo(() => {
    return activeQuestionnaires.filter((q) => !q.isCore);
  }, [activeQuestionnaires]);

  // Get current screen data
  const currentScreenData = useMemo((): Screen | null => {
    if (!currentQuestionnaire || !currentScreen) return null;

    // In general_profile phase, skip personal info sections
    if (phase === 'general_profile' && state.navigation.currentQuestionnaireId === 'candidate-profile') {
      const nonPersonalSections = currentQuestionnaire.sections.filter(
        (s) => !PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible
      );
      const section = nonPersonalSections.find(
        (s) => s.section.id === currentScreen.sectionId
      );
      if (!section) {
        // Current section is a personal info section, return first non-personal screen
        if (nonPersonalSections.length > 0 && nonPersonalSections[0].screens.length > 0) {
          return nonPersonalSections[0].screens[0];
        }
        return null;
      }
      return section.screens[currentScreen.screenIndex] || null;
    }

    const section = currentQuestionnaire.sections.find(
      (s) => s.section.id === currentScreen.sectionId
    );
    if (!section) return null;

    return section.screens[currentScreen.screenIndex] || null;
  }, [currentQuestionnaire, currentScreen, phase, state.navigation.currentQuestionnaireId]);

  // Handle phase transitions
  const handleWelcomeComplete = () => {
    // Start with personal info sections of the general profile
    navigateToQuestionnaire('candidate-profile');
    setPhase('personal_info');
  };

  const handleRolePreferencesComplete = () => {
    // Continue with the rest of general profile (after personal info sections)
    // Find the first section that's NOT a personal info section
    const candidateProfile = questionnaireData.get('candidate-profile');
    if (candidateProfile) {
      const nonPersonalSections = candidateProfile.sections.filter(
        (s) => !PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible
      );
      if (nonPersonalSections.length > 0) {
        // Navigate directly to the first non-personal section
        navigateToQuestionnaire('candidate-profile', nonPersonalSections[0].section.id);
      } else {
        navigateToQuestionnaire('candidate-profile');
      }
    } else {
      navigateToQuestionnaire('candidate-profile');
    }
    setPhase('general_profile');
  };

  const handleNext = useCallback(() => {
    // Check if we're in personal_info phase and about to leave personal info sections
    if (phase === 'personal_info' && currentScreenData) {
      const currentSectionId = currentScreenData.sectionId;
      const isInPersonalInfo = PERSONAL_INFO_SECTIONS.includes(currentSectionId);

      if (isInPersonalInfo) {
        // Check if this is the last screen of the last personal info section
        const candidateProfile = questionnaireData.get('candidate-profile');
        if (candidateProfile) {
          const personalInfoSections = candidateProfile.sections.filter(
            (s) => PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible
          );
          const lastPersonalSection = personalInfoSections[personalInfoSections.length - 1];

          if (lastPersonalSection &&
              currentSectionId === lastPersonalSection.section.id &&
              currentScreenData.screenIndex === lastPersonalSection.screens.length - 1) {
            // We're at the end of personal info, go to role preferences
            setPhase('role_preferences');
            return;
          }
        }
      }
    }

    // In general_profile phase, check if next screen would be a personal info section
    // If so, skip to the next non-personal section or end
    if (phase === 'general_profile' && currentScreenData) {
      const candidateProfile = questionnaireData.get('candidate-profile');
      if (candidateProfile) {
        // Get all non-personal screens in order
        const nonPersonalScreens = candidateProfile.sections
          .filter((s) => !PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible)
          .flatMap((s) => s.screens);

        // Find current position in non-personal screens
        const currentIndex = nonPersonalScreens.findIndex((s) => s.id === currentScreenData.id);

        if (currentIndex >= 0 && currentIndex === nonPersonalScreens.length - 1) {
          // We're at the last non-personal screen, move to next phase
          if (technicalDomains.length > 0) {
            setCurrentDomainIndex(0);
            setPhase('domain_intro');
          } else {
            setPhase('review');
          }
          return;
        }
      }
    }

    const isLastScreen = goNext();

    // If we couldn't advance, it means we're at the end of a questionnaire
    if (!isLastScreen) {
      if (phase === 'personal_info') {
        // Finished personal info sections, go to role preferences
        setPhase('role_preferences');
      } else if (phase === 'general_profile') {
        // Move to technical domains or review
        if (technicalDomains.length > 0) {
          setCurrentDomainIndex(0);
          setPhase('domain_intro');
        } else {
          setPhase('review');
        }
      } else if (phase === 'technical_domain') {
        // Move to next domain or review
        if (currentDomainIndex < technicalDomains.length - 1) {
          setCurrentDomainIndex((prev) => prev + 1);
          setPhase('domain_intro');
        } else {
          setPhase('review');
        }
      }
    }
  }, [phase, technicalDomains, currentDomainIndex, goNext, currentScreenData, questionnaireData]);

  const handlePrevious = useCallback(() => {
    // In general_profile phase, check if we're at the first screen of the first non-personal section
    if (phase === 'general_profile' && currentScreenData) {
      const candidateProfile = questionnaireData.get('candidate-profile');
      if (candidateProfile) {
        const nonPersonalSections = candidateProfile.sections.filter(
          (s) => !PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible
        );
        if (nonPersonalSections.length > 0) {
          const firstSection = nonPersonalSections[0];
          if (currentScreenData.sectionId === firstSection.section.id && currentScreenData.screenIndex === 0) {
            // We're at the very start of general_profile, go back to role_preferences
            setPhase('role_preferences');
            return;
          }
        }
      }
    }

    const hasMore = goPrevious();

    // If we're at the start of a questionnaire
    if (!hasMore) {
      if (phase === 'personal_info') {
        setPhase('welcome');
      } else if (phase === 'general_profile') {
        setPhase('role_preferences');
      } else if (phase === 'technical_domain') {
        if (currentDomainIndex === 0) {
          // Go back to general profile - navigate to last non-personal section
          const candidateProfile = questionnaireData.get('candidate-profile');
          if (candidateProfile) {
            const nonPersonalSections = candidateProfile.sections.filter(
              (s) => !PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible
            );
            if (nonPersonalSections.length > 0) {
              const lastSection = nonPersonalSections[nonPersonalSections.length - 1];
              navigateToQuestionnaire('candidate-profile', lastSection.section.id);
            } else {
              navigateToQuestionnaire('candidate-profile');
            }
          } else {
            navigateToQuestionnaire('candidate-profile');
          }
          setPhase('general_profile');
        } else {
          // Go back to previous domain
          setCurrentDomainIndex((prev) => prev - 1);
          setPhase('domain_intro');
        }
      }
    }
  }, [phase, currentDomainIndex, goPrevious, navigateToQuestionnaire, currentScreenData, questionnaireData]);

  const handleDomainIntroComplete = () => {
    // Navigate to the domain's questionnaire
    const domain = technicalDomains[currentDomainIndex];
    if (domain) {
      navigateToQuestionnaire(domain.id);
    }
    setPhase('technical_domain');
  };

  const handleEditSection = (questionnaireId: string, sectionId: string) => {
    navigateToQuestionnaire(questionnaireId, sectionId);

    // Determine which phase to go to
    if (questionnaireId === 'candidate-profile') {
      setPhase('general_profile');
    } else {
      // Find the domain index
      const domainIndex = technicalDomains.findIndex((d) => d.id === questionnaireId);
      if (domainIndex >= 0) {
        setCurrentDomainIndex(domainIndex);
        setPhase('technical_domain');
      }
    }
  };

  // Get all processed questionnaires for review
  const processedQuestionnaires = useMemo(() => {
    const result: ProcessedQuestionnaire[] = [];

    // Add candidate profile first
    const candidateProfile = questionnaireData.get('candidate-profile');
    if (candidateProfile) {
      result.push(candidateProfile);
    }

    // Add technical domains
    technicalDomains.forEach((domain) => {
      const questionnaire = questionnaireData.get(domain.id);
      if (questionnaire) {
        result.push(questionnaire);
      }
    });

    return result;
  }, [questionnaireData, technicalDomains]);

  // Render current phase
  const renderPhase = () => {
    switch (phase) {
      case 'welcome':
        return (
          <WelcomeScreen
            onContinue={handleWelcomeComplete}
            hasSavedProgress={Object.keys(state.responses['candidate-profile'] || {}).length > 0}
          />
        );

      case 'personal_info':
        if (!currentScreenData) {
          return (
            <div className="min-h-screen bg-pine flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-sienna border-t-transparent rounded-full animate-spin" />
            </div>
          );
        }
        const profileStage = getJourneyStage(phase, currentScreenData.sectionId);
        const candidateProfileForProgress = questionnaireData.get('candidate-profile');
        const profileStageProgress = candidateProfileForProgress
          ? calculateStageProgress(currentScreenData, candidateProfileForProgress, profileStage)
          : { current: 1, total: 1 };
        return (
          <QuestionScreen
            screen={currentScreenData}
            questionnaireId={state.navigation.currentQuestionnaireId}
            currentStage={profileStage}
            sectionProgress={profileStageProgress}
            onBack={handlePrevious}
            onNext={handleNext}
            onSaveAndExit={saveProgress}
          />
        );

      case 'role_preferences':
        return (
          <RolePreferencesScreen
            onContinue={handleRolePreferencesComplete}
            onBack={() => {
              // Go back to the last screen of the last personal info section
              const candidateProfile = questionnaireData.get('candidate-profile');
              if (candidateProfile) {
                const personalInfoSections = candidateProfile.sections.filter(
                  (s) => PERSONAL_INFO_SECTIONS.includes(s.section.id) && s.isVisible
                );
                if (personalInfoSections.length > 0) {
                  const lastSection = personalInfoSections[personalInfoSections.length - 1];
                  const lastScreenIndex = lastSection.screens.length - 1;
                  navigateToQuestionnaire('candidate-profile', lastSection.section.id, lastScreenIndex);
                } else {
                  navigateToQuestionnaire('candidate-profile');
                }
              } else {
                navigateToQuestionnaire('candidate-profile');
              }
              setPhase('personal_info');
            }}
          />
        );

      case 'general_profile':
      case 'technical_domain':
        if (!currentScreenData) {
          return (
            <div className="min-h-screen bg-pine flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-sienna border-t-transparent rounded-full animate-spin" />
            </div>
          );
        }
        // Calculate screen numbers for overall progress
        const allScreens = activeQuestionnaires.flatMap((q) => {
          const questionnaire = questionnaireData.get(q.id);
          if (!questionnaire) return [];
          return questionnaire.sections
            .filter((s) => s.isVisible)
            .flatMap((s) => s.screens);
        });
        const currentScreenIndex = allScreens.findIndex(
          (s) => s.id === currentScreenData.id
        );

        // Calculate stage-level progress
        const currentJourneyStage = getJourneyStage(phase, currentScreenData.sectionId);
        const currentQuestionnaireForProgress = questionnaireData.get(state.navigation.currentQuestionnaireId);
        const stageProgress = currentQuestionnaireForProgress
          ? calculateStageProgress(currentScreenData, currentQuestionnaireForProgress, currentJourneyStage)
          : { current: 1, total: 1 };

        return (
          <QuestionScreen
            screen={currentScreenData}
            questionnaireId={state.navigation.currentQuestionnaireId}
            currentStage={currentJourneyStage}
            sectionProgress={stageProgress}
            screenNumber={currentScreenIndex + 1}
            totalScreens={allScreens.length}
            onBack={handlePrevious}
            onNext={handleNext}
            onSaveAndExit={saveProgress}
          />
        );

      case 'domain_intro':
        return (
          <DomainIntroScreen
            domain={technicalDomains[currentDomainIndex]}
            domainIndex={currentDomainIndex}
            totalDomains={technicalDomains.length}
            onContinue={handleDomainIntroComplete}
            onBack={() => {
              if (currentDomainIndex === 0) {
                // Go back to general profile
                navigateToQuestionnaire('candidate-profile');
                setPhase('general_profile');
              } else {
                setCurrentDomainIndex((prev) => prev - 1);
                setPhase('domain_intro');
              }
            }}
          />
        );

      case 'review':
        return (
          <ReviewScreen
            questionnaires={processedQuestionnaires}
            onEdit={handleEditSection}
            onSubmit={async () => {
              await saveProgress();
              // Handle final submission
              console.log('Profile submitted!', state);
              alert('Profile submitted successfully!');
            }}
            onBack={() => {
              if (technicalDomains.length > 0) {
                setCurrentDomainIndex(technicalDomains.length - 1);
                navigateToQuestionnaire(technicalDomains[technicalDomains.length - 1].id);
                setPhase('technical_domain');
              } else {
                navigateToQuestionnaire('candidate-profile');
                setPhase('general_profile');
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPhase()}
    </div>
  );
}

// ============================================
// Main Exported Component
// ============================================

export function OnboardingWizard() {
  return (
    <QuestionnaireLoader>
      {(questionnaireData) => (
        <WizardProvider questionnaireData={questionnaireData}>
          <WizardContent questionnaireData={questionnaireData} />
        </WizardProvider>
      )}
    </QuestionnaireLoader>
  );
}

export default OnboardingWizard;
