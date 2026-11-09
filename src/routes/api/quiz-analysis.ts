import { createFileRoute } from "@tanstack/react-router";
import { callGemini } from "@/elimu/server/gemini";
import { quizRequestSchema } from "@/lib/ai-validation";
import { authorizeLiveAI } from "@/lib/ai-auth.server";

export const Route = createFileRoute("/api/quiz-analysis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (raw.length > 70000)
          return Response.json({ error: "Request too large" }, { status: 413 });
        let body: unknown;
        try {
          body = JSON.parse(raw);
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = quizRequestSchema.safeParse(body);
        if (!parsed.success)
          return Response.json(
            { error: "Valid quiz score and details are required" },
            { status: 400 },
          );
        const live = await authorizeLiveAI(request);

        if (live === "limited")
          return Response.json(
            { error: "Please wait a minute before requesting another report." },
            { status: 429 },
          );
        const percentage = Math.round((Number(score) / Number(total || 30)) * 100);

        const prompt = `Student Assessment Report:
- Exam: ${quizTitle} (${subject})
- Grade: ${gradeLevel}
- Score: ${score}/${total} (${percentage}%)
- Missed Topics: ${JSON.stringify(Array.isArray(missedQuestions) ? missedQuestions.slice(0, 5) : [])}
Please provide an encouraging, highly accurate 3-bullet personalized teacher's analysis:
1. **Strengths:** Praise the competencies demonstrated.
2. **Priority Remediation:** Explain the exact concept to review for the questions missed.
3. **Next Recommended Action:** 1 actionable study tip for this CBE grade level.`;

        const text =
          live === "allowed"
            ? await callGemini(
                [{ role: "user", parts: [{ text: prompt }] }],
                "You are a senior KICD & KNEC CBE Assessment Officer providing personalized student report card remarks.",
              )
            : null;
        if (text) return Response.json({ analysis: text, source: "gemini-3.1-flash-lite" });

        const feedback =
          percentage >= 80
            ? `🌟 **Exemplary Performance (${percentage}%):** Outstanding mastery of ${subject} competencies for ${gradeLevel}. Continue tackling advanced problem sets to solidify micro-credentials!`
            : percentage >= 50
              ? `👍 **Commendable Effort (${percentage}%):** Solid foundational understanding. Review the worked explanations for questions missed and attempt another practice CAT before term examinations.`
              : `📚 **Revision Recommended (${percentage}%):** Target core concepts in ${subject}. Open the Study Notes module or ask Mwalimu AI to walk you through step-by-step worked examples.`;
        return Response.json({ analysis: feedback, source: "curated-evaluator" });
      },
    },
  },
});
