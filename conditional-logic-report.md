# Conditional Logic Review Report

## Executive Summary

This report documents the review of ~1,200 questions across 8 questionnaires to identify and implement conditional logic. The review found that **the existing system is well-designed** with section-level FS gating already in place, and the proficiency slider approach (0-4 scale) naturally handles seniority differentiation.

### Changes Implemented

| File | Changes | Type |
|------|---------|------|
| candidate-profile.json | 6 certification questions | Role function gating |
| erm-candidate-profile.json | 4 detail fields | Intra-questionnaire |

**Total questions with conditionals before:** ~31
**Total questions with conditionals after:** ~41

---

## 1. Changes Applied

### 1.1 candidate-profile.json - Role Function Conditionals

Added `conditionalOn` to domain-specific certification questions, so candidates only see certifications relevant to their selected role functions.

| Question ID | Conditional On | Trigger Values |
|-------------|----------------|----------------|
| `certs_erm` | `role_functions_sought` | `["risk_management"]` |
| `certs_internal_audit` | `role_functions_sought` | `["internal_audit"]` |
| `certs_internal_controls` | `role_functions_sought` | `["internal_controls"]` |
| `certs_bcm_resilience` | `role_functions_sought` | `["bcm_resilience"]` |
| `certs_sustainability_esg` | `role_functions_sought` | `["sustainability_esg"]` |
| `certs_compliance_aml` | `role_functions_sought` | `["compliance"]` |

**Example:** A candidate selecting only "Internal Controls" role will not see ERM, Internal Audit, BCM, ESG, or Compliance certification questions.

**Note:** The date fields for each certification group (e.g., `certs_erm_dates`) already have conditionals on their parent certification field having a value, so they are naturally hidden when the parent is hidden.

### 1.2 erm-candidate-profile.json - Detail Field Conditionals

Added `conditionalOn` to detail text fields so they only appear when the parent select question has a meaningful value (not "none").

| Question ID | Conditional On | Trigger Values |
|-------------|----------------|----------------|
| `publications_detail` | `publications_thought_leadership` | `["internal", "blogs_social", "trade_press", "academic_whitepapers", "book_chapters"]` |
| `speaking_detail` | `speaking_presenting` | `["internal", "local_chapter", "regional_national", "international", "regular_circuit"]` |
| `associations_detail` | `professional_associations` | `["member", "active_participant", "committee_leadership", "board_leadership"]` |
| `innovation_detail` | `innovation_contributions` | `["internal_improvements", "cross_org", "industry_adoption", "recognised_innovation"]` |

---

## 2. Existing System Features (No Changes Needed)

### 2.1 FS Section Visibility - Already Handled

The `isSectionVisible()` function in `src/utils/questionnaireRegistry.ts` already gates FS top-up sections at the section level:

```typescript
if (questionnaireConfig.hasFsTopUp && questionnaireConfig.fsTopUpSectionId === sectionId) {
  return isFsSector;
}
```

This means the following FS sections are automatically shown/hidden based on sector selection:
- `fs_internal_audit` (ia-candidate-profile.json)
- `fs_internal_controls` (ic-candidate-profile.json)
- `fs_operational_resilience` (bcm-candidate-profile.json)
- `fs_sustainable_finance` (esg-sustainability-candidate-profile.json)

**No individual question conditionals needed.**

### 2.2 Proficiency Sliders Handle Seniority Naturally

The technical domain questionnaires use a 0-4 proficiency scale:
- 0 = No Experience
- 1 = Awareness
- 2 = Practical Application
- 3 = Implementation & Management
- 4 = Strategic Leadership

This design allows candidates at any seniority level to accurately self-assess. A junior candidate rates themselves 0-1, a senior candidate rates 3-4. Adding seniority-based conditionals would:
- Hide questions from junior candidates who might have some awareness
- Reduce the granularity of data collected
- Add complexity without clear benefit

**Recommendation:** Keep the current proficiency slider approach.

### 2.3 Questionnaire-Level Gating

The `getActiveQuestionnaires()` function already filters which questionnaires are shown based on:
- Selected role functions (triggers technical domain questionnaires)
- Sector selection (triggers FS-specific questionnaires)

This means users only see questionnaires relevant to their selections.

---

## 3. Conditional Logic System Reference

The system supports three conditional types:

### 3.1 `values` - Exact Match
```json
"conditionalOn": {
  "field": "parent_question_id",
  "values": ["value1", "value2"]
}
```
Show when field equals any of the specified values.

### 3.2 `contains` - Array Intersection
```json
"conditionalOn": {
  "field": "multiselect_question_id",
  "contains": ["value1", "value2"]
}
```
Show when multiselect field contains any of the specified values.

### 3.3 `hasValue` - Presence Check
```json
"conditionalOn": {
  "field": "parent_question_id",
  "hasValue": true
}
```
Show when field has any non-empty value.

### 3.4 Cross-Questionnaire References
Conditionals can reference fields from `candidate-profile` even when used in technical domain questionnaires. The system looks up `allResponses['candidate-profile']` when evaluating conditions.

---

## 4. Statistics by Questionnaire

| Questionnaire | Total Questions | With Conditionals | Notes |
|---------------|-----------------|-------------------|-------|
| candidate-profile.json | ~214 | 37 | +6 added for certifications |
| erm-candidate-profile.json | 140 | 4 | +4 added for detail fields |
| ia-candidate-profile.json | 126 | 0 | FS section handled at section level |
| ic-candidate-profile.json | 126 | 0 | FS section handled at section level |
| bcm-candidate-profile.json | 139 | 0 | FS section handled at section level |
| esg-sustainability-candidate-profile.json | 174 | 0 | FS section handled at section level |
| fs-compliance-candidate-profile.json | 170 | 0 | Already FS-only questionnaire |
| fs-risk-candidate-profile.json | 150 | 0 | Already FS-only questionnaire |

---

## 5. Testing Checklist

- [ ] Navigate wizard selecting only "Internal Controls" role function
  - Verify: Only Internal Controls certification question visible
  - Verify: ERM, IA, BCM, ESG, Compliance cert questions hidden

- [ ] Navigate wizard selecting "Risk Management" role function
  - Verify: ERM certification question visible
  - Verify: ERM questionnaire appears in wizard flow

- [ ] In ERM questionnaire, select "No publications" for thought leadership
  - Verify: Publication details field is hidden

- [ ] In ERM questionnaire, select "Trade press articles"
  - Verify: Publication details field appears

- [ ] Select Financial Services sector
  - Verify: FS top-up sections appear in IA, IC, BCM, ESG questionnaires

- [ ] Select Corporate sector
  - Verify: FS top-up sections are hidden

---

## 6. Future Considerations

### 6.1 Potential Enhancements (Not Implemented)

1. **Team size questions conditional on manager+ roles** - Several questionnaires have "Largest team managed" questions that could be hidden for non-management roles. However, these allow 0 as an answer, which already handles non-managers.

2. **Compound conditionals** - The current system supports single conditions. AND/OR logic would enable more sophisticated gating but adds complexity.

3. **Dynamic section visibility** - Currently sections are always shown (except FS top-ups). Making entire sections conditional based on prior answers could reduce questionnaire length.

### 6.2 Maintenance Notes

When adding new questions:
- Add `conditionalOn` if the question only makes sense after a specific prior answer
- For "specify other" patterns, use `"hasValue": true` on the parent
- For role-function-specific content, use `"contains": ["role_function_value"]` on `role_functions_sought`
- For FS-specific content, leverage existing section-level visibility rather than question-level conditionals

---

*Report generated: 2026-01-19*
*Reviewed questionnaires: 8*
*Total questions reviewed: ~1,200*
*Conditionals added: 10*
