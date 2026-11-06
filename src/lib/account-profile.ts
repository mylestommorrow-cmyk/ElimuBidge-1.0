import type { LearnerProfile } from "@/elimu/types";
export function makeAccountLearner(name: string): LearnerProfile {
  return {
    id: "primary-learner",
    name: name || "My learner",
    grade: "Grade 8",
    level: "CBE",
    schoolName: "My school",
    avatarColor: "bg-primary",
    role: "learner",
    completedTopicsCount: 0,
    quizzesTaken: 0,
    averageScore: 0,
    streakDays: 0,
    tokensBalance: 0,
    unlockedBadgeIds: [],
    weakAreas: [],
    recentQuizScores: [],
  };
}
