import { describe, it, expect } from "vitest";
import { isAppView } from "@/lib/app-navigation";
import { isPreviewHostname } from "@/lib/offline-app";
import { makeAccountLearner } from "@/lib/account-profile";
import { tutorRequestSchema, quizRequestSchema } from "@/lib/ai-validation";
describe("Preserved application capabilities", () => {
  it.each([
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
  ])("keeps %s navigable", (view) => expect(isAppView(view)).toBe(true));
  it("rejects nonexistent views", () => expect(isAppView("unknown")).toBe(false));
  it("starts real account learners without demo progress", () => {
    const learner = makeAccountLearner("Learner");
    expect(learner.name).toBe("Learner");
    expect(learner.quizzesTaken).toBe(0);
    expect(learner.averageScore).toBe(0);
    expect(learner.recentQuizScores).toEqual([]);
  });
});
describe("AI request validation", () => {
  it("rejects oversized conversation history", () =>
    expect(
      tutorRequestSchema.safeParse({
        prompt: "Explain fractions",
        history: [{ sender: "user", text: "x".repeat(4001) }],
      }).success,
    ).toBe(false));
  it("rejects scores exceeding the total", () =>
    expect(
      quizRequestSchema.safeParse({
        score: 31,
        total: 30,
        quizTitle: "Math",
        subject: "Math",
        gradeLevel: "Grade 8",
      }).success,
    ).toBe(false));
  it("accepts a concrete valid assessment", () =>
    expect(
      quizRequestSchema.parse({
        score: 24,
        total: 30,
        quizTitle: "Math",
        subject: "Math",
        gradeLevel: "Grade 8",
      }).score,
    ).toBe(24));
});
describe("Offline preview isolation", () => {
  it.each([
    "id-preview--abc.preview.app",
    "preview-2--abc.preview.app",
    "project--abc-dev.preview.app",
    "beta.preview.dev",
    "example.preview-project.com",
  ])("does not register offline on %s", (host) => expect(isPreviewHostname(host)).toBe(true));
  it("allows published custom domains", () =>
    expect(isPreviewHostname("preview-v2--school.example.com")).toBe(false));
});
