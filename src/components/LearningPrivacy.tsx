import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import {
  getLearningPrivacy,
  setLearningPrivacy,
  touchLearningPresence,
} from "@/lib/learning.functions";
import { toast } from "sonner";

export function LearningPrivacy() {
  const read = useServerFn(getLearningPrivacy),
    save = useServerFn(setLearningPrivacy),
    touch = useServerFn(touchLearningPresence);
  const client = useQueryClient();
  const { data, isError } = useQuery({ queryKey: ["learning-privacy"], queryFn: () => read() });
  const [open, setOpen] = useState(false),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!data?.sharing_enabled) return;
    const heartbeat = () => {
      if (document.visibilityState === "visible") void touch().catch(() => {});
    };
    heartbeat();
    const timer = setInterval(heartbeat, 45000);
    document.addEventListener("visibilitychange", heartbeat);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", heartbeat);
    };
  }, [data?.sharing_enabled, touch]);
  async function update(enabled: boolean) {
    setBusy(true);
    try {
      await save({ data: { enabled, confirmed: enabled && confirmed } });
      await client.invalidateQueries({ queryKey: ["learning-privacy"] });
      setOpen(false);
      setConfirmed(false);
      toast.success(
        enabled
          ? "Anonymous community sharing enabled."
          : "Sharing off. Your shared activity has been removed.",
      );
    } catch {
      toast.error("Could not save your privacy choice.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="border-b border-border bg-background px-4 py-3 text-xs sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="size-4 text-learning-green" />
          Community sharing:{" "}
          {isError ? "settings unavailable" : data?.sharing_enabled ? "on" : "off by default"}
        </p>
        <Button variant="link" size="sm" onClick={() => setOpen(!open)}>
          Privacy choices
        </Button>
      </div>
      {open && (
        <div className="max-w-xl space-y-3 pb-3 pt-2">
          <p className="leading-6 text-muted-foreground">
            Optional sharing adds completed lessons, quizzes and your online status to anonymous
            homepage totals. No names, scores, school details or contacts are published. Groups
            smaller than 5 stay hidden. Turning this off deletes your shared events. This choice
            covers every learner profile in this account.
          </p>
          {!data?.sharing_enabled && (
            <label className="flex items-start gap-2 leading-6">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1"
              />
              I am 18 or older, or the responsible parent/guardian authorising this optional sharing
              for all learners on this account.
            </label>
          )}
          <Button
            size="sm"
            disabled={busy || !data || (!data.sharing_enabled && !confirmed)}
            onClick={() => void update(!data?.sharing_enabled)}
          >
            {data?.sharing_enabled
              ? "Turn off and remove shared activity"
              : "Allow anonymous sharing"}
          </Button>
        </div>
      )}
    </div>
  );
}
