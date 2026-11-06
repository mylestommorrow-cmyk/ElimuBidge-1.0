<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.

<!-- LOVABLE:END -->

- Imported ElimuBridge lives in src/elimu and renders client-only through AccountPortal and demo; preserve browser storage compatibility while keeping the public website SSR-safe.
- AI endpoints (src/routes/api/*) call Gemini over REST with curated fallbacks — keeps working without a key and is worker-safe.
- Website content uses top-level public routes; signed-in portal views live under the single _authenticated gate with URL navigation to preserve deep links and browser history.
- Account profiles use owner-scoped Cloud tables and protected server functions; legacy device data stays isolated in demo, and profile role labels never grant privileges.
- Offline registration is owned by src/lib/offline-app.ts; generated service workers must never register in preview or cache authentication/API responses.
- Render tutor and assessment Markdown through LearningMarkdown without raw HTML so model text remains readable and untrusted.
