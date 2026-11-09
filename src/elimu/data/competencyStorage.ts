// @ts-nocheck -- imported code, original project was not type-checked strictly
import {
  LearnerCompetencyEvaluation,
  CompetencyLevel,
  AssessmentRubricBand,
  CbeStage,
} from "../types";

export const COMPETENCY_STORAGE_KEY = "elimubridge_learner_competencies_v1";

export const INITIAL_COMPETENCY_EVALUATIONS: LearnerCompetencyEvaluation[] = [
  {
    id: "eval-01",
    learnerId: "demo-learner-1",
    outcomeCode: "G8.SCI.1.1",
    outcomeTitle: "Prepare temporary wet mount slides and observe under a microscope",
    learningArea: "Integrated Science",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    status: "demonstrated",
    evidenceNotes:
      "Observed preparing an onion epidermal wet mount with iodine stain during practical session. Clean focus under x100 with no visible bubbles.",
    evaluatedBy: "Mwalimu James Ochieng",
    evaluatedAt: "2026-11-02",
    rubricBand: "Exceeding Expectations",
  },
  {
    id: "eval-02",
    learnerId: "demo-learner-1",
    outcomeCode: "G8.SCI.1.2",
    outcomeTitle: "Compare and contrast plant versus animal cells",
    learningArea: "Integrated Science",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    status: "demonstrated",
    evidenceNotes:
      "Tabulated 4 accurate structural differences in CAT 1 and articulated physiological need for cellulose cell wall turgor pressure.",
    evaluatedBy: "Mwalimu James Ochieng",
    evaluatedAt: "2026-10-28",
    rubricBand: "Meeting Expectations",
  },
  {
    id: "eval-03",
    learnerId: "demo-learner-1",
    outcomeCode: "G8.SCI.2.1",
    outcomeTitle: "Represent electron configurations for elements 1 to 20",
    learningArea: "Integrated Science",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    status: "practised",
    evidenceNotes:
      "Drew Bohr diagrams accurately for Lithium through Sodium. Requires slight practice on maximum valence electron limits for elements 17 to 20 (Argon, Potassium, Calcium).",
    evaluatedBy: "Mwalimu Grace Wanjiku",
    evaluatedAt: "2026-11-04",
    rubricBand: "Approaching Expectations",
  },
  {
    id: "eval-04",
    learnerId: "demo-learner-1",
    outcomeCode: "G8.MATH.3.2",
    outcomeTitle: "Calculate surface area of combined solid prisms",
    learningArea: "Mathematics",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    status: "requires_support",
    evidenceNotes:
      "Struggles when identifying common intersecting faces in composite cylindrical prisms. Scheduled for remedial peer-coaching.",
    evaluatedBy: "Mwalimu Peter Kiprop",
    evaluatedAt: "2026-11-05",
    rubricBand: "Below Expectations",
  },
];

export function getStoredCompetencies(): LearnerCompetencyEvaluation[] {
  try {
    const raw = localStorage.getItem(COMPETENCY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load competencies from storage", e);
  }
  return INITIAL_COMPETENCY_EVALUATIONS;
}

export function saveCompetencies(evals: LearnerCompetencyEvaluation[]): void {
  try {
    localStorage.setItem(COMPETENCY_STORAGE_KEY, JSON.stringify(evals));
  } catch (e) {
    console.error("Failed to save competencies", e);
  }
}

export function getLearnerCompetencies(learnerId: string): LearnerCompetencyEvaluation[] {
  const all = getStoredCompetencies();
  return all.filter((e) => e.learnerId === learnerId);
}

export function evaluateCompetency(evaluation: Omit<LearnerCompetencyEvaluation, "id">): void {
  const current = getStoredCompetencies();
  const existingIdx = current.findIndex(
    (e) => e.learnerId === evaluation.learnerId && e.outcomeCode === evaluation.outcomeCode,
  );

  const newRecord: LearnerCompetencyEvaluation = {
    ...evaluation,
    id: `eval-${Date.now()}`,
  };

  let updated: LearnerCompetencyEvaluation[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newRecord;
  } else {
    updated = [newRecord, ...current];
  }

  saveCompetencies(updated);
}

export function getCompetencySummary(learnerId: string) {
  const list = getLearnerCompetencies(learnerId);
  const total = list.length;
  const demonstrated = list.filter((e) => e.status === "demonstrated").length;
  const practised = list.filter((e) => e.status === "practised").length;
  const introduced = list.filter((e) => e.status === "introduced").length;
  const requiresSupport = list.filter((e) => e.status === "requires_support").length;

  return {
    total,
    demonstrated,
    practised,
    introduced,
    requiresSupport,
    demonstratedPercentage: total > 0 ? Math.round((demonstrated / total) * 100) : 0,
  };
}
