import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
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
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  if (!key || !url) throw new Error("Live learning is unavailable.");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const { data, error } = await client.rpc("get_learning_pulse");
  if (error) throw new Error("Live learning is unavailable.");
  return pulseSchema.parse(data);
});
export const getLearningPrivacy = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("learning_privacy")
      .select("sharing_enabled,guardian_confirmed")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error("Privacy settings could not be loaded.");
    return data ?? { sharing_enabled: false, guardian_confirmed: false };
  });
export const setLearningPrivacy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ enabled: z.boolean(), confirmed: z.boolean() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    if (data.enabled && !canShareActivity(data.enabled, data.confirmed))
      throw new Error("Adult or guardian permission is required.");
    const { error } = await context.supabase.rpc("set_learning_sharing", {
      enabled: data.enabled,
      confirmed: data.confirmed,
    });
    if (error) throw new Error("Privacy settings could not be saved.");
    return { saved: true };
  });
export const recordLearningEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        kind: z.enum(["lesson", "quiz"]),
        subject: z.enum(["Mathematics", "Science", "English", "Kiswahili", "Other learning"]),
        resource: z.string().min(1).max(120),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { data: recorded, error } = await context.supabase.rpc("record_learning_event", {
      event_kind: data.kind,
      event_subject: data.subject,
      event_resource: data.resource,
    });
    if (error) throw new Error("Activity could not be saved.");
    return { recorded };
  });
export const touchLearningPresence = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.rpc("touch_learning_presence");
    if (error) throw new Error("Connection unavailable.");
  });
