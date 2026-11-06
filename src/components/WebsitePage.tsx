import { WebsiteShell } from "./WebsiteShell";
import type { ReactNode } from "react";
export function WebsitePage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <WebsiteShell>
      <section className="bg-learning-tint py-12 sm:py-16">
        <div className="site-container">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-primary">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{intro}</p>
        </div>
      </section>
      <div className="site-container py-12 sm:py-16">{children}</div>
    </WebsiteShell>
  );
}
