// @ts-nocheck -- imported code, original project was not type-checked strictly
import { CourseworkItem, CourseworkSubmission, AssessmentRubricBand } from "../types";

export const COURSEWORK_STORAGE_KEY = "elimubridge_coursework_items_v1";
export const SUBMISSIONS_STORAGE_KEY = "elimubridge_coursework_submissions_v1";

// Initial seed of coursework items covering all levels and modes
export const INITIAL_COURSEWORK_ITEMS: CourseworkItem[] = [
  // Junior School - Grade 8 Practical Lab (Alliance / Kenya High / Demo School)
  {
    id: "cw-g8-cell-lab",
    schoolCode: "DEMO-CBE",
    learningArea: "Integrated Science",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    strandTitle: "Strand 1: Cell Structure and Microscopy",
    subStrandTitle: "Plant and Animal Cell Organelles",
    outcomeCode: "G8.SCI.1.1",
    itemType: "practical",
    title: "Laboratory Practical: Onion Epidermal Mount & Microscopy",
    description:
      "Prepare an epidermal wet mount of an Allium cepa (onion bulb) leaf using iodine stain. Observe, calculate field-of-view magnification, and submit labeled biological drawings.",
    content: `### Objective
To mount and examine plant cell walls, nuclei, and vacuolar membranes under a compound optical microscope.

### Materials Required
- Fresh onion bulb scale leaves
- Glass microscope slides & cover slips
- Iodine solution / Methylene blue
- Forceps, scalpel, and dissecting needles
- Dropper & blotting paper

### Instructions
1. Peel a thin, translucent epidermal layer from the concave surface of the onion scale.
2. Place the tissue flat in a single drop of water on a clean glass slide without creases.
3. Add one drop of dilute iodine solution to stain cellular starch and nuclei.
4. Lower a cover slip gently at a 45-degree angle using a mounted needle to eliminate air bubbles.
5. Focus under low power (x40), then rotate to medium magnification (x100).
6. Draw three adjacent cells with clean continuous lines (no shading) and label visible organelles.`,
    instructions: [
      "Wear eye safety goggles and laboratory apron.",
      "Submit high-resolution photographs or scanned sketches of your microscope drawings.",
      "State total magnification calculation: Objective Lens Power x Eyepiece Lens Power.",
    ],
    dueDate: "2026-11-20T17:00:00Z",
    totalMarks: 30,
    rubric: {
      exceeding:
        "Flawless slide preparation with zero air bubbles; precise biological drawings adhering strictly to KICD rules (clean single lines, horizontal label guidelines, stated magnification).",
      meeting:
        "Clean slide mount with minimal bubbles; accurately labels cell wall, nucleus, and cytoplasm with correct magnification calculation.",
      approaching:
        "Biological drawing contains shading or crossed label lines; slide has trapped bubbles obscuring organelles.",
      below:
        "Fails to obtain a clear microscope focus or produces inaccurate representation of cells.",
    },
    fileUrl: "/images/course_science_biology_1792611768420.jpg",
    fileType: "image",
    authorName: "Mwalimu James Ochieng",
    authorRole: "Head of CBE Sciences, Demo Academy",
    isPublished: true,
    isSchoolOnly: true,
    createdAt: "2026-10-15",
  },

  // Senior School - Grade 10 Project (STEM Pathway)
  {
    id: "cw-g10-bio-kinetics",
    schoolCode: undefined, // General Independent & School Learning Resource
    learningArea: "Integrated Science",
    gradeLevel: "Grade 10",
    cbeStage: "Senior School",
    pathway: "STEM",
    strandTitle: "Strand 1: Enzyme Kinetics & Homeostasis",
    subStrandTitle: "Enzyme Action and Limiting Factors",
    outcomeCode: "G10.BIO.1.1",
    itemType: "project",
    title: "STEM Project: Temperature Coefficient (Q10) in Biological Catalysis",
    description:
      "Design an investigation testing the rate of starch degradation by salivary amylase at temperatures ranging between 10°C and 70°C. Submit data tables and curve analyses.",
    content: `### Research Brief
Enzymes catalyse crucial physiological pathways. In this collaborative STEM investigation, learners empirically evaluate the collision theory and thermal denaturation thresholds.

### Deliverables
1. Empirical data table of achromic point times (minutes).
2. Rate of reaction curves (1/t vs Temperature).
3. Critical explanation of denaturation mechanism and activation energy reduction.`,
    instructions: [
      "Collect saliva safely into a sterile container and dilute with distilled water (1:5 ratio).",
      "Ensure pH is buffered to 6.8 across all test tubes.",
      "Tabulate results and upload your PDF report or typed submission.",
    ],
    dueDate: "2026-11-28T23:59:00Z",
    totalMarks: 50,
    rubric: {
      exceeding:
        "Calculates Q10 temperature coefficient accurately, synthesizes kinetic collision theory, and provides an exemplary experimental error audit.",
      meeting:
        "Plots accurate rate curves, identifies the optimal temperature range (37°C–40°C), and submits a structured scientific write-up.",
      approaching:
        "Collects data but makes errors in rate curve plotting or interpretation of the achromic point.",
      below: "Incomplete data collection with uncontrolled temperature variables.",
    },
    authorName: "Dr. Faith Mutheu",
    authorRole: "Senior STEM Curriculum Specialist",
    isPublished: true,
    isSchoolOnly: false,
    createdAt: "2026-10-20",
  },

  // Lower Primary - Grade 3 Homework / Worksheet
  {
    id: "cw-g3-env-water",
    schoolCode: undefined, // General Independent Resource
    learningArea: "Creative Arts & Environmental",
    gradeLevel: "Grade 3",
    cbeStage: "Lower Primary",
    strandTitle: "Strand 2: Environmental Health & Conservation",
    subStrandTitle: "Safe Water for Domestic Use",
    itemType: "worksheet",
    title: "Environmental Activity: Safe Water Purification at Home",
    description:
      "Explore the 3 steps to make water safe for drinking: sedimentation, boiling, and safe storage in clean, covered clay pots or jerrycans.",
    content: `### Why Must We Purify Water?
Water from rivers, boreholes, and rainwater can carry germs that make our stomachs sick. 

### Fun Home Activity:
1. Ask your parent or guardian to boil drinking water until large bubbles roll.
2. Pour the water into a clean kettle or pot.
3. Keep the pot covered with a clean lid.
4. Answer the questions in your notebook or type them below!`,
    instructions: [
      "Draw 2 containers used to store clean water in your home.",
      "Write 3 diseases prevented by drinking boiled water (e.g. Typhoid, Cholera).",
    ],
    dueDate: "2026-11-25T16:00:00Z",
    totalMarks: 20,
    rubric: {
      exceeding:
        "Draws and labels water purification methods with creative suggestions for rainwater harvesting.",
      meeting: "Accurately lists boiling and safe storage practices with clean illustrations.",
      approaching: "Lists boiling but misses storage protection guidelines.",
      below: "Needs parental guidance to state reasons for water cleanliness.",
    },
    authorName: "Tr. Mercy Chebet",
    authorRole: "Primary Environmental Lead",
    isPublished: true,
    isSchoolOnly: false,
    createdAt: "2026-10-25",
  },
];

// Initial pre-seeded student submissions
export const INITIAL_SUBMISSIONS: CourseworkSubmission[] = [
  {
    id: "sub-101",
    courseworkId: "cw-g8-cell-lab",
    courseworkTitle: "Laboratory Practical: Onion Epidermal Mount & Microscopy",
    learnerId: "demo-learner-1",
    learnerName: "Zawadi Kamau",
    gradeLevel: "Grade 8",
    schoolCode: "DEMO-CBE",
    submittedAt: "2026-11-01T14:30:00Z",
    textSubmission:
      "I successfully prepared the wet mount using iodine stain on an onion epidermal peel. Magnification was set to 100x (10x eyepiece x 10x objective). The rectangular cell walls were visible clearly with distinct dark blue-brown nuclei located towards the periphery.",
    attachmentUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    attachmentName: "Zawadi_Onion_Cell_Mount_Drawing.jpg",
    status: "graded",
    score: 28,
    totalMarks: 30,
    rubricBand: "Exceeding Expectations",
    feedbackNotes:
      "Exemplary biological drawing Zawadi! Clean, unshaded pencil lines and accurate identification of the vacuole and cell wall. Keep up the high standard of scientific documentation.",
    gradedBy: "Mwalimu James Ochieng",
    gradedAt: "2026-11-02T09:15:00Z",
  },
];

export function getStoredCoursework(): CourseworkItem[] {
  try {
    const raw = localStorage.getItem(COURSEWORK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load coursework from storage", e);
  }
  return INITIAL_COURSEWORK_ITEMS;
}

export function saveCoursework(items: CourseworkItem[]): void {
  try {
    localStorage.setItem(COURSEWORK_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save coursework", e);
  }
}

export function addCourseworkItem(item: CourseworkItem): void {
  const current = getStoredCoursework();
  const updated = [item, ...current];
  saveCoursework(updated);
}

export function getStoredSubmissions(): CourseworkSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load submissions from storage", e);
  }
  return INITIAL_SUBMISSIONS;
}

export function saveSubmissions(subs: CourseworkSubmission[]): void {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error("Failed to save submissions", e);
  }
}

export function submitCoursework(submission: CourseworkSubmission): void {
  const current = getStoredSubmissions();
  const existingIdx = current.findIndex(
    (s) => s.courseworkId === submission.courseworkId && s.learnerId === submission.learnerId,
  );
  let updated: CourseworkSubmission[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = submission;
  } else {
    updated = [submission, ...current];
  }
  saveSubmissions(updated);
}

export function gradeSubmission(
  submissionId: string,
  score: number,
  rubricBand: AssessmentRubricBand,
  feedbackNotes: string,
  gradedBy: string,
): boolean {
  const subs = getStoredSubmissions();
  const target = subs.find((s) => s.id === submissionId);
  if (!target) return false;

  target.status = "graded";
  target.score = score;
  target.rubricBand = rubricBand;
  target.feedbackNotes = feedbackNotes;
  target.gradedBy = gradedBy;
  target.gradedAt = new Date().toISOString();

  saveSubmissions(subs);
  return true;
}
