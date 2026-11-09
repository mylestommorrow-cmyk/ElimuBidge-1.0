// @ts-nocheck -- imported code, original project was not type-checked strictly
export type CurriculumLevel =
  | "All"
  | "CBE"
  | "Early Years"
  | "Pre-Primary"
  | "Lower Primary"
  | "Upper Primary"
  | "Junior School"
  | "Senior School";

export type CbeStage =
  | "All"
  | "Early Years"
  | "Pre-Primary"
  | "Lower Primary"
  | "Upper Primary"
  | "Junior School"
  | "Senior School";

export type CbeGrade =
  | "All"
  | "Playgroup" // Kept only as optional Early Years (non-KICD)
  | "PP1"
  | "PP2"
  | "Grade 1"
  | "Grade 2"
  | "Grade 3"
  | "Grade 4"
  | "Grade 5"
  | "Grade 6"
  | "Grade 7"
  | "Grade 8"
  | "Grade 9"
  | "Grade 10"
  | "Grade 11"
  | "Grade 12";

export type SeniorSchoolPathway = "STEM" | "Social Sciences" | "Arts & Sports Science";

export type MathsType =
  | "Core Mathematics" // for STEM pathway
  | "Essential Mathematics"; // for Social Sciences and Arts & Sports Science

export type SubjectCategory =
  | "All"
  | "Mathematics"
  | "Integrated Science"
  | "English"
  | "Kiswahili"
  | "History"
  | "Agriculture"
  | "Pre-Technical & STEM"
  | "Creative Arts & Environmental"
  | "Social Studies";

// Official KICD Rationalised Learning Areas
export interface RationalisedLearningArea {
  id: string;
  name: string;
  category: SubjectCategory;
  stage: CbeStage;
  isCore: boolean;
  notes?: string;
  pathway?: SeniorSchoolPathway;
  mathsType?: MathsType;
}

export interface CurriculumDesignItem {
  id: string;
  stage: CbeStage;
  grade: CbeGrade;
  learningArea: string;
  pathway?: SeniorSchoolPathway;
  mathsType?: MathsType;
  strands: {
    title: string;
    subStrands: string[];
    coreCompetencies: string[];
    sampleLearningOutcomes: string[];
    isKicdVerified: boolean;
    verificationNote?: string;
  }[];
}

export interface ExamPaper {
  id: string;
  title: string;
  schoolCode: string;
  schoolName: string;
  gradeLevel: CbeGrade;
  learningArea: string;
  term: "Term 1" | "Term 2" | "Term 3";
  examType: "Opener" | "Mid-term" | "End-term" | "Mock" | "KPSEA" | "KCSE-style";
  year: number;
  fileUrl: string; // Blob URL, object URL, or remote Supabase signed URL
  fileName: string;
  fileType: "pdf" | "image";
  fileSize: string; // e.g. "2.4 MB"
  markingSchemeUrl?: string;
  markingSchemeName?: string;
  visibility: "my_school" | "all_schools";
  teacherConfirmedRights: boolean;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  previewSnippet?: string;
}

export interface ExamBankFilters {
  searchQuery: string;
  gradeLevel: string;
  learningArea: string;
  term: string;
  examType: string;
  year: string;
  schoolCode: string;
  visibility: string;
}

export interface StudyTopic {
  id: string;
  courseCode?: string; // e.g. "CBE-PG-01", "CBE-G8-02", "CBE-G12-01"
  credits?: number;
  term?: string;
  title: string;
  subject: string;
  category: SubjectCategory;
  level: "CBE";
  cbeStage?: CbeStage;
  gradeLevel: string; // e.g. "Playgroup", "PP1", "PP2", "Grade 1", ..., "Grade 12"
  gradeNumber?: number; // 0 for Playgroup/PP, 1-12 for Grades 1-12
  pathway?: SeniorSchoolPathway; // STEM | Social Sciences | Arts & Sports Science (Grades 10-12)
  mathsType?: MathsType; // Core Mathematics (STEM) or Essential Mathematics (Other)
  strand?: string;
  subStrand?: string;
  coreCompetency?: string;
  instructor: {
    name: string;
    role: string;
    institution: string;
    avatarUrl?: string;
  };
  rating: number;
  reviewsCount: number;
  offlineSize: string; // e.g. "1.2 MB"
  downloaded: boolean;
  coverImage: string;
  duration: string;
  summary: string;
  kicdCompetencies: string[];
  keyTerms: { term: string; definition: string }[];
  contentSections: {
    heading: string;
    body: string[];
    diagramLabel?: string;
    diagramKeyPoints?: string[];
    workedExample?: {
      problem: string;
      steps: string[];
      answer: string;
    };
  }[];
  commonMistakes: string[];
  quizId: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  contextSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  curriculumRef: string;
}

export interface RevisionQuiz {
  id: string;
  title: string;
  subject: string;
  category: SubjectCategory;
  level: "CBE";
  gradeLevel: string;
  questions: QuizQuestion[];
  estimatedMinutes: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: "streak" | "quiz" | "mastery" | "offline";
  tokenReward: number;
  iconName: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeGlow: string;
  };
  criteriaText: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: {
    current: number;
    max: number;
    unit: string;
  };
}

export interface LearnerProfile {
  id: string;
  regNo?: string; // e.g. "EB-CBE-2026-0842"
  academicStanding?: string;
  gpa?: string;
  name: string;
  grade: string;
  level: "CBE";
  schoolName: string;
  avatarColor: string;
  avatarUrl?: string; // Real profile photo
  role?: "learner" | "teacher" | "parent";
  seniorPathway?: SeniorSchoolPathway;
  seniorMathsType?: MathsType;
  seniorElectives?: string[];
  completedTopicsCount: number;
  quizzesTaken: number;
  averageScore: number;
  streakDays: number;
  tokensBalance: number;
  unlockedBadgeIds: string[];
  weakAreas: string[];
  recentQuizScores: { quizTitle: string; score: number; total: number; date: string }[];
  disabilityAccommodation?: string; // e.g. "Low Vision" | "ADHD" | "Autism Spectrum Disorder" | "Hearing Impairment" | "Dyslexia" | "Cerebral Palsy"
  accessibilitySettings?: {
    highContrast?: boolean;
    largeFont?: boolean;
    screenReaderOptimized?: boolean;
    simplifiedLanguage?: boolean;
    textToSpeech?: boolean;
  };
}

export type ChatbotRole =
  | "general-tutor"
  | "stem-expert"
  | "fast-assistant"
  | "sne-specialist"
  | "knec-examiner"
  | "kiswahili-mwalimu";

export interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
  language?: "en" | "sw";
  source?: string;
  sources?: Array<{ title: string; url: string }>;
  modelTier?: string;
  chatbotRole?: ChatbotRole;
}

export interface TeachingLink {
  id: string;
  schoolCode?: string; // e.g. "DEMO-CBE", "ALLIANCE-101", "KHS-2026"
  title: string;
  subject: string;
  gradeLevel: string; // "Playgroup", "PP1", ..., "Grade 12", or "All Grades"
  cbeStage?: CbeStage;
  url: string;
  type: "curriculum" | "lesson-plan" | "video" | "simulation" | "worksheet" | "assessment";
  description: string;
  addedBy: string; // Teacher name
  teacherRole?: string; // e.g. "Senior Science & STEM Facilitator"
  avatarUrl?: string; // Teacher real photo
  school?: string;
  addedAt: string;
  verified?: boolean;
}

export interface Announcement {
  id: string;
  authorName: string;
  authorRole: string; // e.g. "Head of CBE Science Dept", "CBE Grade 7 Lead Tutor"
  authorAvatar: string; // Real profile photo URL
  schoolName?: string;
  title: string;
  content: string;
  date: string;
  pinned?: boolean;
  cbeTargetGrade?: string; // e.g. "All CBE Grades", "Grade 7 - 9"
  category: "curriculum" | "exam" | "resource" | "general";
  teachingLink?: {
    title: string;
    url: string;
    type?: string;
  };
}

export interface DailyStudyGoal {
  profileId: string;
  goalType: "lessons" | "quiz_score" | "study_time";
  target: number; // e.g. 3 lessons, or 80%, or 30 mins
  current: number;
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
  lastUpdated: string;
}

export interface SchoolAccount {
  id: string;
  code: string; // e.g. "KHS-2026", "MFA-7701", "ALLIANCE-101", "DEMO-CBE"
  name: string;
  county: string;
  motto: string;
  badgeColor: string;
  logoEmoji: string;
  principalName: string;
  teacherPin: string; // 4-digit PIN for teacher verification when uploading or managing exam papers
  adminPin?: string;
  cbeStreams: string[]; // e.g. ["Pre-Primary", "Lower Primary", "Upper Primary", "Junior School", "Senior STEM"]
  registeredLearnersCount: number;
  notesCount: number;
}

export interface TeacherNote {
  id: string;
  schoolCode: string;
  title: string;
  subject: string;
  gradeLevel: string;
  cbeStage?: CbeStage;
  strand?: string;
  content: string; // Markdown / text notes
  keyFormulas?: string[];
  homeworkTask?: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  createdAt: string;
  attachments?: { title: string; url: string }[];
}

export interface DetailedQuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  gradeLevel: string;
  learnerId: string;
  learnerName: string;
  schoolCode: string;
  date: string;
  score: number;
  totalQuestions: number; // 30 questions
  percentage: number;
  timeSpentSeconds: number;
  letterGrade: string;
  performanceBand:
    | "Exceeding Expectations"
    | "Meeting Expectations"
    | "Approaching Expectations"
    | "Below Expectations";
  breakdown: {
    questionId: string;
    questionNumber: number;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation: string;
    curriculumRef: string;
  }[];
  aiFeedback?: string;
}

// ==========================================
// FULL KENYAN CBE ARCHITECTURE EXTENSIONS
// ==========================================

export type CompetencyLevel = "introduced" | "practised" | "demonstrated" | "requires_support";

export type CurriculumSourceType = "official_kicd" | "teacher_created";

export type AssessmentRubricBand =
  | "Exceeding Expectations"
  | "Meeting Expectations"
  | "Approaching Expectations"
  | "Below Expectations";

export interface AssessmentRubric {
  exceeding: string;
  meeting: string;
  approaching: string;
  below: string;
}

export interface SpecificLearningOutcome {
  id: string;
  code: string;
  title: string;
  description: string;
  experiences: string[];
  rubric?: AssessmentRubric;
}

export interface CurriculumSubStrand {
  id: string;
  substrandNumber: number;
  title: string;
  inquiryQuestions: string[];
  coreCompetencies: string[];
  values: string[];
  pcis: string[];
  outcomes: SpecificLearningOutcome[];
}

export interface CurriculumStrandRecord {
  id: string;
  strandNumber: number;
  title: string;
  description?: string;
  subStrands: CurriculumSubStrand[];
}

export interface ComprehensiveCurriculumRecord {
  id: string;
  stage: CbeStage;
  grade: CbeGrade;
  learningArea: string;
  pathway?: SeniorSchoolPathway;
  mathsType?: MathsType;
  strands: CurriculumStrandRecord[];
  sourceType: CurriculumSourceType;
  sourceDocument: string;
  sourceUrl?: string;
  curriculumVersion: string;
  publicationDate: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type CourseworkType =
  | "assignment"
  | "project"
  | "practical"
  | "digital_lesson"
  | "worksheet"
  | "teacher_notes"
  | "test";

export interface CourseworkItem {
  id: string;
  schoolCode?: string; // If undefined/null, it is a general independent resource
  learningArea: string;
  gradeLevel: CbeGrade;
  cbeStage: CbeStage;
  pathway?: SeniorSchoolPathway;
  strandTitle?: string;
  subStrandTitle?: string;
  outcomeCode?: string;
  itemType: CourseworkType;
  title: string;
  description: string;
  content?: string;
  instructions?: string[];
  dueDate?: string;
  totalMarks?: number;
  rubric?: AssessmentRubric;
  fileUrl?: string;
  fileType?: "pdf" | "video" | "doc" | "image";
  authorName: string;
  authorRole: string;
  isPublished: boolean;
  isSchoolOnly: boolean;
  createdAt: string;
}

export interface CourseworkSubmission {
  id: string;
  courseworkId: string;
  courseworkTitle: string;
  learnerId: string;
  learnerName: string;
  gradeLevel: string;
  schoolCode?: string;
  submittedAt: string;
  textSubmission?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  status: "submitted" | "graded" | "late";
  score?: number;
  totalMarks?: number;
  rubricBand?: AssessmentRubricBand;
  feedbackNotes?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface LearnerCompetencyEvaluation {
  id: string;
  learnerId: string;
  outcomeCode: string;
  outcomeTitle: string;
  learningArea: string;
  gradeLevel: string;
  cbeStage: CbeStage;
  status: CompetencyLevel;
  evidenceNotes?: string;
  evaluatedBy: string;
  evaluatedAt: string;
  rubricBand?: AssessmentRubricBand;
}

export type LearningMode = "school" | "independent";

export interface SchoolClassStream {
  id: string;
  schoolCode: string;
  grade: CbeGrade;
  streamName: string;
  facilitatorName: string;
  learnersCount: number;
}
