#!/usr/bin/env node
/**
 * Questionnaire Reorganization Script
 *
 * This script reorganizes the candidate-profile.json questionnaire according to the plan:
 * - Reorders sections for logical flow
 * - Removes duplicate questions
 * - Splits oversized sections into smaller, focused sections
 * - Updates order fields
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/questionnaires/candidate-profile.json');
const OUTPUT_FILE = INPUT_FILE; // Overwrite in place
const BACKUP_FILE = path.join(__dirname, '../data/questionnaires/candidate-profile.backup.json');

// ============================================
// Configuration: New Section Order
// ============================================

const NEW_SECTION_ORDER = [
  'personal_info',           // 1 - Profile
  'contact_details',         // 2 - Profile
  'location_residence',      // 3 - Profile
  'professional_summary',    // 4 - Profile (MOVED from position 19)
  'professional_experience', // 5 - Experience
  'current_employment',      // 6 - Experience
  'education',               // 7 - Experience
  'professional_certifications', // 8 - Experience
  'languages',               // 9 - Experience
  'job_search_status',       // 10 - Preferences
  'role_preferences',        // 11 - Preferences
  'salary_expectations',     // 12 - Preferences
  'location_work_preferences', // 13 - Preferences
  'deal_breakers',           // 14 - Preferences
  // Split sections from work_environment_preferences:
  'work_style_pace',         // 15 - Preferences (NEW)
  'team_collaboration',      // 16 - Preferences (NEW)
  'company_context',         // 17 - Preferences (NEW)
  'career_growth',           // 18 - Preferences (NEW)
  // Split sections from manager_team_fit:
  'leadership_style',        // 19 - Preferences (NEW)
  'communication_feedback',  // 20 - Preferences (NEW)
  'values_philosophy',       // 21 - Preferences (NEW)
  'workplace_styles',        // 22 - Preferences
  'availability_scheduling', // 23 - Admin
  'references_background',   // 24 - Admin
  'referral_source',         // 25 - Admin
  'preferences_communication', // 26 - Admin
  'skills_strategic_commercial',    // 27 - Skills
  'skills_leadership_talent',       // 28 - Skills
  'skills_stakeholder_influence',   // 29 - Skills
  'skills_problem_solving',         // 30 - Skills
  'skills_personal_effectiveness',  // 31 - Skills
];

// Questions to remove (duplicates)
const QUESTIONS_TO_REMOVE = [
  { sectionId: 'deal_breakers', questionId: 'deal_breaker_industry' },
  { sectionId: 'languages', questionId: 'additional_languages' },
];

// ============================================
// Split Definitions
// ============================================

// Split work_environment_preferences (34 questions) into 4 sections
const WORK_ENV_SPLIT = {
  sourceSection: 'work_environment_preferences',
  splits: [
    {
      id: 'work_style_pace',
      title: 'Work Style & Pace',
      description: 'Your preferred pace and rhythm of work',
      questionIds: [
        'preferred_work_pace',
        'deadline_preference',
        'overtime_willingness',
        'preferred_role_evolution',
      ],
    },
    {
      id: 'team_collaboration',
      title: 'Team & Collaboration',
      description: 'How you prefer to work with teams',
      questionIds: [
        'preferred_team_structure',
        'preferred_autonomy_level',
        'collaboration_preference',
        'preferred_manager_availability',
      ],
    },
    {
      id: 'company_context',
      title: 'Company & Role Context',
      description: 'Your preferences for company environment and role scope',
      questionIds: [
        'preferred_company_stage',
        'preferred_business_context',
        'preferred_function_size',
        'preferred_direct_reports',
        'preferred_reporting_distance',
        'c_suite_visibility_preference',
        'board_exposure_preference',
        'preferred_subordinate_experience',
        'preferred_sponsorship_level',
        'preferred_investment_context',
        'preferred_mandate_level',
        'preferred_air_cover',
        'preferred_function_maturity',
        'preferred_project_structure',
        'preferred_role_scope',
        'preferred_task_variety',
        'cross_functional_preference',
      ],
    },
    {
      id: 'career_growth',
      title: 'Career Goals & Growth',
      description: 'Your long-term career aspirations',
      questionIds: [
        'long_term_career_goals',
        'preferred_impact_type',
        'career_success_priorities',
      ],
    },
  ],
};

// Split manager_team_fit (32 questions) into 3 sections
const MANAGER_FIT_SPLIT = {
  sourceSection: 'manager_team_fit',
  splits: [
    {
      id: 'leadership_style',
      title: 'Leadership Style Preferences',
      description: 'How you prefer to be led and work with leadership',
      questionIds: [
        'preferred_leadership_style',
        'preferred_management_involvement',
        'preferred_decision_making_style',
        'primary_work_strength',
        'conflict_handling_preference',
      ],
    },
    {
      id: 'communication_feedback',
      title: 'Communication & Feedback',
      description: 'Your communication and feedback preferences',
      questionIds: [
        'preferred_communication_style',
        'preferred_communication_channel',
        'preferred_one_to_one_frequency',
        'preferred_one_to_one_style',
        'preferred_meeting_approach',
        'preferred_manager_responsiveness',
        'preferred_problem_solving_support',
        'information_sharing_preference',
        'preferred_feedback_style',
        'preferred_feedback_frequency',
        'preferred_recognition_style',
      ],
    },
    {
      id: 'values_philosophy',
      title: 'Values & Development',
      description: 'Your professional values and development preferences',
      questionIds: [
        'preferred_development_approach',
        'preferred_career_discussion_frequency',
        'preferred_mistake_handling',
        'coaching_importance',
        'core_professional_values',
        'risk_tolerance_preference',
        'work_life_philosophy_preference',
        'pressure_handling_preference',
        'change_adaptability_preference',
        'quality_speed_preference',
        'primary_motivation',
      ],
    },
  ],
};

// ============================================
// Main Functions
// ============================================

function loadQuestionnaire() {
  const content = fs.readFileSync(INPUT_FILE, 'utf8');
  return JSON.parse(content);
}

function saveQuestionnaire(data) {
  // Create backup first
  if (fs.existsSync(INPUT_FILE)) {
    fs.copyFileSync(INPUT_FILE, BACKUP_FILE);
    console.log(`Backup created: ${BACKUP_FILE}`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Output written: ${OUTPUT_FILE}`);
}

function removeDuplicateQuestions(sections) {
  for (const removal of QUESTIONS_TO_REMOVE) {
    const section = sections.find(s => s.id === removal.sectionId);
    if (section) {
      const beforeCount = section.questions.length;
      section.questions = section.questions.filter(q => q.id !== removal.questionId);
      const afterCount = section.questions.length;
      if (beforeCount !== afterCount) {
        console.log(`Removed duplicate question: ${removal.questionId} from ${removal.sectionId}`);
      } else {
        console.warn(`Warning: Question ${removal.questionId} not found in ${removal.sectionId}`);
      }
    } else {
      console.warn(`Warning: Section ${removal.sectionId} not found`);
    }
  }
  return sections;
}

function splitSection(sections, splitConfig) {
  const sourceIndex = sections.findIndex(s => s.id === splitConfig.sourceSection);
  if (sourceIndex === -1) {
    console.warn(`Warning: Source section ${splitConfig.sourceSection} not found`);
    return sections;
  }

  const sourceSection = sections[sourceIndex];
  const newSections = [];

  // Track which questions have been assigned
  const assignedQuestionIds = new Set();

  for (const split of splitConfig.splits) {
    const questions = [];

    for (const qId of split.questionIds) {
      const question = sourceSection.questions.find(q => q.id === qId);
      if (question) {
        questions.push(question);
        assignedQuestionIds.add(qId);
      } else {
        console.warn(`Warning: Question ${qId} not found in ${splitConfig.sourceSection}`);
      }
    }

    if (questions.length > 0) {
      newSections.push({
        id: split.id,
        title: split.title,
        description: split.description,
        order: 0, // Will be set later
        questions: questions,
      });
      console.log(`Created new section: ${split.id} with ${questions.length} questions`);
    }
  }

  // Check for unassigned questions (headings are expected to be removed)
  const unassigned = sourceSection.questions.filter(
    q => !assignedQuestionIds.has(q.id) && q.type !== 'heading'
  );
  if (unassigned.length > 0) {
    console.warn(`Warning: ${unassigned.length} questions from ${splitConfig.sourceSection} were not assigned:`);
    unassigned.forEach(q => console.warn(`  - ${q.id}`));
  }

  // Remove the source section and add new sections
  sections.splice(sourceIndex, 1, ...newSections);
  console.log(`Split ${splitConfig.sourceSection} into ${newSections.length} sections`);

  return sections;
}

function reorderSections(sections) {
  const sectionMap = new Map();
  for (const section of sections) {
    sectionMap.set(section.id, section);
  }

  const orderedSections = [];

  for (let i = 0; i < NEW_SECTION_ORDER.length; i++) {
    const sectionId = NEW_SECTION_ORDER[i];
    const section = sectionMap.get(sectionId);

    if (section) {
      section.order = i + 1;
      orderedSections.push(section);
      sectionMap.delete(sectionId);
    } else {
      console.warn(`Warning: Section ${sectionId} from new order not found`);
    }
  }

  // Add any remaining sections that weren't in the order list (shouldn't happen)
  if (sectionMap.size > 0) {
    console.warn(`Warning: ${sectionMap.size} sections not in new order:`);
    for (const [id, section] of sectionMap) {
      console.warn(`  - ${id}`);
      section.order = orderedSections.length + 1;
      orderedSections.push(section);
    }
  }

  return orderedSections;
}

function updateMetadata(data, sections) {
  // Count total questions
  let totalQuestions = 0;
  for (const section of sections) {
    totalQuestions += section.questions.filter(q => q.type !== 'heading').length;
  }

  data.questionnaire.totalQuestions = totalQuestions;
  data.questionnaire.totalSections = sections.length;
  data.questionnaire.updatedAt = new Date().toISOString().split('T')[0];

  console.log(`Updated metadata: ${sections.length} sections, ${totalQuestions} questions`);
}

function validateResult(sections) {
  console.log('\n=== Validation ===');

  // Check section count
  console.log(`Total sections: ${sections.length}`);

  // Check question count
  let totalQuestions = 0;
  let requiredQuestions = 0;

  for (const section of sections) {
    const nonHeadingQuestions = section.questions.filter(q => q.type !== 'heading');
    totalQuestions += nonHeadingQuestions.length;
    requiredQuestions += nonHeadingQuestions.filter(q => q.required).length;
  }

  console.log(`Total questions (excluding headings): ${totalQuestions}`);
  console.log(`Required questions: ${requiredQuestions}`);

  // Check for the cross-section conditional
  let foundConditional = false;
  for (const section of sections) {
    for (const question of section.questions) {
      if (question.conditionalOn && question.conditionalOn.field === 'deal_breaker_management') {
        console.log(`Cross-section conditional found: ${question.id} depends on deal_breaker_management`);
        foundConditional = true;
      }
    }
  }

  if (!foundConditional) {
    console.warn('Warning: Cross-section conditional for deal_breaker_management not found');
  }

  // Check order fields
  const orders = sections.map(s => s.order);
  const expectedOrders = Array.from({ length: sections.length }, (_, i) => i + 1);
  const orderOk = JSON.stringify(orders) === JSON.stringify(expectedOrders);
  console.log(`Order fields valid: ${orderOk}`);

  // Print section summary
  console.log('\n=== Section Summary ===');
  for (const section of sections) {
    const qCount = section.questions.filter(q => q.type !== 'heading').length;
    console.log(`${section.order}. ${section.id} - "${section.title}" (${qCount} questions)`);
  }
}

// ============================================
// Main Execution
// ============================================

function main() {
  console.log('=== Questionnaire Reorganization ===\n');

  // Load
  console.log('Loading questionnaire...');
  const data = loadQuestionnaire();
  let sections = data.questionnaire.sections;
  console.log(`Loaded ${sections.length} sections\n`);

  // Phase 1 & 2: Remove duplicates first (before splitting)
  console.log('--- Removing duplicate questions ---');
  sections = removeDuplicateQuestions(sections);
  console.log('');

  // Phase 3: Split work_environment_preferences
  console.log('--- Splitting work_environment_preferences ---');
  sections = splitSection(sections, WORK_ENV_SPLIT);
  console.log('');

  // Phase 4: Split manager_team_fit
  console.log('--- Splitting manager_team_fit ---');
  sections = splitSection(sections, MANAGER_FIT_SPLIT);
  console.log('');

  // Phase 5: Reorder all sections
  console.log('--- Reordering sections ---');
  sections = reorderSections(sections);
  console.log('');

  // Update data
  data.questionnaire.sections = sections;
  updateMetadata(data, sections);

  // Validate
  validateResult(sections);

  // Save
  console.log('\n--- Saving ---');
  saveQuestionnaire(data);

  console.log('\nReorganization complete!');
}

main();
