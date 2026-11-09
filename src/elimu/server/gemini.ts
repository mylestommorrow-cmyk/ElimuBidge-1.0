// Calls Google Gemini over REST (worker-safe). Supports Search Grounding and model tiering:
// - gemini-4-argon for complex tasks
// - gemini-3.8-flash for general tasks with googleSearch grounding
// - gemini-3.1-flash-lite for fast tasks

export interface GeminiSource {
  title: string;
  url: string;
}

export interface GeminiResponse {
  text: string;
  sources?: GeminiSource[];
  modelUsed: string;
}

export type GeminiModelTier = "gemini-3.8-flash" | "gemini-4-argon" | "gemini-3.1-flash-lite";

export interface CallGeminiOptions {
  model?: GeminiModelTier;
  useSearch?: boolean;
}

export async function callGemini(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  systemInstruction: string,
  options: CallGeminiOptions = {},
): Promise<GeminiResponse | null> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return null;

  // When search grounding is requested, gemini-3.8-flash is required
  const model = options.useSearch ? "gemini-3.8-flash" : options.model || "gemini-3.8-flash";

  const bodyPayload: Record<string, unknown> = {
    contents,
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };

  if (options.useSearch) {
    bodyPayload["tools"] = [{ googleSearch: {} }];
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify(bodyPayload),
      },
    );

    if (!res.ok) {
      console.warn(`Gemini error for model ${model}:`, res.status);
      // If higher tier fails or lacks search support, fallback to flash-lite
      if (model !== "gemini-3.1-flash-lite") {
        return callGemini(contents, systemInstruction, {
          model: "gemini-3.1-flash-lite",
          useSearch: false,
        });
      }
      return null;
    }

    const data: any = await res.json();
    const candidate = data?.candidates?.[0];
    const text = (candidate?.content?.parts ?? [])
      .map((p: any) => p?.text ?? "")
      .join("")
      .trim();

    if (!text) return null;

    // Extract search grounding sources if present
    const sources: GeminiSource[] = [];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks;
    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk?.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      }
    }

    return {
      text,
      sources: sources.length > 0 ? sources.slice(0, 5) : undefined,
      modelUsed: model,
    };
  } catch (e) {
    console.warn("Gemini call failed", e);
    return null;
  }
}

export const hasGemini = () => {
  const k = process.env["GEMINI_API_KEY"];
  return !!k && k !== "MY_GEMINI_API_KEY";
};
