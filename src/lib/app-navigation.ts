export const APP_VIEWS = [
  "dashboard",
  "library",
  "curriculum",
  "coursework",
  "competencies",
  "school",
  "exambank",
  "quizzes",
  "game",
  "tutor",
  "progress",
  "offline",
  "announcements",
  "resources",
  "portfolio",
  "admin",
] as const;
export type AppView = (typeof APP_VIEWS)[number];
export function isAppView(value: string): value is AppView {
  return APP_VIEWS.some((view) => view === value);
}
export function normalizeAppView(value: string): AppView | null {
  if (value === "school-mode") return "school";
  return isAppView(value) ? value : null;
}
export const VIEW_LABELS: Record<AppView, string> = {
  dashboard: "Dashboard",
  library: "Learning library",
  curriculum: "CBE curriculum",
  coursework: "Coursework & Projects",
  competencies: "Competency tracking",
  school: "School Mode",
  exambank: "Exam bank",
  quizzes: "Revision quizzes",
  game: "Games arcade",
  tutor: "Mwalimu AI",
  progress: "Learning progress",
  offline: "Saved lessons",
  announcements: "Noticeboard",
  resources: "Teacher resources",
  portfolio: "School portfolio",
  admin: "Curriculum admin",
};
