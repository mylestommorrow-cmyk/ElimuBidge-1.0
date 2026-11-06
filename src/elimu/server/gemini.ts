// Calls Google Gemini over REST (worker-safe). Returns null when no key or on failure,
// so callers fall back to curated curriculum responses.
export async function callGemini(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  systemInstruction: string,
): Promise<string | null> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return null;
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      },
    );
    if (!res.ok) {
      console.warn("Gemini error", res.status);
      return null;
    }
    const data: any = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: any) => p?.text ?? "")
      .join("");
    return text.trim() ? text : null;
  } catch (e) {
    console.warn("Gemini call failed", e);
    return null;
  }
}

export const hasGemini = () => {
  const k = process.env["GEMINI_API_KEY"];
  return !!k && k !== "MY_GEMINI_API_KEY";
};
