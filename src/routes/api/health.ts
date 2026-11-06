import { createFileRoute } from "@tanstack/react-router";
import { hasGemini } from "@/elimu/server/gemini";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          status: "healthy",
          app: "ElimuBridge",
          offlineSupported: true,
          geminiActive: hasGemini(),
          model: "gemini-3.1-flash-lite",
        }),
    },
  },
});
