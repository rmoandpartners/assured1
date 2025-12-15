# Questionnaire System Audit Summary

**Date:** 15 December 2025
**Version:** 1.1 (Updated after remediation)
**System:** Assured Recruitment Candidate-Role Matching Questionnaires

---

## Executive Summary

The Assured Recruitment questionnaire system is a comprehensive, multi-layered assessment framework designed to match candidates with job roles across seven technical domains in risk, audit, and control functions. The system comprises **19 JSON files** containing **2,605 total questions** with sophisticated bidirectional mirroring for intelligent candidate-role matching.

### Key Metrics

| Metric | Value |
|--------|-------|
| Total JSON files | 19 |
| Total questions | 2,605 |
| Technical domains | 7 |
| Profile pairs (candidate + role) | 7 |
| Soft skill questions (general profile) | 41 |
| Technical skill definitions | 20 |
| Proficiency-based questions | 1,364 |
| Mirror relationships | 2,117+ |

---

## System Architecture

### Profile Hierarchy

```
                           CLIENT PROFILE
                          (127 questions)
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
       LINE MANAGER        JOB PROFILE         CANDIDATE
         PROFILE          (163 questions)        PROFILE
       (85 questions)           │             (220 questions)
              │                 │                  │
              └────────┬────────┴──────────────────┘
                       │
        ┌──────────────┼──────────────────┐
        │              │                  │
   TECHNICAL      TECHNICAL          TECHNICAL
   CANDIDATE      CANDIDATE          CANDIDATE
    PROFILE        PROFILE            PROFILE
        │              │                  │
        ▼              ▼                  ▼
   TECHNICAL      TECHNICAL          TECHNICAL
     ROLE           ROLE               ROLE
    PROFILE        PROFILE            PROFILE
```

### Profile Types

| Profile Type | Purpose | Count | Avg Questions |
|--------------|---------|-------|---------------|
| General Candidate | Core candidate information, soft skills, preferences | 1 | 220 |
| General Job | Role requirements, work environment, hiring process | 1 | 163 |
| Client | Company information, culture, benefits, processes | 1 | 127 |
| Line Manager | Hiring manager profile, leadership style, preferences | 1 | 85 |
| Technical Candidate | Domain-specific technical competencies | 7 | 146 |
| Technical Role | Domain-specific role requirements | 7 | 138 |
| Reference | Technical skills framework definitions | 1 | 20 skills |

---

## Technical Domains

### Domain Coverage Matrix

| Domain | Code | Candidate Qs | Role Qs | Sections | Focus Areas |
|--------|------|--------------|---------|----------|-------------|
| Internal Audit | IA | 126 | 121 | 18-19 | Standards, IT audit, SOX, fraud, methodology |
| Internal Controls | IC | 126 | 121 | 18-19 | COSO, Provision 29, ICFR, testing, remediation |
| Enterprise Risk Management | ERM | 140 | 110 | 15-18 | Frameworks, appetite, KRIs, scenario analysis |
| Business Continuity Management | BCM | 139 | 135 | 18-19 | BIA, crisis, resilience, exercises, recovery |
| Financial Services Risk | FS-RISK | 150 | 145 | 23-24 | Credit, market, liquidity, OpRes, DORA |
| Financial Services Compliance | FS-COMPLIANCE | 170 | 165 | 21-22 | SM&CR, AML, Consumer Duty, RegTech |
| ESG & Sustainability | ESG | 174 | 169 | 20-21 | Reporting frameworks, climate, social, governance |

### Technical Profile Structure

Each technical domain includes:

1. **Experience Overview** - Years of experience, seniority, scope
2. **Framework Knowledge** - Relevant standards and methodologies
3. **Systems & Technology** - GRC platforms, tools, data analytics
4. **Core Competency Areas** - 10-20 domain-specific skill sections
5. **Financial Services Specialism** - FS-specific requirements (where applicable)
6. **Additional Information** - Supplementary context

---

## Mirroring System

### How Mirroring Works

The questionnaire system uses bidirectional mirroring to enable intelligent matching:

**Candidate Profile** contains `mirrorsRole` references:
```json
{
  "id": "risk_appetite_proficiency",
  "mirrorsRole": {
    "questionId": "risk_appetite_required",
    "matchType": "minimum"
  }
}
```

**Role Profile** contains `mirrorsCandidate` references:
```json
{
  "id": "risk_appetite_required",
  "mirrorsCandidate": {
    "questionId": "risk_appetite_proficiency",
    "matchType": "minimum"
  }
}
```

### Match Types

| Match Type | Count | Purpose |
|------------|-------|---------|
| `minimum` | 1,756 | Candidate proficiency must meet or exceed role requirement |
| `importance` | 157 | Weighted scoring based on role importance rating |
| `compatibility` | 116 | Bi-directional preference alignment (work style, culture) |
| `overlap` | 48 | Multiple selections compared for common elements |
| `appeal` | 7 | Client attributes that appeal to candidate preferences |
| `exact` | 5 | Precise match required (e.g., location, language) |
| `language_match` | 5 | Language proficiency comparison |
| `system_match` | 3 | GRC/technology platform experience alignment |
| `eligibility` | 3 | Binary eligibility check (visa, relocation) |
| `requirements` | 3 | Candidate meets mandatory requirements |
| `system_proficiency` | 2 | Platform-specific proficiency matching |
| `range`/`range_overlap` | 4 | Numeric range comparison (salary, notice) |
| `distance` | 2 | Geographic proximity calculation |
| `location` | 1 | Location matching |
| `timeline` | 1 | Start date compatibility |
| `date_compatibility` | 1 | Availability date matching |
| `flexibility` | 1 | Notice period flexibility assessment |
| `preference` | 2 | Soft preference matching |

### Mirroring Statistics by Profile Pair

| Domain | Candidate mirrorsRole | Role mirrorsCandidate | Balance |
|--------|----------------------|----------------------|---------|
| BCM | 134 | 134 | Balanced |
| ERM | 109 | 109 | Balanced |
| ESG | 169 | 169 | Balanced |
| FS-Compliance | 165 | 165 | Balanced |
| FS-Risk | 145 | 145 | Balanced |
| IA | 121 | 121 | Balanced |
| IC | 121 | 121 | Balanced |

---

## Proficiency Framework

### 5-Level Scale (0-4)

| Level | Label | Description |
|-------|-------|-------------|
| **0** | No Experience | No exposure or experience in this area |
| **1** | Developing | Has tested, reviewed, or observed existing frameworks. External perspective. |
| **2** | Proficient | Can operate, maintain, and improve established frameworks. Works independently. |
| **3** | Advanced | Can implement and adapt frameworks. Builds and leads for specific contexts. |
| **4** | Expert | Can design from first principles. Creates methodologies. Enterprise-wide scope. |

### Differentiating Dimensions

| Level | Perspective | Ownership | Scope |
|-------|-------------|-----------|-------|
| 1 | External auditor/reviewer | Tested someone else's work | Individual controls |
| 2 | Internal operator | Inherited and maintained | Control environment |
| 3 | Implementer/project lead | Built using templates | Function-wide |
| 4 | Designer/strategist | Designed the methodology | Enterprise-wide |

### 20 Technical Skills Defined

1. Internal Controls (SOX/Non-SOX)
2. Risk Appetite & Risk Framework
3. Risk & Control Self-Assessment (RCSA)
4. Policy & Procedure Development
5. Regulatory Change Management
6. Audit Planning & Execution
7. Third Party Risk Management (TPRM)
8. Operational Resilience & Business Continuity
9. Data Analytics for Risk & Audit
10. Issue & Action Management
11. Fraud Risk Management
12. Model Risk Management
13. Regulatory Reporting
14. Corporate Governance Frameworks
15. IT General Controls (ITGCs)
16. Data Privacy & Protection
17. AML & Financial Crime
18. Cyber Security Risk
19. Conduct Risk Management
20. Scenario Analysis & Stress Testing

---

## Soft Skills Framework

### General Profile Soft Skills (41 questions)

Located in `candidate-profile.json` and `job-profile.json`:

| Category | Questions | Focus Areas |
|----------|-----------|-------------|
| Strategic & Commercial Acumen | 7 | Business understanding, commercial awareness, strategic thinking |
| Leadership & Talent Management | 9 | Team building, coaching, talent development, change leadership |
| Stakeholder Engagement & Influence | 9 | Executive communication, negotiation, relationship management |
| Problem Solving & Execution | 8 | Analytical thinking, decision making, implementation |
| Personal Effectiveness & Resilience | 8 | Adaptability, time management, stress management |

### Design Philosophy

Soft skills are centralised in the general candidate/job profiles to:
- Avoid duplication across technical profiles
- Maintain consistency in assessment criteria
- Allow domain-specific examples within general definitions
- Enable cross-domain comparison

---

## Question Type Distribution

| Type | Count | Usage |
|------|-------|-------|
| `slider` | 1,953 | Proficiency ratings (0-4 scale) |
| `select` | 288 | Single choice from options |
| `textarea` | 107 | Free text responses |
| `multiselect` | 78 | Multiple choice selections |
| `number` | 57 | Numeric values |
| `text` | 47 | Short text input |
| `system_proficiency` | 20 | GRC/technology platform ratings |
| `url` | 7 | Web links |
| `checkbox` | 7 | Boolean yes/no |
| `tel` | 6 | Phone numbers |
| `email` | 5 | Email addresses |
| `heading` | 4 | Section headers |
| `date` | 3 | Date selections |
| `display` | 2 | Read-only information |
| `file` | 1 | File upload |

---

## Metadata & Completion Estimates

| Profile | Target Audience | Est. Time |
|---------|----------------|-----------|
| candidate-profile.json | Risk, Audit and Control Professionals | 35 mins |
| job-profile.json | Hiring Managers and HR Professionals | 27 mins |
| client-profile.json | HR Leaders, Talent Acquisition, Hiring Managers | 35 mins |
| line-manager-profile.json | HR/Talent Acquisition (on behalf of managers) | 25 mins |

---

## Improvement Recommendations

### Resolved Issues (15 December 2025)

#### 1. Metadata Question Count Discrepancies - RESOLVED
**Issue:** The metadata `totalQuestions` values didn't match actual question counts.
**Resolution:** Updated all 18 profile files with accurate `totalQuestions`, `totalSections`, `estimatedCompletionMinutes`, and `lastUpdated` fields.

#### 2. FS-Risk Missing Question - RESOLVED
**Issue:** `nist_ai_rmf` question existed in candidate profile but not in role profile.
**Resolution:** Added matching `nist_ai_rmf` question to fs-risk-role-profile.json in the "AI & Model Risk" section.

#### 3. ERM Question Gap - CONFIRMED INTENTIONAL
**Issue:** ERM has 140 candidate questions but only 110 role questions (30 question gap).
**Finding:** Investigation confirmed this is intentional design. The 30 "missing" questions are candidate-specific items that have no role equivalent:
- Professional contributions (publications, speaking, mentoring)
- Transferable skills assessment
- Career-specific questions (experience breakdown, achievements)

These questions assess the candidate holistically and don't require corresponding role requirements.

### Corrected False Positives

The following issues from the initial audit were investigated and found to be non-issues:

| Issue | Finding | Status |
|-------|---------|--------|
| BCM "139 broken mirrors" | Question-level mirrors work correctly; section naming differs but doesn't affect matching | Not an issue |
| ID naming inconsistency | 98% of IDs use snake_case consistently; no camelCase found | Not an issue |
| Option value inconsistency | Strategic variation by purpose (descriptive vs abbreviated vs numeric) | By design |

### Remaining Items (Future Consideration)

#### 4. Section Naming Consistency
**Issue:** Some technical profiles have inconsistent section naming between candidate and role versions (e.g., "Experience Overview" vs "Role Requirements").

**Recommendation:** Standardise section naming conventions across all profile pairs.

#### 5. Validation Rules
**Issue:** Not all questions have validation rules defined (min/max length, required fields).

**Recommendation:** Add comprehensive validation rules for:
- Textarea minimum lengths
- Number field ranges
- Required field consistency between candidate/role pairs

#### 6. Conditional Logic Documentation
**Issue:** Many questions use `conditionalOn` but the logic isn't documented in metadata.

**Recommendation:** Add a `conditionalLogic` section to metadata explaining dependencies.

### Low Priority

#### 7. Interview Questions Integration
**Issue:** Technical skills framework includes interview questions but these aren't linked to the questionnaire responses.

**Recommendation:** Consider adding a `verificationQuestions` array to proficiency questions to assist interviewers.

#### 8. Version Alignment
**Issue:** Different profiles have different version numbers (1.0.0, 1.2.0, 1.3.0).

**Recommendation:** Establish a versioning policy - consider whether profiles should share version numbers or be independently versioned.

#### 9. Help Text Coverage
**Issue:** Only ~40% of questions have `helpText` defined.

**Recommendation:** Add contextual help text to improve completion quality and reduce ambiguity.

#### 10. Accessibility Metadata
**Issue:** No accessibility-related metadata (ARIA labels, screen reader guidance).

**Recommendation:** Add accessibility metadata for frontend implementation.

---

## Technical Debt

### Reviewed and Accepted

1. **Question ID Naming** - Investigated and found consistent:
   - 98% use snake_case (e.g., `risk_appetite_proficiency`)
   - 0% use camelCase
   - Domain prefixes (`fs_`, `bcm_`, `erm_`) used strategically for domain-specific questions
   - **Status:** No action required

2. **Option Value Conventions** - Investigated and found intentionally varied:
   - Descriptive values for UI clarity (`highly_collaborative`)
   - Abbreviated codes for storage efficiency (`2_3_years`)
   - Numeric strings for scale values (`"3"`, `"4.5"`)
   - **Status:** By design - no action required

### Minor Technical Debt

3. **Type Definitions** - Question types are strings rather than enums, allowing potential typos.
   - **Risk:** Low (no typos found in current files)
   - **Recommendation:** Consider JSON Schema validation in build pipeline

---

## File Relationships

### Primary Relationships

```
candidate-profile.json ◄─────► job-profile.json
         │                           │
         │                           │
         ▼                           ▼
client-profile.json ◄───────► line-manager-profile.json
```

### Technical Profile Pairs

```
ia-candidate-profile.json ◄────► ia-role-profile.json
ic-candidate-profile.json ◄────► ic-role-profile.json
erm-candidate-profile.json ◄───► erm-role-profile.json
bcm-candidate-profile.json ◄───► bcm-role-profile.json
fs-risk-candidate-profile.json ◄─► fs-risk-role-profile.json
fs-compliance-candidate-profile.json ◄─► fs-compliance-role-profile.json
esg-sustainability-candidate-profile.json ◄─► esg-sustainability-role-profile.json
```

### Reference Data

```
technical-skills-definitions.json ─── Referenced by proficiency questions
technical-skills-guide.md ─────────── Human-readable documentation
```

---

## Conclusion

The Assured Recruitment questionnaire system is a well-architected, comprehensive assessment framework with:

**Strengths:**
- Consistent bidirectional mirroring across all technical profiles
- Robust 5-level proficiency framework with clear differentiation
- Separation of soft skills (general) from technical skills (domain-specific)
- Comprehensive domain coverage for risk, audit, and control functions
- Sophisticated match type system for nuanced candidate-role matching
- Accurate metadata tracking across all profiles

**Remediation Completed (15 December 2025):**
- Fixed FS-Risk `nist_ai_rmf` orphan reference
- Updated metadata in all 18 profile files with accurate question counts
- Verified BCM and ERM mirror structures (confirmed working correctly)
- Documented intentional design decisions (ERM question gap, option value conventions)

**Remaining Future Enhancements:**
- Section naming standardisation (cosmetic)
- Validation rule coverage expansion
- Help text standardisation
- Conditional logic documentation

The system is **production-ready** with all critical issues resolved.

---

*Initial Audit: 15 December 2025*
*Remediation Complete: 15 December 2025*
*Files Analysed: 19*
*Total Questions: 2,606* (after adding nist_ai_rmf to FS-Risk role)
