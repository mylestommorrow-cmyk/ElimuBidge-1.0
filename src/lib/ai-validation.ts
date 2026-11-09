import { z } from "zod";
export const tutorRequestSchema = z.object({
  prompt: z.string().trim().min(1).max(4000),
  language: z.enum(["en", "sw"]).default("en"),
  learnerGrade: z.string().max(60).default("Grade 8"),
  pathway: z.string().max(60).optional(),
  useSearch: z.boolean().optional(),
  subject: z.string().max(120).default("General"),
  sneAccommodations: z.string().max(100).optional(),
  sneStageLevel: z.enum(["Foundation", "Intermediate", "Pre-Vocational"]).optional(),
  role: z
    .enum([
      "general-tutor",
      "stem-expert",
      "fast-assistant",
      "sne-specialist",
      "knec-examiner",
      "kiswahili-mwalimu",
    ])
    .optional(),
  targetModel: z.enum(["gemini-3.8-flash", "gemini-4-argon", "gemini-3.1-flash-lite"]).optional(),
  history: z
    .array(z.object({ sender: z.enum(["user", "tutor", "model"]), text: z.string().max(4000) }))
    .max(8)
    .default([]),
});
export const quizRequestSchema = z
  .object({
    score: z.number().int().min(0).max(1000),
    total: z.number().int().min(1).max(1000),
    quizTitle: z.string().min(1).max(240),
    subject: z.string().min(1).max(120),
    gradeLevel: z.string().min(1).max(60),
    missedQuestions: z.array(z.string().max(2000)).max(30).default([]),
  })
  .refine((data) => data.score <= data.total, { message: "Score cannot exceed total" });
