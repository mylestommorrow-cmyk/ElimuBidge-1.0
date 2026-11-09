import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { canShareActivity } from "./learning-activity";

export const pulseSchema = z.object({
  participants: z.number(),
  online: z.number(),
  lessons: z.number(),
  quizzes: z.number(),
  activities: z.number(),
  privacyThreshold: z.number(),
  feed: z.array(
    z.object({ kind: z.enum(["lesson", "quiz"]), subject: z.string(), count: z.number() }),
  ),
});
export type LearningPulse = z.infer<typeof pulseSchema>;

export const getLearningPulse = createServerFn({ method: "GET" }).handler(async () => {
  return {
    participants: 1850,
    online: 42,
    lessons: 1240,
    quizzes: 890,
    activities: 2130,
    privacyThreshold: 5,
    feed: [
      { kind: "quiz" as const, subject: "Mathematics", count: 24 },
      { kind: "lesson" as const, subject: "Science", count: 18 },
      { kind: "quiz" as const, subject: "English", count: 15 },
      { kind: "lesson" as const, subject: "Kiswahili", count: 12 },
    ],
  };
});

export const getLearningPrivacy = createServerFn({ method: "GET" }).handler(async () => {
  return { sharing_enabled: true, guardian_confirmed: true };
});

export const setLearningPrivacy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ enabled: z.boolean(), confirmed: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    if (data.enabled && !canShareActivity(data.enabled, data.confirmed))
      throw new Error("Adult or guardian permission is required.");
    return { saved: true };
  });

export const recordLearningEvent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        kind: z.enum(["lesson", "quiz"]),
        subject: z.enum(["Mathematics", "Science", "English", "Kiswahili", "Other learning"]),
        resource: z.string().min(1).max(120),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    return { recorded: true, subject: data.subject };
  });

export const touchLearningPresence = createServerFn({ method: "POST" }).handler(async () => {
  return { online: true };
});
