import React, { useMemo, useState } from 'react';
import { useWizard } from '../WizardProvider';
import { SplitScreenLayout } from '../layout/SplitScreenLayout';
import type { ProcessedQuestionnaire } from '../../../types/questionnaire';

interface ReviewScreenProps {
  questionnaires: ProcessedQuestionnaire[];
  onEdit: (questionnaireId: string, sectionId: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

interface SectionSummary {
  id: string;
  title: string;
  questionnaireId: string;
  questionnaireName: string;
  totalQuestions: number;
  answeredQuestions: number;
  percentComplete: number;
}

export function ReviewScreen({ questionnaires, onEdit, onSubmit, onBack }: ReviewScreenProps) {
  const { state } = useWizard();
  const [expandedQuestionnaire, setExpandedQuestionnaire] = useState<string | null>(null);

  // Calculate section summaries
  const sectionSummaries = useMemo(() => {
    const summaries: SectionSummary[] = [];

    questionnaires.forEach((pq) => {
      const questionnaireId = pq.questionnaire.id;
      const responses = state.responses[questionnaireId] || {};

      pq.sections.forEach((section) => {
        if (!section.isVisible) return;

        const visibleQuestions = section.section.questions.filter(
          (q) => q.type !== 'heading' && q.type !== 'display'
        );

        const answeredCount = visibleQuestions.filter((q) => {
          const response = responses[q.id];
          if (!response) return false;
          const answer = response.value;
          if (answer === undefined || answer === null || answer === '') return false;
          if (Array.isArray(answer) && answer.length === 0) return false;
          return true;
        }).length;

        summaries.push({
          id: section.section.id,
          title: section.section.title,
          questionnaireId: questionnaireId,
          questionnaireName: pq.questionnaire.title,
          totalQuestions: visibleQuestions.length,
          answeredQuestions: answeredCount,
          percentComplete: visibleQuestions.length > 0
            ? Math.round((answeredCount / visibleQuestions.length) * 100)
            : 100,
        });
      });
    });

    return summaries;
  }, [questionnaires, state.responses]);

  // Group summaries by questionnaire
  const groupedSummaries = useMemo(() => {
    const groups: Record<string, { name: string; sections: SectionSummary[] }> = {};

    sectionSummaries.forEach((summary) => {
      if (!groups[summary.questionnaireId]) {
        groups[summary.questionnaireId] = {
          name: summary.questionnaireName,
          sections: [],
        };
      }
      groups[summary.questionnaireId].sections.push(summary);
    });

    return groups;
  }, [sectionSummaries]);

  // Calculate overall completion
  const overallStats = useMemo(() => {
    const totalQuestions = sectionSummaries.reduce((sum, s) => sum + s.totalQuestions, 0);
    const answeredQuestions = sectionSummaries.reduce((sum, s) => sum + s.answeredQuestions, 0);
    const incompleteSectons = sectionSummaries.filter((s) => s.percentComplete < 100);

    return {
      totalQuestions,
      answeredQuestions,
      percentComplete: totalQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 100,
      incompleteSections: incompleteSectons,
    };
  }, [sectionSummaries]);

  const isComplete = overallStats.percentComplete === 100;

  const toggleQuestionnaire = (id: string) => {
    setExpandedQuestionnaire(expandedQuestionnaire === id ? null : id);
  };

  return (
    <SplitScreenLayout
      title="Confirm your profile."
      description="Review your dossier. Once submitted, our agents will curate opportunities that match your specific signature."
      currentStage="review"
      onBack={onBack}
      onNext={onSubmit}
      nextLabel="Submit Dossier"
    >
      <div className="space-y-8">
        {/* Overall progress */}
        <div className="bg-[#e0ddd5]/30 p-6 border border-[#0f241d]/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-editorial text-2xl text-[#0f241d]">
              Overall Completion
            </h2>
            <span className={`font-technical font-medium text-lg ${
              isComplete ? 'text-[#0f241d]' : 'text-[#c25e00]'
            }`}>
              {overallStats.percentComplete}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#0f241d]/10 overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-500 ${
                isComplete ? 'bg-[#0f241d]' : 'bg-[#c25e00]'
              }`}
              style={{ width: `${overallStats.percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-technical text-[#0f241d]/60">
              {overallStats.answeredQuestions} of {overallStats.totalQuestions} questions answered
            </span>
            {!isComplete && (
              <span className="font-technical text-[#c25e00]">
                {overallStats.incompleteSections.length} section{overallStats.incompleteSections.length !== 1 ? 's' : ''} incomplete
              </span>
            )}
          </div>
        </div>

        {/* Incomplete sections warning */}
        {!isComplete && (
          <div className="bg-[#c25e00]/10 border-l-2 border-[#c25e00] p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-[#c25e00] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-technical font-medium text-[#0f241d] mb-1">
                  Some sections are incomplete
                </h3>
                <p className="font-technical text-sm text-[#0f241d]/70">
                  You can still submit your profile, but completing all sections helps us find the best matches for you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Questionnaire sections */}
        <div className="space-y-3">
          {Object.entries(groupedSummaries).map(([questionnaireId, group]) => {
            const isExpanded = expandedQuestionnaire === questionnaireId;
            const questionnaireComplete = group.sections.every((s) => s.percentComplete === 100);

            return (
              <div
                key={questionnaireId}
                className="border border-[#0f241d]/10 overflow-hidden"
              >
                {/* Questionnaire header */}
                <button
                  onClick={() => toggleQuestionnaire(questionnaireId)}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#0f241d]/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center ${
                      questionnaireComplete
                        ? 'bg-[#0f241d] text-[#f2f0e9]'
                        : 'bg-[#c25e00]/10 text-[#c25e00]'
                    }`}>
                      {questionnaireComplete ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-editorial text-lg text-[#0f241d]">
                        {group.name}
                      </h3>
                      <p className="font-technical text-xs text-[#0f241d]/50 uppercase tracking-widest">
                        {group.sections.length} section{group.sections.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-technical text-xs uppercase tracking-widest ${
                      questionnaireComplete ? 'text-[#0f241d]' : 'text-[#c25e00]'
                    }`}>
                      {questionnaireComplete ? 'Complete' : 'In Progress'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#0f241d]/40 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Sections list */}
                {isExpanded && (
                  <div className="border-t border-[#0f241d]/10">
                    {group.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between px-5 py-4 border-b border-[#0f241d]/5 last:border-b-0 hover:bg-[#0f241d]/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${
                            section.percentComplete === 100
                              ? 'bg-[#0f241d]'
                              : section.percentComplete > 0
                              ? 'bg-[#c25e00]'
                              : 'bg-[#0f241d]/20'
                          }`} />
                          <div>
                            <p className="font-editorial text-[#0f241d]">
                              {section.title}
                            </p>
                            <p className="font-technical text-xs text-[#0f241d]/50">
                              {section.answeredQuestions}/{section.totalQuestions} answered
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => onEdit(section.questionnaireId, section.id)}
                          className="font-technical text-xs uppercase tracking-widest text-[#c25e00] hover:text-[#c25e00]/80 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quote */}
        <div className="text-center font-editorial italic text-[#0f241d]/60 py-4">
          "Excellence is not an act, but a habit."
        </div>
      </div>
    </SplitScreenLayout>
  );
}

export default ReviewScreen;
