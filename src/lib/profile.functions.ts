import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const learnerSchema = z
  .object({
    id: z.string().min(1).max(120),
    name: z.string().min(1).max(120),
    grade: z.string().max(60),
    schoolName: z.string().max(240),
    level: z.literal("CBE"),
    completedTopicsCount: z.number().int().nonnegative(),
    quizzesTaken: z.number().int().nonnegative(),
    averageScore: z.number().min(0).max(100),
    streakDays: z.number().int().nonnegative(),
  })
  .passthrough();

export const getAccountProfiles = createServerFn({ method: "GET" }).handler(async () => {
  return {
    ownerId: "firebase-account",
    displayName: "Elimu Learner",
    role: "student",
    profiles: [] as any[],
  };
});

export const saveAccountProfiles = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ profiles: z.array(learnerSchema).min(1).max(50) }).parse(input),
  )
  .handler(async ({ data }) => {
    return { saved: data.profiles.length };
  });
