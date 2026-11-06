import {
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Gamepad2,
  Download,
  TrendingUp,
  Flame,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearnerProfile } from "@/elimu/types";
import type { AppView } from "@/lib/app-navigation";

interface Props {
  profile: LearnerProfile;
  offlineCount: number;
  streak: number;
  onNavigate: (view: AppView) => void;
  onProfiles: () => void;
}
export function LearningDashboard({
  profile,
  offlineCount,
  streak,
  onNavigate,
  onProfiles,
}: Props) {
  const actions = [
    {
      view: "library" as const,
      icon: BookOpen,
      title: "Learning library",
      subtitle: "Find your next lesson",
      color: "text-primary",
    },
    {
      view: "quizzes" as const,
      icon: Award,
      title: "Revision quizzes",
      subtitle: "Put your knowledge to the test",
      color: "text-learning-gold",
    },
    {
      view: "tutor" as const,
      icon: Sparkles,
      title: "Mwalimu AI",
      subtitle: "A little help, a big difference",
      color: "text-learning-green",
    },
    {
      view: "game" as const,
      icon: Gamepad2,
      title: "Games arcade",
      subtitle: "Make today’s revision playful",
      color: "text-learning-coral",
    },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-muted-foreground">YOUR LEARNING SPACE</p>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Hello, {profile.name.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-muted-foreground">A new day. Another step forward.</p>
        </div>
        <Button variant="outline" onClick={onProfiles}>
          <Users /> Learner profiles
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 border-y border-border py-6 lg:grid-cols-4">
        {[
          { icon: BookOpen, value: profile.completedTopicsCount, label: "Lessons completed" },
          { icon: TrendingUp, value: `${profile.averageScore}%`, label: "Average quiz score" },
          { icon: Flame, value: streak, label: "Day study streak" },
          { icon: Download, value: offlineCount, label: "Saved lessons" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <strong className="block text-2xl font-bold tabular-nums">{value}</strong>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          </div>
        ))}
      </div>
      <section className="py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Where will you begin?</h2>
          <span className="text-sm text-muted-foreground">{profile.grade}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map(({ view, icon: Icon, title, subtitle, color }) => (
            <Button
              key={view}
              variant="outline"
              className="h-auto min-h-40 flex-col items-start whitespace-normal p-5 text-left"
              onClick={() => onNavigate(view)}
            >
              <Icon className={`mb-4 size-7 ${color}`} />
              <span className="text-base font-bold">{title}</span>
              <span className="text-xs font-normal text-muted-foreground">{subtitle}</span>
              <ArrowRight className="mt-2 self-end" />
            </Button>
          ))}
        </div>
      </section>
      <div className="grid gap-8 border-t border-border pt-8 lg:grid-cols-2">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent quizzes</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("progress")}>
              View progress <ArrowRight />
            </Button>
          </div>
          {profile.recentQuizScores.length ? (
            <ul className="divide-y divide-border">
              {profile.recentQuizScores.map((quiz, i) => (
                <li
                  key={`${quiz.quizTitle}-${i}`}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{quiz.quizTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{quiz.date}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-bold text-primary">
                    {quiz.score}/{quiz.total}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-muted-foreground">
              Your first quiz result will appear here.
            </p>
          )}
        </section>
        <section className="border-l-4 border-learning-green pl-6">
          <Compass className="mb-4 size-8 text-learning-green" />
          <h2 className="text-xl font-bold">Follow your CBE pathway</h2>
          <p className="my-4 max-w-md text-sm leading-7 text-muted-foreground">
            Explore learning areas for {profile.grade}, then choose a lesson or assessment for
            today.
          </p>
          <Button onClick={() => onNavigate("curriculum")}>
            Explore curriculum <ArrowRight />
          </Button>
          {profile.weakAreas.length > 0 && (
            <div className="mt-7">
              <h3 className="text-sm font-bold">Next to revise</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {profile.weakAreas.slice(0, 3).map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
