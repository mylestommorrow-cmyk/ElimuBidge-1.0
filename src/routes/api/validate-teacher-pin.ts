import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/validate-teacher-pin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body: any = await request.json().catch(() => ({}));
        const { schoolCode } = body;
        if (typeof schoolCode !== "string" || !schoolCode.trim() || schoolCode.length > 80) {
          return Response.json(
            { valid: false, message: "School code and PIN are required" },
            { status: 400 },
          );
        }
        const normalizedCode = String(schoolCode).trim().toUpperCase();
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const header = request.headers.get("authorization");
        if (!url || !key || !header?.startsWith("Bearer "))
          return Response.json(
            { valid: false, message: "Sign in with a verified teacher account." },
            { status: 401 },
          );
        const client = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: header } },
        });
        const { data: auth, error: authError } = await client.auth.getUser(header.slice(7));
        if (authError || !auth.user)
          return Response.json({ valid: false, message: "Please sign in again." }, { status: 401 });
        const { data: roles, error } = await client
          .from("user_roles")
          .select("role")
          .eq("user_id", auth.user.id)
          .eq("school_code", normalizedCode);
        if (!error && roles?.some((role) => role.role === "teacher" || role.role === "admin")) {
          return Response.json({ valid: true, schoolCode: normalizedCode });
        }
        return Response.json(
          { valid: false, message: "This account is not a verified teacher for this school." },
          { status: 403 },
        );
      },
    },
  },
});
