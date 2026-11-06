import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";

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
export const getAccountProfiles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: account, error: accountError } = await context.supabase
      .from("profiles")
      .select("display_name")
      .eq("id", context.userId)
      .single();
    if (accountError) throw new Error("Your account profile could not be loaded.");
    const { data, error } = await context.supabase
      .from("learner_profiles")
      .select("data")
      .eq("owner_id", context.userId)
      .order("updated_at");
    if (error) throw new Error("Your learner profiles could not be loaded.");
    return {
      ownerId: context.userId,
      displayName: account.display_name,
      profiles: data.map((row) => row.data),
    };
  });
export const saveAccountProfiles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ profiles: z.array(learnerSchema).min(1).max(50) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const rows = data.profiles.map((profile) => ({
      id: profile.id,
      owner_id: context.userId,
      data: profile as Json,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await context.supabase
      .from("learner_profiles")
      .upsert(rows, { onConflict: "owner_id,id" });
    if (error) throw new Error("Your profiles could not be saved. Please try again.");
    return { saved: rows.length };
  });
