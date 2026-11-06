import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Users,
  School,
  Check,
  Heart,
  TrendingUp,
  Quote,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteShell } from "@/components/WebsiteShell";
import { LiveLearning } from "@/components/LiveLearning";
import { websiteMeta } from "@/lib/website-meta";
import hero from "@/assets/kenyan-learning-home.jpg";
export const Route = createFileRoute("/")({
  head: () =>
    websiteMeta(
      "Bridging Learning Gaps. Empowering Every Learner.",
      "Elimu Bridge connects learners, teachers and schools through accessible learning resources, assessments and AI-powered educational support.",
    ),
  component: Home,
});
function Home() {
  return (
    <WebsiteShell>
      <section className="home-hero">
        <img
          src={hero}
          alt="Kenyan learners studying together with a tablet and notebooks"
          width={1600}
          height={1008}
          fetchPriority="high"
        />
        <div className="site-container home-hero-content">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase text-learning-gold">
              <span className="h-px w-7 bg-learning-gold" />
              QUALITY EDUCATION. EVERY LEARNER.
            </p>
            <h1 className="home-headline">
              Bridging Learning Gaps.
              <br />
              <span className="text-learning-gold">Empowering Every Learner.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-hero-muted">
              Elimu Bridge connects learners, teachers and schools through accessible learning
              resources, assessments and AI-powered educational support.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-learning-gold text-learning-ink hover:bg-learning-gold/90"
              >
                <Link to="/auth">
                  Start Learning
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-hero-muted/50 bg-transparent text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"
              >
                <Link to="/school-mode">
                  Register Your School
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-hero-muted">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-learning-gold" />
                Kenya CBE learning
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-learning-gold" />
                English & Kiswahili
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-learning-gold" />
                At school. Anywhere.
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="border-b border-border bg-learning-tint">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-5 text-xs font-semibold text-primary">
          <span className="flex items-center gap-2">
            <BookOpen className="size-4 text-learning-teal" />
            From Playgroup to Grade 12
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 text-learning-teal" />
            For learners, teachers & schools
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-learning-teal" />
            Children’s privacy comes first
          </span>
        </div>
      </div>
      <LiveLearning />
      <section className="bg-learning-tint py-14 sm:py-16">
        <div className="site-container">
          <div className="mb-9 text-center">
            <p className="section-eyebrow justify-center">TWO PATHS. ONE SHARED PURPOSE.</p>
            <h2 className="section-heading">Learning that fits your world.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Together in a classroom. Independently at home. Always moving forward.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-lg border border-border bg-background p-7 sm:p-8">
              <School className="mb-6 size-8 text-primary" />
              <p className="mb-2 text-xs font-semibold text-learning-teal">FOR KENYAN SCHOOLS</p>
              <h3 className="text-2xl font-extrabold text-primary">School Mode</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Bring your school’s learning community closer, with resources for the people behind
                every lesson.
              </p>
              <ul className="my-6 space-y-3 text-sm text-muted-foreground">
                {[
                  "School portfolios and curriculum resources",
                  "Materials and assessments for verified teachers",
                  "A connected school learning journey",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="size-4 shrink-0 text-learning-teal" />
                    {t}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline">
                <Link to="/school-mode">
                  Explore School Mode
                  <ArrowUpRight />
                </Link>
              </Button>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Verified onboarding required. Class administration is not yet self-service.
              </p>
            </article>
            <article className="rounded-lg border border-learning-teal/25 bg-background p-7 sm:p-8">
              <BookOpen className="mb-6 size-8 text-learning-teal" />
              <p className="mb-2 text-xs font-semibold text-learning-teal">FOR CURIOUS MINDS</p>
              <h3 className="text-2xl font-extrabold text-primary">Independent Learning</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Make progress at your own pace, with a little support whenever you need it.
              </p>
              <ul className="my-6 space-y-3 text-sm text-muted-foreground">
                {[
                  "Public revision materials and practice quizzes",
                  "Personal learning progress across devices",
                  "Gemini-powered explanations and guidance",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="size-4 shrink-0 text-learning-teal" />
                    {t}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="bg-learning-teal text-hero-foreground hover:bg-learning-teal/90"
              >
                <Link to="/independent-learning">
                  Start Independent Learning
                  <ArrowUpRight />
                </Link>
              </Button>
            </article>
          </div>
        </div>
      </section>
      <section className="site-container py-14 sm:py-16">
        <p className="section-eyebrow">WHY ELIMU BRIDGE?</p>
        <h2 className="section-heading">More than resources. Room to grow.</h2>
        <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Knowledge within reach",
              text: "Accessible learning resources across Kenya’s CBE stages.",
            },
            {
              icon: Sparkles,
              title: "A little guidance, anytime",
              text: "AI-powered explanations in English and Kiswahili.",
            },
            {
              icon: Award,
              title: "Practice builds confidence",
              text: "Interactive assessments with worked explanations.",
            },
            {
              icon: TrendingUp,
              title: "See your next step",
              text: "Personal profiles and learning progress you can follow.",
            },
            {
              icon: Users,
              title: "Stronger, together",
              text: "School resources and tools to support teachers.",
            },
            {
              icon: Heart,
              title: "Opportunity for every learner",
              text: "A focus on underserved learning communities.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <Icon className="size-6 shrink-0 text-learning-teal" />
              <div>
                <h3 className="text-sm font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-learning-yellow-tint py-14">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">HOW IT WORKS</p>
              <h2 className="section-heading">Your journey starts with one step.</h2>
            </div>
            <Button asChild variant="link">
              <Link to="/how-it-works">
                See how it works
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-9 grid gap-7 md:grid-cols-3">
            {[
              [
                "01",
                "Create an account",
                "Start your learner account, or begin your teacher or school onboarding.",
              ],
              [
                "02",
                "Choose your learning path",
                "Join School Mode or explore Independent Learning.",
              ],
              [
                "03",
                "Learn and grow",
                "Access resources, practise assessments and track your progress.",
              ],
            ].map(([n, t, d]) => (
              <div key={n} className="border-t border-primary/20 pt-5">
                <span className="font-mono text-sm font-bold text-learning-teal">{n}</span>
                <h3 className="mt-4 text-lg font-bold text-primary">{t}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="site-container grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold text-learning-gold">
              <Sparkles className="size-4" />
              MEET MWALIMU AI
            </p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Your Learning Companion, Anytime.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-hero-muted">
              Ask a question. Explore a difficult topic. Get a fresh explanation. Our Gemini-powered
              learning assistant offers guided support in English and Kiswahili.
            </p>
            <Button
              asChild
              className="mt-7 bg-learning-gold text-learning-ink hover:bg-learning-gold/90"
            >
              <Link to="/app/$view" params={{ view: "tutor" }}>
                Ask Mwalimu AI
                <ArrowUpRight />
              </Link>
            </Button>
            <p className="mt-4 text-xs text-hero-muted">
              AI can make mistakes. Check important answers with your teacher.
            </p>
          </div>
          <div className="self-center border-l-2 border-learning-gold pl-7">
            <p className="text-sm text-hero-muted">A little curiosity goes a long way.</p>
            <p className="mt-6 text-xl font-semibold leading-9">“Why do plants need sunlight?”</p>
            <div className="mt-5 flex items-start gap-3">
              <Sparkles className="mt-1 size-5 shrink-0 text-learning-gold" />
              <p className="text-sm leading-8 text-hero-muted">
                Let’s explore photosynthesis together—one clear step at a time.
              </p>
            </div>
            <span className="mt-4 block text-[10px] text-hero-muted">
              Illustrative conversation · ask your own question in the tutor
            </span>
          </div>
        </div>
      </section>
      <section className="site-container py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow">
              <Globe className="size-4" />
              OUR SHARED AMBITION
            </p>
            <h2 className="section-heading">Every Learner Deserves an Opportunity to Succeed.</h2>
            <p className="mt-5 text-sm leading-8 text-muted-foreground">
              Real impact is built one learning moment at a time. Our live learning pulse reflects
              consented activity—not invented learner numbers or success rates.
            </p>
            <Button asChild variant="link" className="mt-4 px-0">
              <Link to="/about">
                Our mission
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="border-l-4 border-learning-teal pl-7">
            <Quote className="mb-4 size-7 text-learning-teal" />
            <p className="mb-2 text-xs font-bold text-learning-teal">COMMUNITY STORIES</p>
            <h3 className="text-xl font-bold text-primary">Your experience belongs here.</h3>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              Learner, teacher and school stories will appear here when shared with permission.
            </p>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">
              Placeholder · no testimonials published yet
            </p>
          </div>
        </div>
      </section>
      <section className="bg-learning-tint py-10">
        <div className="site-container flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">
              Let’s build your next possibility.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One lesson. One question. One step forward.
            </p>
          </div>
          <Button
            asChild
            className="bg-learning-teal text-hero-foreground hover:bg-learning-teal/90"
            size="lg"
          >
            <Link to="/auth">
              Get Started
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </WebsiteShell>
  );
}
