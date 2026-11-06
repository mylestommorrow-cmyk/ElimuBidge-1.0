// @ts-nocheck -- imported code, original project was not type-checked strictly
import { AchievementBadge, LearnerProfile } from "../types";

export const BADGES_CATALOG: Omit<AchievementBadge, "unlocked" | "unlockedAt" | "progress">[] = [
  {
    id: "badge-streak-3",
    title: "Savannah Spark",
    description: "Visited ElimuBridge and revised for 3 consecutive days.",
    category: "streak",
    tokenReward: 50,
    iconName: "Flame",
    colorScheme: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-900",
      badgeGlow: "from-amber-400 to-orange-500",
    },
    criteriaText: "Achieve a 3-day study streak",
  },
  {
    id: "badge-streak-7",
    title: "Safari Champion",
    description: "Completed a full week (7 consecutive days) of daily curriculum revision.",
    category: "streak",
    tokenReward: 150,
    iconName: "Award",
    colorScheme: {
      bg: "bg-orange-50",
      border: "border-orange-300",
      text: "text-orange-950",
      badgeGlow: "from-orange-500 to-red-500",
    },
    criteriaText: "Achieve a 7-day study streak",
  },
  {
    id: "badge-streak-14",
    title: "Unstoppable Scholar",
    description: "Maintained 14 consecutive days of relentless exam preparation.",
    category: "streak",
    tokenReward: 300,
    iconName: "Zap",
    colorScheme: {
      bg: "bg-purple-50",
      border: "border-purple-300",
      text: "text-purple-950",
      badgeGlow: "from-purple-600 to-indigo-600",
    },
    criteriaText: "Achieve a 14-day study streak",
  },
  {
    id: "badge-quiz-ace",
    title: "KNEC Sharpshooter",
    description: "Achieved 100% accuracy on a CBE practice quiz or continuous assessment.",
    category: "quiz",
    tokenReward: 100,
    iconName: "Target",
    colorScheme: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-950",
      badgeGlow: "from-emerald-500 to-teal-500",
    },
    criteriaText: "Score 100% on any practice drill",
  },
  {
    id: "badge-quiz-veteran",
    title: "Revision Drill Master",
    description: "Attempted and finished 5 or more curriculum quizzes.",
    category: "quiz",
    tokenReward: 100,
    iconName: "BookOpen",
    colorScheme: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-950",
      badgeGlow: "from-blue-500 to-cyan-500",
    },
    criteriaText: "Complete at least 5 revision quizzes",
  },
  {
    id: "badge-high-accuracy",
    title: "Distinction Mindset",
    description: "Earned an overall average score of 85% or higher across all drills.",
    category: "mastery",
    tokenReward: 200,
    iconName: "Sparkles",
    colorScheme: {
      bg: "bg-purple-50",
      border: "border-purple-300",
      text: "text-purple-950",
      badgeGlow: "from-purple-500 to-pink-500",
    },
    criteriaText: "Maintain an 85%+ average quiz score",
  },
  {
    id: "badge-offline-vault",
    title: "Offline Pioneer",
    description: "Downloaded and saved 3 or more lessons to your local offline vault.",
    category: "offline",
    tokenReward: 75,
    iconName: "Download",
    colorScheme: {
      bg: "bg-cyan-50",
      border: "border-cyan-300",
      text: "text-cyan-950",
      badgeGlow: "from-cyan-500 to-blue-500",
    },
    criteriaText: "Download 3+ lessons for offline studying",
  },
  {
    id: "badge-elimurunner",
    title: "Sprint Star",
    description: "Cleared curriculum checkpoints in ElimuSprint Savannah Run with 500+ points.",
    category: "mastery",
    tokenReward: 100,
    iconName: "Gamepad2",
    colorScheme: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-950",
      badgeGlow: "from-amber-400 to-yellow-500",
    },
    criteriaText: "Score 500+ points in ElimuSprint Game",
  },
];

/**
 * Dynamically computes badge unlock state and progress metrics for a given student
 */
export function evaluateStudentBadges(
  profile: LearnerProfile,
  offlineCount: number,
  studyStreak: number,
): { badges: AchievementBadge[]; totalTokens: number; unlockedCount: number } {
  const sprintHighScore = parseInt(localStorage.getItem("elimubridge_sprint_highscore") || "0", 10);
  const effectiveStreak = Math.max(studyStreak, profile.streakDays);

  const evaluated: AchievementBadge[] = BADGES_CATALOG.map((cat) => {
    let unlocked = false;
    let current = 0;
    let max = 1;
    let unit = "";

    switch (cat.id) {
      case "badge-streak-3":
        max = 3;
        current = effectiveStreak;
        unit = "days";
        unlocked = effectiveStreak >= 3 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      case "badge-streak-7":
        max = 7;
        current = effectiveStreak;
        unit = "days";
        unlocked = effectiveStreak >= 7 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      case "badge-streak-14":
        max = 14;
        current = effectiveStreak;
        unit = "days";
        unlocked = effectiveStreak >= 14 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      case "badge-quiz-ace":
        max = 1;
        const has100Pct = profile.recentQuizScores.some((q) => q.score === q.total && q.total > 0);
        current = has100Pct || profile.unlockedBadgeIds.includes(cat.id) ? 1 : 0;
        unit = "quiz";
        unlocked = current >= 1;
        break;

      case "badge-quiz-veteran":
        max = 5;
        current = Math.min(max, profile.quizzesTaken);
        unit = "quizzes";
        unlocked = profile.quizzesTaken >= 5 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      case "badge-high-accuracy":
        max = 85;
        current = Math.min(100, profile.averageScore);
        unit = "%";
        unlocked = profile.averageScore >= 85 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      case "badge-offline-vault":
        max = 3;
        current = Math.min(max, offlineCount);
        unit = "lessons";
        unlocked = offlineCount >= 3 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      case "badge-elimurunner":
        max = 500;
        current = Math.min(max, sprintHighScore);
        unit = "pts";
        unlocked = sprintHighScore >= 500 || profile.unlockedBadgeIds.includes(cat.id);
        break;

      default:
        unlocked = profile.unlockedBadgeIds.includes(cat.id);
    }

    return {
      ...cat,
      unlocked,
      unlockedAt: unlocked ? "Unlocked" : undefined,
      progress: {
        current,
        max,
        unit,
      },
    };
  });

  const unlockedCount = evaluated.filter((b) => b.unlocked).length;
  // Calculate total tokens based on unlocked badges
  const totalTokens = evaluated
    .filter((b) => b.unlocked)
    .reduce((sum, b) => sum + b.tokenReward, 0);

  return {
    badges: evaluated,
    totalTokens: Math.max(totalTokens, profile.tokensBalance || 0),
    unlockedCount,
  };
}
