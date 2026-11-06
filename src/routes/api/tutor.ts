import { createFileRoute } from "@tanstack/react-router";
import { callGemini } from "@/elimu/server/gemini";
import { getCuratedTutorResponse } from "@/elimu/server/curated";
import { tutorRequestSchema } from "@/lib/ai-validation";
import { authorizeLiveAI } from "@/lib/ai-auth.server";

export const Route = createFileRoute("/api/tutor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (raw.length > 40000)
          return Response.json({ error: "Request too large" }, { status: 413 });
        let body: unknown;
        try {
          body = JSON.parse(raw);
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = tutorRequestSchema.safeParse(body);
        if (!parsed.success)
          return Response.json(
            { error: "Valid, bounded prompt and history are required" },
            { status: 400 },
          );
        const { prompt, language, learnerGrade, subject, history } = parsed.data;
        const live = await authorizeLiveAI(
          request,
          process.env["SUPABASE_URL"],
          process.env["SUPABASE_PUBLISHABLE_KEY"],
        );
        if (live === "limited")
          return Response.json(
            { error: "Please wait a minute before asking again." },
            { status: 429 },
          );

        const systemInstruction = `You are "Mwalimu AI", Kenya's premier AI curriculum specialist on the ElimuBridge Competency-Based Education (CBE) portal.
Your pedagogical focus:
- Kenyan CBE Framework (Playgroup through Grade 12) aligned with KICD standards and KNEC CBA evaluation rubrics.
- Learner level: ${learnerGrade}. Target Subject: ${subject}.
- Language instruction: ${
          language === "sw"
            ? "Kiswahili fasaha na msamiati sahihi wa kimasomo unaoeleweka kwa urahisi"
            : "English with encouraging, pedagogical clarity"
        }.

Core Directives for Accuracy & Interactivity:
1. Provide mathematically and scientifically precise answers. For calculations, show step-by-step reasoning with units (Ksh, kg, m/s, Joules, mol/dm³).
2. Connect concepts to authentic Kenyan realities (e.g., Lake Victoria fisheries, Rift Valley geography, Kenyan agricultural practices like Fanya Juu/Fanya Chini terracing, county devolution).
3. Be highly interactive: Always conclude with an interactive "🧠 Quick Challenge Question" or follow-up thought to test the student's understanding.
4. Format using clean Markdown with bold definitions, bulleted facts, and concise summary boxes.`;

        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (typeof item?.text !== "string") continue;
            contents.push({
              role: item.sender === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            });
          }
        }
        contents.push({ role: "user", parts: [{ text: prompt }] });

        const text = live === "allowed" ? await callGemini(contents, systemInstruction) : null;
        if (text) return Response.json({ text, source: "gemini-3.1-flash-lite" });
        return Response.json({
          text: getCuratedTutorResponse(prompt, language, learnerGrade),
          source: "curated-offline",
        });
      },
    },
  },
});
