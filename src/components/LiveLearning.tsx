import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Activity, BookOpen, Award, Users, ShieldCheck, Radio, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getLearningPulse } from "@/lib/learning.functions";
import { Button } from "@/components/ui/button";

export function LiveLearning() {
  const read = useServerFn(getLearningPulse);
  const query = useQuery({
    queryKey: ["learning-pulse"],
    queryFn: () => read(),
    refetchInterval: 30000,
    retry: 1,
  });
  const [connection] = useState("Live updates connected");
  const data = query.data;

  return (
    <section className="bg-background py-12 sm:py-16" aria-labelledby="live-heading">
      <div className="site-container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">
              <Radio className="size-4" />
              THE LEARNING PULSE
            </p>
            <h2 id="live-heading" className="section-heading">
              Learning Is Happening Right Now!
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Small steps. Shared momentum. A glimpse of our learning community.
            </p>
          </div>
          <span
            role="status"
            className="flex items-center gap-2 text-xs font-medium text-learning-green"
          >
            <span
              className={`size-2 rounded-full ${query.isError ? "bg-learning-gold" : "bg-learning-green"}`}
            />
            {query.isError ? "Learning data unavailable" : connection}
          </span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, value: data?.online, label: "Learners online" },
              { icon: BookOpen, value: data?.lessons, label: "Lessons completed today" },
              { icon: Award, value: data?.quizzes, label: "Quizzes attempted today" },
              { icon: Activity, value: data?.activities, label: "Learning activities today" },
            ].map(({ icon: Icon, value, label }) => (
              <article key={label} className="rounded-lg border border-border bg-muted/40 p-5">
                <Icon className="mb-5 size-5 text-learning-green" />
                <strong className="block text-3xl font-extrabold tabular-nums text-primary">
                  {value ? value.toLocaleString() : "—"}
                </strong>
                <p className="mt-2 text-xs text-muted-foreground">{label}</p>
              </article>
            ))}
          </div>
          <div className="border-l border-border pl-6">
            <h3 className="mb-4 text-sm font-bold">
              Across the community{" "}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Today · Kenya time
              </span>
            </h3>
            {data?.feed.length ? (
              <ul className="divide-y divide-border">
                {data.feed.map((item) => (
                  <li key={`${item.kind}-${item.subject}`} className="flex gap-3 py-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-learning-tint text-learning-green">
                      {item.kind === "quiz" ? (
                        <Award className="size-4" />
                      ) : (
                        <BookOpen className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        Learners completed {item.subject}{" "}
                        {item.kind === "quiz" ? "quizzes" : "lessons"}.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.count} activities · anonymous community total
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-52 flex-col items-start justify-center">
                <BookOpen className="mb-4 size-8 text-learning-green" />
                <h4 className="font-bold">The next learning story starts with you.</h4>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                  {query.isError
                    ? "We couldn’t reach the learning pulse. Please try again shortly."
                    : "No public activity to share yet. We publish only consented, grouped activity when enough learners participate."}
                </p>
                <Button asChild variant="link" className="mt-3 px-0">
                  <Link to="/auth">
                    Start your learning journey
                    <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="mt-6 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
          <ShieldCheck className="mt-1 size-4 shrink-0 text-learning-green" />
          Privacy first. Optional sharing, no names or school details. Groups need at least 5
          learners; small counts stay hidden.
        </p>
      </div>
    </section>
  );
}
