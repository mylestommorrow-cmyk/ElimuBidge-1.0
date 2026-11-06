import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
export async function authorizeLiveAI(
  request: Request,
  url: string | undefined,
  key: string | undefined,
): Promise<"allowed" | "guest" | "limited"> {
  const header = request.headers.get("authorization");
  if (!url || !key || !header?.startsWith("Bearer ")) return "guest";
  const token = header.slice(7);
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: header } },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return "guest";
  const { data: allowed, error: limitError } = await client.rpc("consume_ai_request");
  if (limitError || !allowed) return "limited";
  return "allowed";
}
