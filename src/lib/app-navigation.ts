export const APP_VIEWS = [
  "dashboard",
  "library",
  "curriculum",
  "exambank",
  "quizzes",
  "game",
  "tutor",
  "progress",
  "offline",
  "announcements",
  "resources",
  "portfolio",
] as const;
export type AppView = (typeof APP_VIEWS)[number];
export function isAppView(value: string): value is AppView {
  return APP_VIEWS.some((view) => view === value);
}
export const VIEW_LABELS: Record<AppView, string> = {
  dashboard: "Dashboard",
  library: "Learning library",
  curriculum: "CBE curriculum",
  exambank: "Exam bank",
  quizzes: "Revision quizzes",
  game: "Games arcade",
  tutor: "Mwalimu AI",
  progress: "Learning progress",
  offline: "Saved lessons",
  announcements: "Noticeboard",
  resources: "Teacher resources",
  portfolio: "School portfolio",
};
